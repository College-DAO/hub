import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      partnerName,
      partnershipName,
      partnershipType,
      partnershipFormat,
      durationStart,
      durationEnd,
      fundingAmount,
      details,
      sender_id,
      sender_name,
      receiver_id,
      kpis,
      status = 'pending',  // Default to 'pending' if not provided
    } = req.body;

    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const partnership = {
      partner_name: partnerName,
      partnership_name: partnershipName,
      type: partnershipType,
      format: partnershipFormat,
      duration_start: durationStart,
      duration_end: durationEnd,
      funding: fundingAmount,
      details: details,
      sender_id: sender_id,
      sender_name: sender_name,
      receiver_id: receiver_id,
      kpis: kpis,
      status: status,
    };

    const { data, error } = await supabase
      .from('partnerships')
      .insert([partnership])
      .select();  // Add this to return the inserted data

    if (error) {
      console.error('Supabase Error', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return res.status(500).json({
        error: 'Failed to create partnership',
        details: error.message,
        code: error.code,
      });
    }

    return res.status(201).json({
      message: 'Partnership created successfully',
      partnership: data[0],
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
