import useSupabase from "~/core/hooks/use-supabase";
import { SupabaseClient } from '@supabase/supabase-js';

interface Partnership {
  id: number;
  sender_id: number;
  receiver_id: number;
  details: string;
}

interface PartnershipData {
  sender_id: number;
  receiver_id: number;
  details: string;
}

export function useSendPartnership() {
    const client: SupabaseClient = useSupabase();

    async function sendPartnership(partnershipData: PartnershipData): Promise<Partnership[]> {
        const { data, error } = await client
            .from('partnerships')
            .insert([partnershipData]);

        if (error) {
            throw error;
        }
        //needs to check if there was any data
        if (!data) {
            throw new Error('No data');
        }
        //return the partnership data
        return data as Partnership[];
    }

    return sendPartnership;
}
