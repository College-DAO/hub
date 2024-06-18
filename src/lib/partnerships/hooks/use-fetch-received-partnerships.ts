import useSupabase from "~/core/hooks/use-supabase";
//useSWR for managing remote data fetching
import useSWR from "swr";
import { SupabaseClient } from '@supabase/supabase-js';

//for saftely and readability
interface Partnership {
    id: number;
    sender_id: number;
    receiver_id: number;
    details: string;
  }

export function useFetchReceivedPartnerships(receiver_id: number) {
    const client: SupabaseClient = useSupabase();
    // if there contains a receiver_id set the receiver_id with the partnership
    //otherwise declare null
    const key = receiver_id ? [`partnerships`, receiver_id] : null;

    const fetcher = async () => {
        const { data, error } = await client
            .from('partnerships')
            .select('*')
            .eq('receiver_id', receiver_id);

        if (error) {
            throw error;
        }

        return data;
    };
    //checks to see if the partnership is in the database using their unique key
    //and the fetcher to help find the key
    return useSWR<Partnership[]>(key, fetcher);
}