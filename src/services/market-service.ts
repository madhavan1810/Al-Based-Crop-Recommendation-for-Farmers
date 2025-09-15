
'use server';

export type CropPrice = {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string;
    min_price: number;
    max_price: number;
    modal_price: number;
};

export type ProductionData = {
    state: string;
    district: string;
    crop_year: string;
    season: string;
    crop: string;
    area: string;
    production: string;
};

const PRICE_API_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const PRODUCTION_API_BASE_URL = 'https://api.data.gov.in/resource/579b464db66ec23bdd00000192d56af9a91644c2797b0ee5719aa1a3';

async function fetchMarketData(baseUrl: string, filters: Record<string, string> = {}) {
    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    if (!apiKey) {
        throw new Error('API key for data.gov.in is not configured.');
    }

    const params = new URLSearchParams({
        'api-key': apiKey,
        'format': 'json',
        'limit': '20', // Let's limit the results for now
        ...filters,
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('API Error Response:', errorBody);
            throw new Error(`Failed to fetch market data. Status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.records || data.records.length === 0) {
           console.warn(`No records found for the given query: ${url}`);
           return [];
        }
        return data.records;
    } catch (error) {
        console.error('Error fetching from data.gov.in API:', error);
        if (error instanceof Error && error.message.includes('fetch')) {
            throw new Error('Network error: Could not connect to the market data service.');
        }
        throw error;
    }
}


export async function getLatestCropPrices(): Promise<CropPrice[]> {
    const records = await fetchMarketData(PRICE_API_BASE_URL);
    return records.filter((r: any) => !r.commodity.toLowerCase().includes('seed'));
}

export async function getHistoricalProductionData(district: string, season: string): Promise<ProductionData[]> {
    const records = await fetchMarketData(PRODUCTION_API_BASE_URL, {
        'filters[district]': district,
        'filters[season]': season,
    });
    return records;
}
