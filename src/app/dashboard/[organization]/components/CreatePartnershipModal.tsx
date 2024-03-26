'use client';

import React, { useState, useEffect} from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogContent, DialogTitle } from '~/core/ui/Dialog';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/core/ui/Dropdown';
import { createClient } from '@supabase/supabase-js';
import Trans from '~/core/ui/Trans';
import Alert from '~/core/ui/Alert';
import useCurrentOrganization from "~/lib/organizations/hooks/use-current-organization";
import Modal from '~/core/ui/Modal';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const CreatePartnershipModalToggle: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<{
        partnerName: string;
        partnershipType: string;
        duration: string;
        fundingAmount: string;
        details: string;
        sender_id: number | undefined;
        sender_name: string | undefined;
        recepient_id: number | undefined;
        recepient_name: string | undefined;
    }>({
        partnerName: '',
        partnershipType: 'sent',
        duration: '',
        fundingAmount: '',
        details: '',
        sender_id: 1,
        sender_name:'',
        recepient_id: 1,
        recepient_name: '',

    });
    const [error, setError] = useState<string | null>(null);
    const organzation = useCurrentOrganization();
    const org_id = organzation?.id;
    const org_name = organzation?.name

    useEffect(() => {
      // Update formData whenever org_id changes and is not undefined
      if (org_id) {
          setFormData(prevFormData => ({
              ...prevFormData,
              sender_id: org_id,
              sender_name: org_name
          }));
      }
  }, [org_id]);
      

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        try {
            const response = await fetch('/api/partnerships/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to create partnership');
            setIsOpen(false); // Close modal on success
            console.log('Partnership created successfully');
        } catch (error: any) {
            console.error('Error creating partnership:', error.message);
            setError(error.message);
        }
    };

    return (
      <>
        <Button size={'sm'} variant={'outline'} onClick={() => setIsOpen(true)}>
            <PlusCircleIcon className={'w-4 mr-2'} />
            <span>Add Partnership</span>
        </Button>
    
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading="Create New Partnership" closeButton>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField>
                    <TextField.Label>
                        <Trans i18nKey={'Desired Recipient'} />
                    </TextField.Label>
                    <TextField.Input 
                      name="partnerName" 
                      required 
                      minLength={2} 
                      maxLength={50} 
                      placeholder="Coinbase" 
                      value={formData.partnerName} 
                      onChange={handleChange}
                    />
                </TextField>
    
                {/* Partnership Details */}
                <TextField>
                    <TextField.Label>
                        <Trans i18nKey={'Partnership Details'} />
                    </TextField.Label>
                    <TextField.Input 
                      name="details" 
                      required 
                      minLength={2} 
                      maxLength={50} 
                      placeholder="Workshop" 
                      value={formData.details} 
                      onChange={handleChange}
                    />
                </TextField>
    
                {/* Funding Amount */}
                <TextField>
                    <TextField.Label>
                        <Trans i18nKey={'Funding'} />
                    </TextField.Label>
                    <TextField.Input 
                      name="fundingAmount" 
                      required 
                      type="number" 
                      placeholder="99" 
                      value={formData.fundingAmount} 
                      onChange={handleChange}
                    />
                </TextField>
    
                {/* Duration */}
                <TextField>
                    <TextField.Label>
                        <Trans i18nKey={'Duration'} />
                    </TextField.Label>
                    <TextField.Input 
                      name="duration" 
                      required 
                      minLength={1} 
                      maxLength={50} 
                      placeholder="4" 
                      value={formData.duration} 
                      onChange={handleChange}
                    />
                </TextField>
                {/* Error Display */}
                {error && <p className="text-red-500">{error}</p>}
    
                {/* Submit and Cancel Buttons */}
                <div className="flex justify-end space-x-2">
                    <Modal.CancelButton onClick={() => setIsOpen(false)}><Trans i18nKey={'common:cancel'} /></Modal.CancelButton>
                    <Button type="submit"><Trans i18nKey={'Send Partnership'} /></Button>
                </div>
            </form>
        </Modal>
      </>
    );
    
    }
export default CreatePartnershipModalToggle;
