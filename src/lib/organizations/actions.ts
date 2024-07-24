'use server';

import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import getSupabaseServerActionClient from '~/core/supabase/action-client';
import getLogger from '~/core/logger';
import { withSession } from '~/core/generic/actions-utils';

import { createOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import requireSession from '~/lib/user/require-session';
import { getUserDataById } from '~/lib/server/queries';
import { transferOwnership } from '~/lib/memberships/mutations';
import inviteMembers from '~/lib/server/organizations/invite-members';
import MembershipRole from '~/lib/organizations/types/membership-role';
import { getOrganizationByUid } from '~/lib/organizations/database/queries';
import sendEmail from '~/core/email/send-email';
import configuration from '~/configuration';
import removeMembership from '~/lib/server/organizations/remove-membership';
import deleteOrganization from '~/lib/server/organizations/delete-organization';
import { MEMBERSHIPS_TABLE } from '~/lib/db-tables';
import { getUserMembershipByOrganization } from '~/lib/memberships/queries';

export const createNewOrganizationAction = withSession(
  async (formData: FormData) => {
    const logger = getLogger();
    try {
      const organization = await z
        .string()
        .min(1)
        .max(50)
        .parseAsync(formData.get('organization'));

      const client = getSupabaseServerActionClient();
      const session = await requireSession(client);
      const userId = session.user.id;

      logger.info({ userId, organization }, `Creating organization...`);

      const { data: organizationUid, error } = await client
        .rpc('create_new_organization', {
          org_name: organization,
          create_user: false,
        })
        .throwOnError()
        .single();

      if (error) {
        throw new Error(`Error creating organization: ${error.message}`);
      }

      logger.info({ userId, organization }, `Organization successfully created`);

      cookies().set(
        createOrganizationIdCookie({
          userId,
          organizationUid,
        })
      );

      // Send notification email to the admin
      try {
        logger.info(`Attempting to send email notification to admin...`);
        const senderEmail = process.env.EMAIL_SENDER;
        if (!senderEmail) {
          throw new Error("Missing EMAIL_SENDER environment variable");
        }
        await sendEmail({
          from: senderEmail, // Use environment variable
          to: 'adalua@umich.edu', // Admin email
          subject: 'New Organization Created - Verification Required',
          text: `A new organization named "${organization}" has been created. Please verify the organization details and approve it as necessary.`,
          html: `<p>A new organization named <strong>${organization}</strong> has been created.</p>
                 <p>Please verify the organization details and approve it as necessary.</p>`,
        });
        logger.info(`Email notification sent to adalua@umich.edu`);
      } catch (emailError) {
        if (emailError instanceof Error) {
          logger.error(`Failed to send email notification: ${emailError.message}`);
        } else {
          logger.error(`Failed to send email notification: ${String(emailError)}`);
        }
      }

      const redirectPath = [configuration.paths.appHome, organizationUid].join('/');
      return redirect(redirectPath);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error in createNewOrganizationAction: ${error.message}`);
      } else {
        logger.error(`Error in createNewOrganizationAction: ${String(error)}`);
      }
      throw error;
    }
  }
);

export const transferOrganizationOwnershipAction = withSession(
  async (
    params: z.infer<
      ReturnType<typeof getTransferOrganizationOwnershipBodySchema>
    >,
  ) => {
    const result =
      await getTransferOrganizationOwnershipBodySchema().safeParseAsync(params);

    // validate the form data
    if (!result.success) {
      throw new Error(`Invalid form data`);
    }

    const logger = getLogger();
    const client = getSupabaseServerActionClient();

    const targetUserMembershipId = result.data.membershipId;
    const organizationUid = result.data.organizationUid;
    const session = await requireSession(client);

    const currentUserId = session.user.id;
    const currentUser = await getUserDataById(client, currentUserId);

    logger.info(
      {
        organizationUid,
        currentUserId,
        targetUserMembershipId,
      },
      `Transferring organization ownership...`,
    );

    // return early if we can't get the current user
    if (!currentUser) {
      throw new Error(`User is not logged in or does not exist`);
    }

    const { error, data: organization } = await getOrganizationByUid(
      client,
      organizationUid,
    );

    if (error || !organization) {
      logger.error(
        {
          organizationUid,
          currentUserId,
          targetUserMembershipId,
        },
        `Error retrieving organization`,
      );

      throw new Error(`Error retrieving organization`);
    }

    const membership = await getUserMembershipByOrganization(client, {
      organizationUid,
      userId: currentUserId,
    });

    if (!membership) {
      logger.error(
        {
          organizationUid,
          currentUserId,
          targetUserMembershipId,
        },
        `Error retrieving membership`,
      );

      throw new Error(`Error retrieving membership`);
    }

    if (membership.role !== MembershipRole.Owner) {
      logger.error(
        {
          organizationUid,
          currentUserId,
          targetUserMembershipId,
        },
        `Error transferring organization ownership. The user is not the owner of the organization`,
      );

      throw new Error(`Error transferring organization ownership`);
    }

    // transfer ownership to the target user
    const transferOwnershipResponse = await transferOwnership(client, {
      organizationId: organization.id,
      targetUserMembershipId,
    });

    if (transferOwnershipResponse.error) {
      logger.error(
        {
          error,
          organizationUid,
          currentUserId,
          targetUserMembershipId,
        },
        `Error transferring organization ownership`,
      );

      throw new Error(`Error transferring ownership`);
    }

    // all done! we log the result and return a 200
    logger.info(
      {
        organizationUid,
        currentUserId,
        targetUserMembershipId,
      },
      `Ownership successfully transferred to target user`,
    );

    revalidatePath('/', 'layout');

    return {
      success: true,
    };
  },
);

export const inviteMembersToOrganizationAction = withSession(
  async (payload: z.infer<ReturnType<typeof getInviteMembersBodySchema>>) => {
    const { invites, organizationUid } =
      await getInviteMembersBodySchema().parseAsync(payload);

    if (!organizationUid) {
      throw new Error(`Organization not found`);
    }

    const logger = getLogger();
    const client = getSupabaseServerActionClient();
    const session = await requireSession(client);
    const inviterId = session.user.id;

    // throw an error when we cannot retrieve the inviter's id or the organization id
    if (!inviterId) {
      throw new Error(`User is not logged in or does not exist`);
    }

    const adminClient = getSupabaseServerActionClient({ admin: true });

    const params = {
      client,
      adminClient,
      invites,
      organizationUid,
      inviterId,
    };

    try {
      // send requests to invite members
      await inviteMembers(params);

      logger.info(
        {
          organizationUid,
        },
        `Successfully invited members to organization`,
      );
    } catch (e) {
      const message = `Error when inviting user to organization`;

      logger.error(`${message}: ${JSON.stringify(e)}`);

      throw new Error(message);
    }

    const appHome = configuration.paths.appHome;
    const path = `settings/organization/members`;
    const redirectPath = [appHome, organizationUid, path].join('/');

    revalidatePath(redirectPath, 'page');

    redirect(redirectPath);
  },
);

export async function leaveOrganizationAction(data: FormData) {
  const logger = getLogger();
  const client = getSupabaseServerActionClient();
  const { user } = await requireSession(client);

  const id = z.coerce.number().parse(data.get('id'));

  // remove the user from the organization
  const params = {
    organizationId: id,
    userId: user.id,
  };

  await removeMembership(params);

  logger.info(params, `User successfully left organization`);

  // redirect to the app home page
  const redirectPath = configuration.paths.appHome;

  revalidatePath('/', 'layout');

  return redirect(redirectPath, RedirectType.replace);
}

export async function deleteOrganizationAction(data: FormData) {
  const client = getSupabaseServerActionClient();
  const { user } = await requireSession(client);
  const logger = getLogger();

  // validate the form data
  const id = z.coerce.number().parse(data.get('id'));

  const userId = user.id;
  const params = { organizationId: id, userId };

  logger.info(params, `User deleting organization...`);

  const membershipResponse = await client
    .from(MEMBERSHIPS_TABLE)
    .select('id, role')
    .eq('organization_id', id)
    .eq('user_id', userId)
    .single();

  if (membershipResponse.error) {
    logger.info(
      { ...params, error: membershipResponse.error },
      `Error deleting organization. The user is not a member of the organization`,
    );

    throw new Error(`Error deleting organization`);
  }

  const role = membershipResponse.data.role;
  const isOwner = role === MembershipRole.Owner;

  if (!isOwner) {
    logger.info(
      params,
      `Error deleting organization. The user is not the owner of the organization`,
    );

    throw new Error(`Error deleting organization`);
  }

  // delete the organization and all its data
  await deleteOrganization(client, {
    organizationId: id,
  });

  revalidatePath('/', 'layout');

  // redirect to the app home page
  return redirect(configuration.paths.appHome, RedirectType.replace);
}

function getInviteMembersBodySchema() {
  return z.object({
    organizationUid: z.string().uuid(),
    invites: z.array(
      z.object({
        role: z.nativeEnum(MembershipRole),
        email: z.string().email(),
      }),
    ),
  });
}

function getTransferOrganizationOwnershipBodySchema() {
  return z.object({
    membershipId: z.coerce.number(),
    organizationUid: z.string().uuid(),
  });
}

function handleError<Error = unknown>(
  error: Error,
  message: string,
  organizationId?: string,
) {
  const exception = error instanceof Error ? error.message : undefined;

  getLogger().error(
    {
      exception,
      organizationId,
    },
    message,
  );

  throw new Error(message);
}
