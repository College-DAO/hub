import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id } = req.query;

        console.log(`Accepting partnership ${id}`);

        try {
            const { data, error } = await supabase
                .from('partnerships')
                .update({ status: 'accepted' })
                .eq('id', id)
                .single();

            if (error) {
                console.error('Supabase Error', error);
                return res.status(500).json({
                    error: 'Failed to accept partnership',
                    details: error.message,
                });
            }

            if (!data) {
                return res.status(404).json({ error: 'Partnership not found' });
            }

            console.log('Partnership accepted successfully:', data);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error accepting partnership:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}