import useSupabase from "~/core/hooks/use-supabase";
import useQuery from "swr";
import { SupabaseClient } from '@supabase/supabase-js';

export function useFetchSentPartnerships(sender_id: number) {
    const client: SupabaseClient = useSupabase();
    const key = [`partnerships`, sender_id];

    return useQuery(key, async () => {
        const { data, error } = await client
            .from('partnerships')
            .select('*')
            .eq('sender_id', sender_id);

        if (error) {
            throw error;
        }

        return data;
    });
}
