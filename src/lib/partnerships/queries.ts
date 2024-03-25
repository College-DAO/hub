import type { SupabaseClient } from '@supabase/supabase-js';
import { PARTNERSHIPS_TABLE } from '~/lib/db-tables';

export function getPartnerships(client: SupabaseClient) {
  let query = client
    .from(PARTNERSHIPS_TABLE)
    .select(`
      id,
      sender_id,
      receiver_id,
      type,
      duration,
      funding
    `);
  return query;
}
