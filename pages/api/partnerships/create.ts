
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { partnerName, partnershipType, duration, fundingAmount, sender_id, kpis, sender_name, receiver_id} = req.body;
    const partnerships = [
      {
        partner_name: partnerName,
        type: 'sent', 
        duration: duration,
        funding: fundingAmount,
        sender_id: sender_id,
        kpis: kpis,
        sender_name: sender_name,
        receiver_id: receiver_id,
      },
      {
        partner_name: partnerName,
          type: 'received',
          duration: duration,
          funding: fundingAmount,
          sender_id: sender_id, 
          kpis: kpis,
          sender_name:sender_name,
          receiver_id: receiver_id
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