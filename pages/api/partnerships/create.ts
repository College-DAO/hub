import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
<<<<<<< HEAD
    const { partnerName, partnershipType, duration, fundingAmount, 
      der_id, kpis, sender_name, receiver_id} = req.body;
=======
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
      kpis
    } = req.body;

>>>>>>> main
    const partnerships = [
      {
        partner_name: partnerName,
        partnership_name: partnershipName,
        type: partnershipType,
        format: partnershipFormat,
        duration_start: durationStart,
        duration_end: durationEnd,
        funding: fundingAmount,
<<<<<<< HEAD
        sender_id: der_id,
        kpis: kpis,
=======
        details: details,
        sender_id: sender_id,
>>>>>>> main
        sender_name: sender_name,
        receiver_id: receiver_id,
        kpis: kpis
      },
      {
        partner_name: partnerName,
<<<<<<< HEAD
          type: 'received',
          duration: duration,
          funding: fundingAmount,
          sender_id: der_id, 
          kpis: kpis,
          sender_name:sender_name,
          receiver_id: receiver_id
=======
        partnership_name: partnershipName,
        type: 'received',
        format: partnershipFormat,
        duration_start: durationStart,
        duration_end: durationEnd,
        funding: fundingAmount,
        details: details,
        sender_id: sender_id,
        sender_name: sender_name,
        receiver_id: receiver_id,
        kpis: kpis
>>>>>>> main
      }
    ];

    const { data, error } = await supabase
      .from('partnerships')
      .insert(partnerships);

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

    return res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}