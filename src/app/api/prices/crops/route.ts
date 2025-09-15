import { NextResponse } from 'next/server';
import { getCropPrices } from '@/services/market-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const prices = await getCropPrices();
    return NextResponse.json(prices);
  } catch (error) {
    console.error('API Error fetching crop prices:', error);
    return NextResponse.json({ message: 'Failed to fetch crop prices' }, { status: 500 });
  }
}
