'use client';

import React, { useEffect, useState } from 'react';
import { Line, ResponsiveContainer, LineChart, XAxis } from 'recharts';
import { useMemo } from 'react';
import { getOrganizationsByUserId } from '~/lib/organizations/database/queries';
import Tile from '~/core/ui/Tile';
import Heading from '~/core/ui/Heading';
import useUserSession from '~/core/hooks/use-user-session';
import { getUserById } from '~/lib/user/database/queries';
import { getPartnerships } from '~/lib/partnerships/queries';
import Partnership from '~/lib/partnerships/partnership';
import useSWR from 'swr';
import useSupabase from '~/core/hooks/use-supabase';
import KPIForm, { Kpi } from './KPIForm';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';
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
  handleEdit: (partnership: Partnership) => void;
  handleView: (partnership: Partnership) => void;
}
interface EditPartnershipModalProps {
  partnership: Partnership | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  updatePartnershipInState: (updatedPartnership: Partnership) => void;
}

export default function PartnershipsDemo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to manage the modal
  const [editPartnership, setEditPartnership] = useState<Partnership | null>(null);
  const [action, setAction] = useState<'view' | 'edit'>('edit'); // State to track current action
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);

  const handleEdit = (partnership: Partnership) => {
    setEditPartnership(partnership);
    setAction('edit'); // Set action to edit
    setIsModalOpen(true); // Open the modal
  };

  const handleView = (partnership: Partnership) => {
    setEditPartnership(partnership);
    setAction('view'); // Set action to view
    setIsModalOpen(true); // Open the modal
  };

  const updatePartnershipInState = (updatedPartnership: Partnership) => {
    setPartnerships((prev) =>
      prev.map((p) => (p.id === updatedPartnership.id ? updatedPartnership : p))
    );
  };

  return (
    <div className={'flex flex-col space-y-6 pb-36'}>
      <div>
        <Tile>
          <Tile.Heading>Sent Requests</Tile.Heading>
          <Tile.Body>
            <PartnershipsTable type="sent" handleEdit={handleEdit} handleView={handleView} />
          </Tile.Body>
        </Tile>
      </div>
      <div>
        <Tile>
          <Tile.Heading>Received Requests</Tile.Heading>
          <Tile.Body>
            <PartnershipsTable type="received" handleEdit={handleEdit} handleView={handleView} />
          </Tile.Body>
        </Tile>
      </div>
      {editPartnership && action === 'edit' && (
        <EditPartnershipModal
          partnership={editPartnership}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          updatePartnershipInState={updatePartnershipInState}
        />
      )}
      {editPartnership && action === 'view' && (
        <ViewPartnershipModal
          partnership={editPartnership}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          updatePartnershipInState={updatePartnershipInState}
        />
      )}
    </div>
  );
}

function PartnershipsTable({ type, handleEdit, handleView }: PartnershipsTableProps) {
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
  }, [type, org_id]); // Re-fetch the data when the "type" or "org_id" prop changes

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Tile.Badge trend="up">Accepted</Tile.Badge>;
      case 'declined':
        return <Tile.Badge trend="down">Declined</Tile.Badge>;
      default:
        return <Tile.Badge trend="stale">Pending</Tile.Badge>;
    }
  };

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
            <TableCell>{partnership.duration_end}</TableCell>
            <TableCell>
              {getStatusBadge(partnership.status)}
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
  updatePartnershipInState,
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

  // Added useEffect to update form data when partnership changes
  useEffect(() => {
    if (partnership) {
      setFormData({
        partnerName: partnership.partner_name,
        partnershipName: partnership.partnership_name,
        partnershipType: partnership.type,
        partnershipFormat: partnership.format,
        durationStart: partnership.duration_start,
        durationEnd: partnership.duration_end,
        fundingAmount: partnership.funding,
        details: partnership.details,
        sender_id: partnership.sender_id,
        sender_name: partnership.sender_name,
        receiver_id: partnership.receiver_id,
        kpis: partnership.kpis,
      });
    }
  }, [partnership]);

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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update partnership');

      const updatedPartnership = await response.json();

      // Call the callback function to update the local state
      updatePartnershipInState(updatedPartnership);

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
            <TabsTrigger value="KPI">KPI&apos;s</TabsTrigger>
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
                <Button onClick={() => setIsOpen(false)} type="submit">Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Modal>
  );
};

const ViewPartnershipModal: React.FC<EditPartnershipModalProps & { isViewOnly?: boolean }> = ({
  partnership,
  isOpen,
  setIsOpen,
  updatePartnershipInState,
  isViewOnly = false,
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
    status: partnership?.status || 'pending', // Add this line
  });

  useEffect(() => {
    if (partnership) {
      setFormData({
        partnerName: partnership.partner_name,
        partnershipName: partnership.partnership_name,
        partnershipType: partnership.type,
        partnershipFormat: partnership.format,
        durationStart: partnership.duration_start,
        durationEnd: partnership.duration_end,
        fundingAmount: partnership.funding,
        details: partnership.details,
        sender_id: partnership.sender_id,
        sender_name: partnership.sender_name,
        receiver_id: partnership.receiver_id,
        kpis: partnership.kpis,
        status: partnership.status, // Add this line
      });
    }
  }, [partnership]);

  const handleAccept = async () => {
    try {
      console.log('Accepting partnership:', partnership?.id);
      const response = await fetch(`/api/partnerships/accept?id=${partnership?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to accept partnership');

      const updatedPartnership = await response.json();
      console.log('Updated partnership:', updatedPartnership);


      updatePartnershipInState(updatedPartnership);
      setFormData(prevState => ({ ...prevState, status: 'accepted' })); // Update local state

      setIsOpen(false);
      console.log('Partnership accepted successfully');
    } catch (error: any) {
      console.error('Error accepting partnership:', error.message);
    }
  };

  const handleDecline = async () => {
    try {
      const response = await fetch(`/api/partnerships/decline?id=${partnership?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to decline partnership');

      const updatedPartnership = await response.json();

      updatePartnershipInState(updatedPartnership);
      setFormData(prevState => ({ ...prevState, status: 'declined' })); // Update local state

      setIsOpen(false);
      console.log('Partnership declined successfully');
    } catch (error: any) {
      console.error('Error declining partnership:', error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading="View Partnership">
      <div className="space-y-4">
        <Tabs defaultValue="Recipient" className="w-full max-w-xl">
          <TabsList className="grid grid-cols-3 gap-5">
            <TabsTrigger value="Recipient">Recipient</TabsTrigger>
            <TabsTrigger value="Details">Details</TabsTrigger>
            <TabsTrigger value="KPI">KPI&apos;s</TabsTrigger>
          </TabsList>

          <TabsContent value="Recipient">
            <Card>
              <CardHeader>
                <CardTitle>View Partnership</CardTitle>
                <CardDescription>
                  View the details of the partnership.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="partnershipName">Partnership Name</Label>
                  <TextField.Input
                    id="partnershipName"
                    name="partnershipName"
                    value={formData.partnershipName}
                    readOnly
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
                  <Select value={formData.partnershipFormat} disabled>
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
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="durationEnd">End Date</Label>
                  <TextField.Input
                    id="durationEnd"
                    name="durationEnd"
                    value={formData.durationEnd}
                    readOnly
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
                      readOnly
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
              <CardFooter className="flex justify-center space-x-4">
                {formData.status === 'pending' && (
                  <Button
                    onClick={handleAccept}
                    type="button"
                  >
                    Accept Partnership
                  </Button>
                )}

                {formData.status === 'pending' && (
                  <Button
                    onClick={handleDecline}
                    type="button"
                  >
                    Decline Partnership
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
};
