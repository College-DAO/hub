import type { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/database.types';
import sendEmail from '~/core/email/send-email';
import getLogger from '~/core/logger';

interface Params {
  organizationName: string;
  client: SupabaseClient<Database>;
}

/**
 * @name completeOnboarding
 * @description Handles the submission of the onboarding flow. By default,
 * we use the submission to create the Organization and the user record
 * associated with the User who signed up using its ID
 * @param organizationName
 * @param client
 */
async function completeOnboarding({ organizationName, client }: Params) {
  const logger = getLogger();

  try {
    // Create organization
    const organizationUid = await client
      .rpc('create_new_organization', {
        org_name: organizationName,
      })
      .single<string>()

    
      if (!organizationUid) {
        throw new Error(`Error creating organization: UID not returned`);
      }
      
      logger.info({ organizationUid, organizationName }, `Organization successfully created`);

    // Send email notification to admin
    try {
      const senderEmail = process.env.EMAIL_SENDER;
      if (!senderEmail) {
        throw new Error("Missing EMAIL_SENDER environment variable");
      }
      await sendEmail({
        from: senderEmail,
        to: 'admin@collegedao.io', // Admin email
        subject: 'New Organization Created - Verification Required',
        text: `A new organization named "${organizationName}" has been created. Please verify the organization details and approve it as necessary.`,
        html: `<p>A new organization named <strong>${organizationName}</strong> has been created.</p>
               <p>Please verify the organization details and approve it as necessary.</p>`,
      });
      logger.info(`Email notification sent to admin`);
    } catch (emailError) {
      logger.error(`Failed to send email notification:`);
    }

    return organizationUid;
  } catch (error) {
    logger.error(`Error in completeOnboarding: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

export default completeOnboarding;

