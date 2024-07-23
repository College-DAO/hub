// /app/api/check-approval-status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
  }

  const client = getSupabaseRouteHandlerClient();

  const { data, error } = await client
    .from('organizations')
    .select('*')  // Select all columns
    .eq('id', organizationId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Error fetching organization status' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  // Check if 'status' property exists on the data object
  const status = (data as any).status;

  return NextResponse.json({
    approved: status === 'approved',
    rejected: status === 'rejected',
    pending: status === 'pending' || status === undefined,
  });
}