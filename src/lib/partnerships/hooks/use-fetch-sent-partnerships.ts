import useSupabase from "~/core/hooks/use-supabase";
import useSWR from "swr";
import { SupabaseClient } from '@supabase/supabase-js';

interface Partnership {
  id: number;
  sender_id: number;
  receiver_id: number;
  details: string;
}

export function useFetchSentPartnerships(sender_id: number) {
    const client: SupabaseClient = useSupabase();
    const key = sender_id ? ['partnerships', sender_id] : null;

    //want a function that returns a promise with an array of Partnership objects
    const fetcher = async (): Promise<Partnership[]> => {
        const { data, error } = await client
            .from('partnerships')
            .select('*')
            .eq('sender_id', sender_id);

        if (error) {
            throw error;
        }

        return data as Partnership[];
    };

    return useSWR<Partnership[]>(key, fetcher);
}
