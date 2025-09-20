import { NextResponse } from 'next/server';
import { mockTrackingEvents } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tn = searchParams.get('tn');
  if (!tn) {
    return NextResponse.json({ error: 'Missing tracking number parameter ?tn=' }, { status: 400 });
  }
  const events = mockTrackingEvents(tn).sort((a,b) => a.timestamp.localeCompare(b.timestamp));
  return NextResponse.json({ trackingNumber: tn, events });
}
