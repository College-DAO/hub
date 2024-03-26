
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import getSdk from '~/lib/sdk';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { partnerName, partnershipType, duration, fundingAmount, sender_id , sender_name} = req.body;
    const { data, error } = await supabase
      .from('partnerships')
      .insert([
        {
          partner_name: partnerName,
          type: partnershipType,
          duration: duration,
          funding: fundingAmount,
          sender_id: sender_id,
          sender_name: sender_name,
        },
      ]);

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