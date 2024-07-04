'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import Trans from '~/core/ui/Trans';
import KPIForm, { Kpi } from './KPIForm';
import { createClient } from '@supabase/supabase-js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/core/ui/card';
import Label from '~/core/ui/Label';
import Modal from '~/core/ui/Modal';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/core/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/core/ui/Select';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface Partnership {
  id: string;
  sender_id: number;
  sender_name: string;
  receiver_id: number;
  partnerName: string;
  partnershipName: string;
  partnershipType: string;
  partnershipFormat: string;
  durationStart: string;
  durationEnd: string;
  fundingAmount: number;
  details: string;
  kpis: Kpi[];
}

const CreatePartnershipModalToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    partnerName: string;
    partnershipName: string;
    partnershipType: string;
    partnershipFormat: string;
    durationStart: string;
    durationEnd: string;
    fundingAmount: number | undefined;
    details: string;
    sender_id: number | undefined;
    sender_name: string | undefined;
    receiver_id: number | undefined;
    kpis: Kpi[];
  }>({
    partnerName: '',
    partnershipName: '',
    partnershipType: 'sent',
    partnershipFormat: 'In-person event',
    durationStart: '',
    durationEnd: '',
    fundingAmount: 0,
    details: '',
    sender_id: undefined,
    sender_name: '',
    receiver_id: undefined,
    kpis: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [sentPartnership, setSentPartnership] = useState<Partnership | null>(null);

  const organization = useCurrentOrganization();
  const org_id = organization?.id;
  const org_name = organization?.name;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const fetchSearchResults = async (query: string) => {
    try {
      const url = `/api/partnerships/search?query=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        method: 'GET',
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
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectOrganization = (org: any, e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setFormData({
      ...formData,
      partnerName: org.name,
      receiver_id: org.id,
    });

    setSearchQuery(org.name);
    setSearchResults([]);
  };

  useEffect(() => {
    if (org_id) {
      setFormData(prevFormData => ({
        ...prevFormData,
        sender_id: org_id,
        sender_name: org_name,
      }));
    }
  }, [org_id, org_name]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      partnershipFormat: value,
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

      if (!response.ok) throw new Error('Failed to create partnership');
      const data = await response.json();
      setIsOpen(false);
      console.log('Partnership created successfully');
      setSentPartnership(data);
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
          <Tabs defaultValue="Recipient" className="w-full max-w-xl">
            <TabsList className="grid grid-cols-3 gap-5">
              <TabsTrigger value="Recipient">Recipient</TabsTrigger>
              <TabsTrigger value="Details">Details</TabsTrigger>
              <TabsTrigger value="KPI">KPI&apos;s</TabsTrigger>
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
                    <Select onValueChange={handleSelectChange} value={formData.partnershipFormat}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="In-person event">In-person event</SelectItem>
                          <SelectItem value="Online event">Online event</SelectItem>
                          <SelectItem value="Research">Research</SelectItem>
                          <SelectItem value="Consulting project">Consulting project</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="durationStart">Start Date</Label>
                    <TextField.Input id="durationStart" name="durationStart" value={formData.durationStart} onChange={handleInputChange} type="date" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="durationEnd">End Date</Label>
                    <TextField.Input id="durationEnd" name="durationEnd" value={formData.durationEnd} onChange={handleInputChange} type="date" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fundingAmount">Funding</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                      <TextField.Input
                        id="fundingAmount"
                        name="fundingAmount"
                        value={formData.fundingAmount}
                        onChange={handleInputChange}
                        type="number"
                        className="pl-7"
                      />
                    </div>
                    <span className="text-sm text-gray-500">USD</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="KPI">
              <Card>
                <CardHeader>
                  <CardTitle>KPI&apos;s</CardTitle>
                  <CardDescription>
                    Add KPI&apos;s to your partnership. Name is the name of the KPI, Date is when you expect to finish, and price is funding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <KPIForm kpis={formData.kpis} setKpis={(newKpis) => setFormData({ ...formData, kpis: newKpis })} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button type="submit">
                    <Trans i18nKey={'Send Partnership'} />
                  </Button>
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
