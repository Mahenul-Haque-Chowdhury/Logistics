import { NextResponse } from 'next/server';
import type { QuoteRequest } from '@/types';

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Partial<QuoteRequest>;
    const required: (keyof QuoteRequest)[] = ['name','email','origin','destination','weightKg','mode'];
    for (const field of required) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }
    // In future: send to CRM / email service.
    return NextResponse.json({ ok: true, received: data, reference: 'Q-' + Date.now().toString(36) });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
