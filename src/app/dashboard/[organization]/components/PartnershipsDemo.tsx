'use client';

import React, { useEffect, useState } from 'react';
import { Line, ResponsiveContainer, LineChart, XAxis } from 'recharts';
import { useMemo } from 'react';
import { getOrganizationsByUserId } from '~/lib/organizations/database/queries';
import Tile from '~/core/ui/Tile';
import Heading from '~/core/ui/Heading';
import useUserSession from '~/core/hooks/use-user-session';
import { getUserById } from '~/lib/user/database/queries';
import { getPartnerships } from '~/lib/partnerships/queries'
import Partnership from '~/lib/partnerships/partnership';
import useSWR from 'swr';
import useSupabase from '~/core/hooks/use-supabase';
import KPIForm, { Kpi } from './KPIForm';
import useCurrentOrganization from "~/lib/organizations/hooks/use-current-organization";
import Button from '~/core/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/core/ui/Table';
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
import TextField from '~/core/ui/TextField';
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

interface PartnershipsTableProps {
  type: 'sent' | 'received';
}
interface EditPartnershipModalProps {
  partnership: Partnership | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function PartnershipsDemo() {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // State to manage the modal
  const [editPartnership, setEditPartnership] = useState<Partnership | null>(null);

  const handleEdit = (partnership: Partnership) => {
    setEditPartnership(partnership);
    setIsEditModalOpen(true); // Open the modal
  };

  return (
    <div className={'flex flex-col space-y-6 pb-36'}>
      <div>
        <Tile>
          <Tile.Heading>Sent Requests</Tile.Heading>
          <Tile.Body>
            <PartnershipsTable type="sent" handleEdit={handleEdit} />
          </Tile.Body>
        </Tile>
      </div>
      <div>
        <Tile>
          <Tile.Heading>Received Requests</Tile.Heading>
          <Tile.Body>
            <PartnershipsTable type="received" handleEdit={handleEdit} />
          </Tile.Body>
        </Tile>
      </div>
      {editPartnership && (
        <EditPartnershipModal
          partnership={editPartnership}
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
        />
      )}
    </div>
  );
}

function PartnershipsTable({ type, handleEdit }: PartnershipsTableProps & { handleEdit: (partnership: Partnership) => void }) {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const organization = useCurrentOrganization();
  const org_id = organization?.id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/partnerships?type=${type}&userId=${org_id}`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setPartnerships(data);
      } catch (error) {
        console.error('Error fetching partnerships:', error);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, org_id]);  // Re-fetch the data when the "type" or "org_id" prop changes

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sender</TableHead>
          <TableHead>Receiver</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Funding</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {partnerships.map((partnership) => (
          <TableRow key={partnership.id}>
            <TableCell>{partnership.sender_name}</TableCell>
            <TableCell>{partnership.partner_name}</TableCell>
            <TableCell>{partnership.partnership_name}</TableCell>
            <TableCell>{`$${partnership.funding}`}</TableCell>
            <TableCell>{partnership.durationEnd}</TableCell>
            <TableCell>
              <Tile.Badge trend={partnership.status}>Active</Tile.Badge>
            </TableCell> 
            {type === 'sent' && (
              <TableCell>
                <Button onClick={() => handleEdit(partnership)}>Edit</Button>
              </TableCell>
            )}
            {type === 'received' && (
              <TableCell>
                <Button onClick={() => handleView(partnership)}>View</Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const EditPartnershipModal: React.FC<EditPartnershipModalProps> = ({
  partnership,
  isOpen,
  setIsOpen,
}) => {
  const [formData, setFormData] = useState({
    partnerName: partnership?.partner_name || '',
    partnershipName: partnership?.partnership_name || '',
    partnershipType: partnership?.type || 'sent',
    partnershipFormat: partnership?.format || 'In-person event',
    durationStart: partnership?.duration_start || '',
    durationEnd: partnership?.duration_end || '',
    fundingAmount: partnership?.funding || 0,
    details: partnership?.details || '',
    sender_id: partnership?.sender_id || undefined,
    sender_name: partnership?.sender_name || undefined,
    receiver_id: partnership?.receiver_id || undefined,
    kpis: partnership?.kpis || [],
  });

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
      const response = await fetch(`/api/partnerships/update?id=${partnership?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update partnership');
      setIsOpen(false);
      console.log('Partnership updated successfully');
    } catch (error: any) {
      console.error('Error updating partnership:', error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading="Edit Partnership">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Tabs defaultValue="Recipient" className="w-full max-w-xl">
          <TabsList className="grid grid-cols-3 gap-5">
            <TabsTrigger value="Recipient">Recipient</TabsTrigger>
            <TabsTrigger value="Details">Details</TabsTrigger>
            <TabsTrigger value="KPI">KPI's</TabsTrigger>
          </TabsList>

          <TabsContent value="Recipient">
            <Card>
              <CardHeader>
                <CardTitle>Edit Partnership</CardTitle>
                <CardDescription>
                  Edit the details of the partnership.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
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
                  <TextField.Input
                    id="durationStart"
                    name="durationStart"
                    value={formData.durationStart}
                    onChange={handleInputChange}
                    type="date"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="durationEnd">End Date</Label>
                  <TextField.Input
                    id="durationEnd"
                    name="durationEnd"
                    value={formData.durationEnd}
                    onChange={handleInputChange}
                    type="date"
                  />
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
                <CardTitle>KPI's</CardTitle>
                <CardDescription>
                  Add KPI's to your partnership. Name is the name of the KPI, Date is when you expect to finish, and price is funding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <KPIForm kpis={formData.kpis} setKpis={(newKpis) => setFormData({ ...formData, kpis: newKpis })} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Modal>
  );
};
