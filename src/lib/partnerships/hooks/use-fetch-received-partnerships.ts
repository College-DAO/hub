import useSupabase from "~/core/hooks/use-supabase";
import useQuery from "swr";
import { SupabaseClient } from '@supabase/supabase-js';

export function useFetchReceivedPartnerships(receiver_id: number) {
    const client: SupabaseClient = useSupabase();
    const key = [`partnerships`, receiver_id];

    return useQuery(key, async () => {
        const { data, error } = await client
            .from('partnerships')
            .select('*')
            .eq('receiver_id', receiver_id);

        if (error) {
            throw error;
        }

        return data;
    });
}
