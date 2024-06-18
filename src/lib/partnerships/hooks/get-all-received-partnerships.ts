import useSupabase from "~/core/hooks/use-supabase";
import useSWR from "swr";
import { SupabaseClient } from '@supabase/supabase-js';

interface Partnership {
  id: number;
  sender_id: number;
  receiver_id: number;
  details: string;
}

export function useFetchReceivedPartnerships(receiver_id: number) {
    const client: SupabaseClient = useSupabase();
    const key = receiver_id ? ['partnerships', receiver_id] : null;

    const fetcher = async (): Promise<Partnership[]> => {
        const { data, error } = await client
            .from('partnerships')
            .select('*')
            .eq('receiver_id', receiver_id);

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error('No data');
        }

        return data as Partnership[];
    };

    return useSWR<Partnership[]>(key, fetcher);
}
