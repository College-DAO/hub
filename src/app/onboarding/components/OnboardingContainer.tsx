'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import If from '~/core/ui/If';
import CsrfTokenContext from '~/lib/contexts/csrf';
import Stepper from '~/core/ui/Stepper';

import OrganizationInfoStep, {
  OrganizationInfoStepData,
} from './OrganizationInfoStep';

import CompleteOnboardingStep from './CompleteOnboardingStep';
import PendingApprovalStep from './PendingApprovalStep'; // Import the new step
import OrganizationInvitesStep from '~/app/onboarding/components/OrganizationInvitesStep';
import MembershipRole from '~/lib/organizations/types/membership-role';

type Invite = {
  email: string;
  role: MembershipRole;
};

const STEPS: Array<string> = [
  'onboarding:info',
  'onboarding:invites',
  'onboarding:pendingApproval', // Update step name
];

function OnboardingContainer(
  props: React.PropsWithChildren<{
    csrfToken: string | null;
  }>,
) {
  const form = useForm({
    defaultValues: {
      data: {
        organization: '',
        invites: [] as Invite[],
      },
      currentStep: 0,
    },
  });

  const nextStep = useCallback(() => {
    form.setValue('currentStep', form.getValues('currentStep') + 1);
  }, [form]);

  const onInfoStepSubmitted = useCallback(
    (organizationInfo: OrganizationInfoStepData) => {
      form.setValue('data.organization', organizationInfo.organization);
      nextStep();
    },
    [form, nextStep],
  );

  const onInvitesStepSubmitted = useCallback(
    (invites: Invite[]) => {
      form.setValue('data.invites', invites);
      nextStep();
    },
    [form],
  );

  const currentStep = form.watch('currentStep');
  const formData = form.watch('data');

  const isStep = useCallback(
    (step: number) => currentStep === step,
    [currentStep],
  );

  return (
    <CsrfTokenContext.Provider value={props.csrfToken}>
      <Stepper variant={'default'} currentStep={currentStep} steps={STEPS} />

      <If condition={isStep(0)}>
        <OrganizationInfoStep onSubmit={onInfoStepSubmitted} />
      </If>

      <If condition={isStep(1)}>
        <OrganizationInvitesStep onSubmit={onInvitesStepSubmitted} />
      </If>

      <If condition={isStep(2) && formData}>
        <PendingApprovalStep data={formData} /> // Change to PendingApprovalStep
      </If>
    </CsrfTokenContext.Provider>
  );
}

export default OnboardingContainer;
