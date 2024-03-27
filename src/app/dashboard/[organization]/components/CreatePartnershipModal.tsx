'use client';

import React, { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogContent, DialogTitle } from '~/core/ui/Dialog';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import { createClient } from '@supabase/supabase-js';
import Trans from '~/core/ui/Trans';
import Alert from '~/core/ui/Alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/core/ui/card';
import Label from "~/core/ui/Label"
import Modal from "~/core/ui/Modal"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/core/ui/tabs';

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
        fundingAmount: '0',
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

              <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading="Create New Partnership">
              <form onSubmit={handleSubmit} className="space-y-4"> 
              <Tabs defaultValue="Recepient" className="w-full max-w-xl">
                <TabsList className="grid grid-cols-3 gap-5">
                  <TabsTrigger value="Recipient">Recipient</TabsTrigger>
                  <TabsTrigger value="Details">Details</TabsTrigger>
                  <TabsTrigger value="KPI">KPI's</TabsTrigger>
                </TabsList>

                <TabsContent value="Recipient">
                  <Card>
                    <CardHeader>
                      <CardTitle>Partnership Recipient</CardTitle>
                      <CardDescription>
                        Give a breif description of your partnership and who you want to send it to
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="name">Organization Name</Label>
                        <TextField.Input id="name" defaultValue="" type="search" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="username">Short Description</Label>
                        <TextField.Input id="details" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="Details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Details</CardTitle>
                      <CardDescription>
                        Describe your partnership details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="current">Type of Partnership</Label>
                        <TextField.Input id="current"  />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new">Start Date</Label>
                        <TextField.Input id="new" type="month" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new">End Date</Label>
                        <TextField.Input id="new" type="month" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="funding">Funding</Label>
                        <TextField.Input id="funding" type="number" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="funding">Short Description</Label>
                        <TextField.Input id="funding"  />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="KPI">
                  <Card>
                    <CardHeader>
                      <CardTitle>KPI's for the partnership</CardTitle>
                      <CardDescription>
                        Create all the KPI's needed for the partnership.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="name">Goal</Label>
                        <TextField.Input id="name" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="username">Short Description</Label>
                        <TextField.Input id="details" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Modal.CancelButton onClick={() => setIsOpen(false)}><Trans i18nKey={'common:cancel'} /></Modal.CancelButton>
                      <Button type="submit"><Trans i18nKey={'Send Partnership'} /></Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
              </form>
              
            </Modal>
</>
);
};

export default CreatePartnershipModalToggle; 