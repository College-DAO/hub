import useSupabase from "~/core/hooks/use-supabase";
import { SupabaseClient } from '@supabase/supabase-js';

export interface Kpi {
    name: string;
    date: string;
    price: string;
  }

interface Partnership {
  id: number;
  sender_id: number;
  sender_name: string;
  receiver_id: number;
  recepient_name: string;
  partnerName: string;
  partnershipName: string;
  partnershipType: string;
  partnershipFormat: string;
  durationStart: string;
  durationEnd: string;
  fundingAmount: number;
  details: string;
  kpis: Kpi[];
}

interface PartnershipData {
  sender_id: number;
  sender_name: string;
  receiver_id: number;
  recepient_name: string;
  partnerName: string;
  partnershipName: string;
  partnershipType: string;
  partnershipFormat: string;
  durationStart: string;
  durationEnd: string;
  fundingAmount: number;
  details: string;
  kpis: Kpi[];
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
        if (!data) {
            throw new Error('No data');
        }
        return data as Partnership[];
    }

    return sendPartnership;
}
