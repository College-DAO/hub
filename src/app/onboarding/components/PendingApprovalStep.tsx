'use client';

import { useEffect, useRef } from 'react';
import useMutation from 'swr/mutation';
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import Alert from '~/core/ui/Alert';
import Trans from '~/core/ui/Trans';
import Spinner from '~/core/ui/Spinner';
import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';

import useApiRequest from '~/core/hooks/use-api';
import configuration from '~/configuration';

interface PendingApprovalStepData {
  organization: string;
  invites: Array<{
    email: string;
    role: number;
  }>;
}

const PendingApprovalStep: React.FC<{
  data: PendingApprovalStepData;
}> = ({ data }) => {
  const mutation = useOnboardingMutation();
  const submitted = useRef(false);
  const { trigger, data: response, error } = mutation;

  useEffect(() => {
    if (!submitted.current) {
      void trigger(data);
      submitted.current = true;
    }
  }, [data, trigger]);

  if (error) {
    return <ErrorState />;
  }

  if (response && response.success) {
    return <PendingApprovalState />;
  }

  return (
    <div
      className={
        'flex flex-1 flex-col items-center space-y-8 zoom-in-90 animate-in fade-in ease-out' +
        ' duration-1000 slide-in-from-bottom-8'
      }
    >
      <span>
        <Spinner className={'h-12 w-12'} />
      </span>

      <span>
        <Trans i18nKey={'onboarding:settingAccount'} />
      </span>
    </div>
  );
};

export default PendingApprovalStep;

function ErrorState() {
  return (
    <Alert type={'error'}>
      <Alert.Heading>
        <Trans i18nKey={'onboarding:errorAlertHeading'} />
      </Alert.Heading>

      <Trans i18nKey={'common:genericError'} />
    </Alert>
  );
}

function PendingApprovalState() {
  return (
    <section
      className={
        'mx-auto rounded-xl lg:p-16 fade-in' +
        ' bg-background animate-in slide-in-from-bottom-16' +
        ' zoom-in-95 duration-1000 ease-out'
      }
    >
      <div
        className={
          'flex flex-col space-y-8 items-center justify-center text-center'
        }
      >
        <CheckIcon
          className={
            'w-16 bg-yellow-500 p-1 text-white rounded-full ring-8' +
            ' ring-yellow-500/30 dark:ring-yellow-500/50'
          }
        />

        <Heading type={3}>
          <span className={'font-semibold mr-4'}>
            <Trans i18nKey={'onboarding:pendingApprovalHeading'} />
          </span>
          🎉
        </Heading>

        <p>
          <Trans i18nKey={'onboarding:pendingApprovalMessage'} />
        </p>
      </div>
    </section>
  );
}

function useOnboardingMutation() {
  const fetcher = useApiRequest<
    {
      success: boolean;
      returnUrl: string;
    },
    PendingApprovalStepData
  >();

  const mutationFn = async (
    _: string[],
    { arg }: { arg: PendingApprovalStepData },
  ) => {
    // Send an email to admin for approval
    await fetch('/api/send-approval-email', {
      method: 'POST',
      body: JSON.stringify(arg),
    });

    return fetcher({
      method: 'POST',
      path: '/onboarding/complete',
      body: arg,
    });
  };

  return useMutation(['pending-approval'], mutationFn);
}
