import useSupabase from "~/core/hooks/use-supabase";
import { SupabaseClient } from '@supabase/supabase-js';

interface Partnership {
  id: number;
  sender_id: number;
  receiver_id: number;
  details: string;
}

export function useReceivePartnership() {
    const client: SupabaseClient = useSupabase();

    async function receivePartnership(partnershipId: number): Promise<Partnership | null> {
        const { data, error } = await client
            .from('partnerships')
            .select('*')
            .eq('id', partnershipId)
            //only want a single row
            .single(); 

        if (error) {
            throw error;
        }

        if (!data) {
            return null; 
        }

        return data as Partnership;
    }

    return receivePartnership;
}
