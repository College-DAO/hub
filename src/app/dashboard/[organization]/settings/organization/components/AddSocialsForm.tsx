import React from 'react';
import { Button } from '~/core/ui/Button';
import { Input } from '~/core/ui/input';
import Label from '~/core/ui/Label';
import { Skeleton } from '~/core/ui/skeleton';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import type Socials from '~/lib/organizations/types/socials';


type SocialsFormProps = {
  socials: Socials[];
  setSocials: (socials: Socials[]) => void;
};

function SocialsForm({ socials, setSocials }: SocialsFormProps) {
  const addSocial = () => {
    setSocials([...socials, { name: '', url: ''}]);
  };

  const deleteSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const updateSocial = (index: number, field: keyof Socials, value: string) => {
    const newSocials = socials.map((social, i) => 
        i === index ? { ...social, [field]: value } : social
    );
    setSocials(newSocials);
  };

  return (
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}> 
      {socials.map((social, index) => (
        <Skeleton key={index} className="p-4 mb-4 relative">
          <Button
            type="button"
            onClick={() => deleteSocial(index)}
            className="absolute top-1 right-2 text-red-500 focus:outline-none focus:ring-0 bg-transparent" // Position the delete button
          >
            <MinusCircleIcon className="h-5 w-5" />
          </Button>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={social.name}
              onChange={(e) => updateSocial(index, 'name', e.target.value)}
              placeholder="Enter KPI name"
            />
            <Label>Link</Label>
            <Input
              value={social.url}
              onChange={(e) => updateSocial(index, 'url', e.target.value)}
            />
          </div>
        </Skeleton>
      ))}
      <div className="flex justify-start">
        <Button type="button" size={'sm'} variant={'outline'} onClick={addSocial} className="mt-4">
          <PlusCircleIcon className={'w-4 mr-2'} />
          <span>Add Social</span>
        </Button>
      </div>
    </div>
  );
}

export default SocialsForm;
