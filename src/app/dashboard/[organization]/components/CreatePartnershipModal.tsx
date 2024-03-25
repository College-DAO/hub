'use client';

import React, { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogContent, DialogTitle } from '~/core/ui/Dialog';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import { createClient } from '@supabase/supabase-js';
import Trans from '~/core/ui/Trans';
import Alert from '~/core/ui/Alert';

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
        sender_id: string;
    }>({
        partnerName: '',
        partnershipType: 'sent',
        duration: '',
        fundingAmount: '',
        details: '',
        sender_id: '1',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("nice try~")
        try{
          console.log("hello")
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user){
            let metadata = user.user_metadata
            console.log(metadata)
          }
          else
          console.log("no user!")
        }
        catch{
          console.log("no user!")
        }
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
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogTitle>Create New Partnership</DialogTitle>
                        <form onSubmit={handleSubmit}>
                        <div>
                          <TextField>
                            <TextField.Label>
                              <Trans i18nKey={'Desired Recepient'} />

                              <TextField.Input
                                data-cy={'create-partnership-name-input'}
                                name={'partnerName'}
                                required
                                minLength={2}
                                maxLength={50}
                                placeholder={'Coinbase'}
                                value={formData.partnerName}
                                onChange={handleChange}
                              />
                            </TextField.Label>
                          </TextField>
                          <TextField>
                            <TextField.Label>
                              <Trans i18nKey={'Partnership Details'} />

                              <TextField.Input
                                data-cy={'create-partnership-name-input'}
                                name={'details'}
                                required
                                minLength={2}
                                maxLength={50}
                                placeholder={'BASE Technical Workshops'}
                                value={formData.details}
                                onChange={handleChange}
                              />
                            </TextField.Label>
                            <TextField>
                            <TextField.Label>
                              <Trans i18nKey={'Funding'} />

                              <TextField.Input
                                data-cy={'create-partnership-name-input'}
                                name={'fundingAmount'}
                                required
                                minLength={2}
                                maxLength={50}
                                placeholder={'$550'}
                                value={formData.fundingAmount}
                                onChange={handleChange}
                              />
                            </TextField.Label>
                          </TextField>
                          <TextField>
                            <TextField.Label>
                              <Trans i18nKey={'Duration'} />
                              <TextField.Input
                                data-cy={'create-partnership-name-input'}
                                name={'duration'}
                                required
                                minLength={2}
                                maxLength={50}
                                placeholder={'4 Weeks'}
                                value={formData.duration}
                                onChange={handleChange}
                              />
                            </TextField.Label>
                          </TextField>
                          </TextField>
                        </div>
                        
                        <div>

                        </div>
                        <div>
                          <Button type="submit">Create Partnership</Button>
                          <Button type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
                        </div>
                      </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default CreatePartnershipModalToggle;
