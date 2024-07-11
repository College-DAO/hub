import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, userId } = req.query; 

  try {
    let query = supabase
      .from('partnerships')
      .select('*');

    if (type === 'sent') {
      query = query.eq('sender_id', userId);
    } else if (type === 'received') {
      query = query.eq('receiver_id', userId);
    } else {
      // Fetch both sent and received partnerships
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    }

    let { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
  }
}
