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
import useCurrentOrganization from "~/lib/organizations/hooks/use-current-organization";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/core/ui/Table';

interface PartnershipsTableProps {
  type: 'sent' | 'received';
}

export default function PartnershipsDemo() {
  const mrr = useMemo(() => generateDemoData(), []);
  const visitors = useMemo(() => generateDemoData(), []);
  const returningVisitors = useMemo(() => generateDemoData(), []);
  const churn = useMemo(() => generateDemoData(), []);
  const netRevenue = useMemo(() => generateDemoData(), []);
  const fees = useMemo(() => generateDemoData(), []);
  const newCustomers = useMemo(() => generateDemoData(), []);
  const tickets = useMemo(() => generateDemoData(), []);
  const activeUsers = useMemo(() => generateDemoData(), []);


  return (
    <div className={'flex flex-col space-y-6 pb-36'}>
      <div>
        <Tile>
          <Tile.Heading>Sent Requests</Tile.Heading>
          <Tile.Body>
            <PartnershipsTable type="sent"  />
          </Tile.Body>
        </Tile>
      </div>
      <div>
        <Tile>
          <Tile.Heading>Received Requests</Tile.Heading>
          <Tile.Body>
            <PartnershipsTable type="received" />
          </Tile.Body>
        </Tile>
      </div>
    </div>
  );
}

function generateDemoData() {
  const today = new Date();
  const formatter = new Intl.DateTimeFormat('en-us', {
    month: 'long',
    year: '2-digit',
  });

  const data: { value: string; name: string }[] = [];

  for (let n = 8; n > 0; n -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - n, 1);

    data.push({
      name: formatter.format(date) as string,
      value: (Math.random() * 10).toFixed(1),
    });
  }

  return [data, data[data.length - 1].value] as [typeof data, string];
}

function Chart(
  props: React.PropsWithChildren<{ data: { value: string; name: string }[] }>,
) {
  return (
    <div className={'h-36'}>
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <LineChart width={400} height={100} data={props.data}>
          <Line
            className={'text-primary'}
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={2.5}
            dot={false}
          />

          <XAxis
            style={{ fontSize: 9 }}
            axisLine={false}
            tickSize={0}
            dataKey="name"
            height={15}
            dy={10}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function PartnershipsTable({ type }: PartnershipsTableProps) {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editedPartnership, setEditedPartnership] = useState<Partnership | null>(null);
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
  }, [type, org_id]);  // Re-fetch the data when the "type" prop changes

  const handleEdit = (partnership: Partnership) => {
    setEditId(partnership.id);
    setEditedPartnership({ ...partnership });
  };


  const handleUpdate = async () => {
    console.log('Form submitted'); // Log to check if submit is triggered
  
    try {
      const response = await fetch('/api/partnerships/update', { // Ensure the ID is passed correctly
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPartnership),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update partnership');
      }
  
      const data = await response.json();
      console.log('Partnership updated successfully:', data); // Log the response data
    } catch (error: any) {
      console.error('Error updating partnership:', error.message);
      setError(error.message);
    }
  };
  

   

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedPartnership) {
      setEditedPartnership({
        ...editedPartnership,
        [e.target.name]: e.target.value,
      });
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
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          {type === 'sent' && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {partnerships.map((partnership) => (
          <TableRow key={partnership.id}>
            <TableCell>
              {editId === partnership.id ? (
                <input
                  type="text"
                  name="sender_name"
                  value={editedPartnership?.sender_name}
                  onChange={handleChange}
                  className="bg-black"
                />
              ) : (
                partnership.sender_name
              )}
            </TableCell>
            <TableCell>
              {editId === partnership.id ? (
                <input
                  type="text"
                  name="partner_name"
                  value={editedPartnership?.partner_name}
                  onChange={handleChange}
                  className="bg-black"
                />
              ) : (
                partnership.partner_name
              )}
            </TableCell>
            <TableCell>
              {editId === partnership.id ? (
                <textarea
                  name="details"
                  value={editedPartnership?.details}
                  onChange={handleChange}
                  className="bg-black"
                />
              ) : (
                partnership.details
              )}
            </TableCell>
            <TableCell>
              {editId === partnership.id ? (
                <input
                  type="text"
                  name="funding"
                  value={editedPartnership?.funding}
                  onChange={handleChange}
                  className="bg-black"
                />
              ) : (
                `$${partnership.funding}`
              )}
            </TableCell>
            <TableCell>
              {editId === partnership.id ? (
                <input
                  type="text"
                  name="duration"
                  value={editedPartnership?.duration}
                  onChange={handleChange}
                  className="bg-black"
                />
              ) : (
                partnership.duration
              )}
            </TableCell>
            <TableCell>
              <Tile.Badge trend={partnership.status}>Active</Tile.Badge>
            </TableCell>
            {type === 'sent' && (
              <TableCell>
                {editId === partnership.id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(partnership)}>Edit</button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
