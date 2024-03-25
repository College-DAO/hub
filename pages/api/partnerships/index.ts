// API Route: /pages/api/partnerships.js or .ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query; // Extract the type from query parameters

  try {
    let query = supabase
      .from('partnerships')
      .select('*');

    if (type) {
      query = query.eq('type', type);
    }

    let { data, error } = await query;
      
    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
