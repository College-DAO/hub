// /app/api/onboarding/initiate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import getLogger from '~/core/logger';
import requireSession from '~/lib/user/require-session';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';
import sendEmail from '~/core/email/send-email';
import MembershipRole from '~/lib/organizations/types/membership-role';

export const POST = async (req: NextRequest) => {
  console.log("HELLO")
  const logger = getLogger();
  const client = getSupabaseRouteHandlerClient();
  const session = await requireSession(client);
  const userId = session.user.id;

  const body = await getOnboardingBodySchema().parseAsync(await req.json());
  const organizationName = body.organization;
  const invites = body.invites;

  logger.info(
    {
      userId,
    },
    `Initiating onboarding for user...`,
  );

  // Save the pending organization to the database
  const { data: organizationData, error } = await client
    .from('organizations')
    .insert({
      name: organizationName,
      // Use type assertion to bypass TypeScript checks
      created_by: userId,
      status: 'pending',
    } as any)
    .select('id')
    .single();

  if (error) {
    logger.error(
      {
        error,
        userId,
      },
      `Error initiating onboarding for user`,
    );

    return NextResponse.json({ success: false }, { status: 500 });
  }

  const organizationUid = organizationData?.id;

  // Send approval email to admin
  await sendEmail({
    from: 'noreply@yourdomain.com',
    to: 'admin@collegedao.io',
    subject: 'New Organization Approval Request',
    html: `
      <p>A new organization "${organizationName}" has been requested.</p>
      <p>Click the following link to approve: ${process.env.NEXT_PUBLIC_URL}/api/approve-organization?id=${organizationUid}</p>
      <p>Click the following link to reject: ${process.env.NEXT_PUBLIC_URL}/api/reject-organization?id=${organizationUid}</p>
    `,
  });

  logger.info(
    {
      userId,
      organizationUid,
    },
    `Onboarding initiation successful for user`,
  );

  return NextResponse.json({
    success: true,
    organizationId: organizationUid,
  });
};

function getOnboardingBodySchema() {
  return z.object({
    organization: z.string().trim().min(1),
    invites: z.array(
      z.object({
        email: z.string().email(),
        role: z.nativeEnum(MembershipRole),
      }),
    ),
  });
}