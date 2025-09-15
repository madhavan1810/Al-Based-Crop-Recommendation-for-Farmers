import { NextResponse } from 'next/server';
import { getSeedPrices } from '@/services/market-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const prices = await getSeedPrices();
    return NextResponse.json(prices);
  } catch (error) {
    console.error('API Error fetching seed prices:', error);
    return NextResponse.json({ message: 'Failed to fetch seed prices' }, { status: 500 });
  }
}
