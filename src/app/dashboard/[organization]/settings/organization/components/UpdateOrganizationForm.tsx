'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import type { SupabaseClient } from '@supabase/supabase-js';

import OrganizationContext from '~/lib/contexts/organization';
import useUpdateOrganizationMutation from '~/lib/organizations/hooks/use-update-organization-mutation';

import Label from '~/core/ui/Label';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import Trans from '~/core/ui/Trans';
import ImageUploader from '~/core/ui/ImageUploader';

import useSupabase from '~/core/hooks/use-supabase';
import type Organization from '~/lib/organizations/types/organization';
import type Socials from '~/lib/organizations/types/socials';
import SocialsForm from './AddSocialsForm';

const UpdateOrganizationForm = () => {
  const { organization, setOrganization } = useContext(OrganizationContext);
  const updateOrganizationMutation = useUpdateOrganizationMutation();
  const { t } = useTranslation('organization');

  const currentOrganizationName = organization?.name ?? '';
  const currentOrganizationEmail = organization?.email ?? '';
  const currentOrganizationType = organization?.type ?? '';
  const currentOrganizationSocials = organization?.socials;
  const organizationId = organization?.id as number;

  const [socials, setSocials] = useState<Socials[]>([]); // State to hold socials

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: currentOrganizationName,
      email: currentOrganizationEmail,
      type: currentOrganizationType,
      socials: currentOrganizationSocials,
    },
  });

  const updateOrganizationData = useCallback(
    (data: WithId<Partial<Organization>>) => {
      const promise = updateOrganizationMutation.trigger(data).then(() => {
        setOrganization({
          ...organization,
          ...data,
        } as Organization);
      });

      toast.promise(promise, {
        loading: t(`updateOrganizationLoadingMessage`),
        success: t(`updateOrganizationSuccessMessage`),
        error: t(`updateOrganizationErrorMessage`),
      });
    },
    [organization, setOrganization, t, updateOrganizationMutation]
  );

  const onSubmit = useCallback(
    async (organizationInput: Partial<Organization>) => {
      const organizationId = organization?.id;

      if (!organizationId) {
        const errorMessage = t(`updateOrganizationErrorMessage`);

        return toast.error(errorMessage);
      }

      const organizationData: WithId<Partial<Organization>> = {
        id: organizationId,
        name: organizationInput.name,
        email: organizationInput.email,
        type: organizationInput.type,
        socials: socials,
      };

      return updateOrganizationData(organizationData);
    },
    [organization?.id, updateOrganizationData, t, socials]
  );

  useEffect(() => {
    reset({
      name: organization?.name,
      email: organization?.email,
      type: organization?.type,
      socials: organization?.socials,
    });
  }, [organization, reset]);

  const nameControl = register('name', {
    required: true,
  });

  const emailControl = register('email', {
    required: false,
  });

  return (
    <div className={'space-y-8'}>
      <UploadLogoForm
        currentLogoUrl={organization?.logoURL}
        organizationId={organizationId}
        onLogoUpdated={async (logoUrl) => {
          return updateOrganizationData({
            logoURL: logoUrl,
            id: organizationId,
          });
        }}
      />

      <form
        onSubmit={handleSubmit((value) => onSubmit(value))}
        className={'flex flex-col space-y-4'}
      >
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'organization:organizationNameInputLabel'} />

            <TextField.Input
              {...nameControl}
              data-cy={'organization-name-input'}
              required
              placeholder={''}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'organization:organizationEmailInputLabel'} />

            <TextField.Input
              {...emailControl}
              data-cy={'organization-email-input'}
              required
              placeholder={''}
            />
          </TextField.Label>
        </TextField>
        <div>
          <Label>
            <Trans i18nKey={'organization:organizationTypeInputLabel'} />
            <select
              {...register('type', { required: true })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
              data-cy={'organization-type-select'}
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="club">Club</option>
              <option value="company">Company</option>
            </select>
          </Label>
        </div>

        <SocialsForm socials={socials} setSocials={setSocials} />

        <div>
          <Button
            className={'w-full md:w-auto'}
            data-cy={'update-organization-submit-button'}
            loading={updateOrganizationMutation.isMutating}
          >
            <Trans i18nKey={'organization:updateOrganizationSubmitLabel'} />
          </Button>
        </div>
      </form>
    </div>
  );
};

function UploadLogoForm(props: {
  currentLogoUrl: string | null | undefined;
  organizationId: number;
  onLogoUpdated: (url: string | null) => void;
}) {
  const client = useSupabase();
  const { t } = useTranslation('organization');

  const createToaster = useCallback(
    (promise: Promise<unknown>) => {
      return toast.promise(promise, {
        loading: t(`updateOrganizationLoadingMessage`),
        success: t(`updateOrganizationSuccessMessage`),
        error: t(`updateOrganizationErrorMessage`),
      });
    },
    [t]
  );

  const onValueChange = useCallback(
    async (file: File | null) => {
      const removeExistingStorageFile = () => {
        if (props.currentLogoUrl) {
          return deleteLogo(client, props.currentLogoUrl);
        }

        return Promise.resolve();
      };

      if (file) {
        const promise = removeExistingStorageFile()
          .then(() =>
            uploadLogo({
              client,
              organizationId: props.organizationId,
              logo: file,
            })
          )
          .then((url) => {
            props.onLogoUpdated(url);
          });

        createToaster(promise);
      } else {
        const promise = removeExistingStorageFile().then(() => {
          props.onLogoUpdated(null);
        });

        createToaster(promise);
      }
    },
    [client, createToaster, props]
  );

  return (
    <ImageUploader value={props.currentLogoUrl} onValueChange={onValueChange}>
      <div className={'flex flex-col space-y-1'}>
        <span className={'text-sm'}>
          <Trans i18nKey={'organization:organizationLogoInputHeading'} />
        </span>

        <span className={'text-xs'}>
          <Trans i18nKey={'organization:organizationLogoInputSubheading'} />
        </span>
      </div>
    </ImageUploader>
  );
}

async function uploadLogo({
  client,
  organizationId,
  logo,
}: {
  client: SupabaseClient;
  organizationId: number;
  logo: File;
}) {
  const bytes = await logo.arrayBuffer();
  const bucket = client.storage.from('logos');
  const fileName = await getLogoName(logo.name, organizationId);

  const result = await bucket.upload(fileName, bytes, {
    upsert: true,
    contentType: logo.type,
  });

  if (!result.error) {
    return bucket.getPublicUrl(fileName).data.publicUrl;
  }

  throw result.error;
}

async function getLogoName(fileName: string, organizationId: number) {
  const { nanoid } = await import('nanoid');
  const uniqueId = nanoid(16);
  const extension = fileName.split('.').pop();

  return `${organizationId}.${extension}?v=${uniqueId}`;
}

function deleteLogo(client: SupabaseClient, url: string) {
  const bucket = client.storage.from('logos');
  const fileName = url.split('/').pop()?.split('?')[0];

  if (!fileName) {
    return Promise.reject(new Error('Invalid file name'));
  }

  return bucket.remove([fileName]);
}

export default UpdateOrganizationForm;
