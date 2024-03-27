'use client';

import React, { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogContent, DialogTitle } from '~/core/ui/Dialog';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import { createClient } from '@supabase/supabase-js';
import Trans from '~/core/ui/Trans';
import Alert from '~/core/ui/Alert';
import { Skeleton } from "~/core/ui/skeleton"
import KPIForm from './KPIForm';
import {Kpi} from './KPIForm';
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
        partnershipName: string;
        partnershipType: string;
        partnershipFormat: string;
        durationStart: string;
        durationEnd: string;
        fundingAmount: string;
        details: string;
        sender_id: string;
        kpis: Kpi[];
    }>({
        partnerName: '',
        partnershipName: '',
        partnershipType: 'sent',
        partnershipFormat: '',
        durationStart: '',
        durationEnd: '',
        fundingAmount: '0',
        details: '',
        sender_id: '1',
        kpis: [],
    });
    const [error, setError] = useState<string | null>(null);

  
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("nice try~")
        
        try {
            const response = await fetch('/api/partnerships/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify(formData),
            });
            console.log(formData)
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
                            Create a name and select who you want to send your partnerships to
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="partnerName">Organization Name</Label>
                            {/* Ensure TextField.Input or equivalent component properly receives value and onChange */}
                            <TextField.Input id="partnerName" name="partnerName" value={formData.partnerName} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="partnershipName">Partnership Name</Label>
                            {/* Ensure TextField.Input or equivalent component properly receives value and onChange */}
                            <TextField.Input id="partnershipName" name="partnershipName" value={formData.partnershipName} onChange={handleInputChange} />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="Details">
                      <Card>
                        <CardHeader>
                          <CardTitle>Partnership Detail</CardTitle>
                          <CardDescription>
                            Provide a brief description of your partnership
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                            <Label htmlFor="partnershipFormat">Partnership Format</Label>
                            <TextField.Input id="partnershipFormat" name="partnershipFormat" value={formData.partnershipFormat} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="durationStart">Start Date</Label>
                            <TextField.Input id="durationStart" name="durationStart" value={formData.durationStart} onChange={handleInputChange}type="month" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="durationEnd">End Date</Label>
                            <TextField.Input id="durationEnd" name="durationEnd" value={formData.durationEnd} onChange={handleInputChange}type="month" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="fundingAmount">Funding</Label>
                            <TextField.Input id="fundingAmount" name="fundingAmount" value={formData.fundingAmount} onChange={handleInputChange}type="number" />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="KPI">
                      <Card>
                        <CardHeader>
                          <CardTitle>KPI's</CardTitle>
                          
                          <CardDescription>
                            Add KPI's to your partnership. Name is the name of the KPI, Date is when you expect to finish, and price is funding
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="space-y-1">
                          <KPIForm kpis={formData.kpis} setKpis={(newKpis) => setFormData({...formData, kpis: newKpis})} />
                          </div>
                          {/* Additional fields as needed */}
                        </CardContent>
                        <CardFooter className="flex justify-center">
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