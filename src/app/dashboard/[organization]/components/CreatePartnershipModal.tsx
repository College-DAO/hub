'use client';

import React, { useState, useEffect } from 'react';
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
import useCurrentOrganization from "~/lib/organizations/hooks/use-current-organization";
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
        fundingAmount:  number | undefined;
        details: string;
        sender_id: number | undefined;
        sender_name: string | undefined;
        receiver_id: number | undefined;
        recepient_name: string | undefined;
        kpis: Kpi[];
    }>({
        partnerName: '',
        partnershipName: '',
        partnershipType: 'sent',
        partnershipFormat: '',
        durationStart: '',
        durationEnd: '',
        fundingAmount: 0,
        details: '',
        sender_id: 1,
        sender_name:'',
        receiver_id: 1,
        recepient_name: '',
        kpis: [],
    });
    const [error, setError] = useState<string | null>(null);

    const organzation = useCurrentOrganization();
    const org_id = organzation?.id;
    const org_name = organzation?.name
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const fetchSearchResults = async (query: string) => {
      try {
        const url = `/api/partnerships/search?query=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
          method: 'GET', // Explicitly set the method for clarity
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setSearchResults([]);
      }
    };
    

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (searchQuery.length > 2) {
          fetchSearchResults(searchQuery);
        } else {
          setSearchResults([]);
        }
      }, 1000); // Adding debounce
    
      return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSelectOrganization = (org: any, e: React.MouseEvent<HTMLLIElement>) => {
      e.preventDefault(); // Prevent default behavior
      e.stopPropagation(); // Stop the event from propagating further
    
      setFormData({
        ...formData,
        partnerName: org.name, // Update formData with the selected organization's name
        receiver_id: org.id,
      });
    
      setSearchQuery(org.name); // Optionally update the search query to reflect the selected organization's name
      setSearchResults([]); // Clear search results
    };
    
    

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
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
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
        Search and select the organization you want to send your partnership to.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="searchOrganization">Search Organization</Label>
            <TextField.Input
              id="searchOrganization"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="Search organizations..."
                              className="input-class" 
                            />
                            <ul className="search-results-class"> 
                              {searchResults.map((org) => (
                                <li key={org.id} onClick={(e) => handleSelectOrganization(org, e)} className="cursor-pointer">
                                {org.name}
                              </li>
                              ))}
                            </ul>
                          </div>
                          {/* Include the Partnership Name input here if needed */}
                          <div className="space-y-1">
                            <Label htmlFor="partnershipName">Partnership Name</Label>
                            <TextField.Input
                              id="partnershipName"
                              name="partnershipName"
                              value={formData.partnershipName}
                              onChange={handleInputChange}
                            />
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