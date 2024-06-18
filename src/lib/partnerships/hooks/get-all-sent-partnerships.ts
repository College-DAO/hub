import useSupabase from "~/core/hooks/use-supabase";
import useSWR from "swr";
import { SupabaseClient } from '@supabase/supabase-js';

interface Partnership {
  id: number;
  sender_id: number;
  receiver_id: number;
  details: string;
}
//function finds the sender_id of the user so it can return every partnership they have
export function useFetchSentPartnerships(sender_id: number) {
    const client: SupabaseClient = useSupabase();
    const key = sender_id ? ['partnerships', sender_id] : null;

    const fetcher = async (): Promise<Partnership[]> => {
        const { data, error } = await client
        //specifies the partnerships table of the database
            .from('partnerships')
            //* gets every element in the column
            .select('*')
            //ensures the sender_id matches to reduce error
            .eq('sender_id', sender_id);

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error('No data');
        }
        //returns an array of a partnership elements
        return data as Partnership[];
    };

    return useSWR<Partnership[]>(key, fetcher);
}
