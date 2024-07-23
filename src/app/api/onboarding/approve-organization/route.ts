// /app/api/approve-organization/route.ts

import { NextRequest, NextResponse } from 'next/server';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing organization id' }, { status: 400 });
  }

  const client = getSupabaseRouteHandlerClient();

  const { error } = await client
    .from('organizations')
    .update({ status: 'approved' } as any)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Error approving organization' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}