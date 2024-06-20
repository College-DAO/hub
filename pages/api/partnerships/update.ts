import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const updatedData = req.body;

    try {
      // Update the partnership in your database
      const { data, error } = await supabase
        .from('partnerships')
        .update(updatedData)
        .eq('id', id);

      if (error) {
        console.error('Supabase Error', { 
          message: error.message, 
          code: error.code, 
          details: error.details, 
          hint: error.hint,
        });
        return res.status(500).json({ 
          error: 'Failed to update partnership', 
          details: error.message, 
          code: error.code,
        });
      }

      if (!data) {
        return res.status(404).send('Partnership not found');
      }

      return res.status(200).json(data[0]);
    } catch (error) {
      console.error('Error updating partnership:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
