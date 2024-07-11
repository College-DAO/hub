import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id } = req.query;

        console.log(`Declining partnership ${id}`);

        try {
            // Begin transaction to ensure atomicity
            const { data: partnership, error: fetchError } = await supabase
                .from('partnerships')
                .select('sender_id, receiver_id')
                .eq('id', id)
                .single();

            if (fetchError) {
                console.error('Supabase fetch error', fetchError);
                return res.status(500).json({
                    error: 'Failed to fetch partnership details',
                    details: fetchError.message,
                });
            }

            if (!partnership) {
                return res.status(404).json({ error: 'Partnership not found' });
            }

            const { error } = await supabase
                .from('partnerships')
                .update({ status: 'declined' })
                .in('id', [partnership.sender_id, partnership.receiver_id]);

            if (error) {
                console.error('Supabase Error', error);
                return res.status(500).json({
                    error: 'Failed to decline partnership',
                    details: error.message,
                });
            }

            console.log('Partnership declined successfully:', partnership);
            return res.status(200).json(partnership);
        } catch (error) {
            console.error('Error declining partnership:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
