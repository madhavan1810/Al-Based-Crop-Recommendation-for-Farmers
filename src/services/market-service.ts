
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

export type SeedPrice = {
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

const API_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

async function fetchMarketData(filters: Record<string, string> = {}) {
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

    const url = `${API_BASE_URL}?${params.toString()}`;

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
    // We can add filters here if needed, e.g., for a specific state or commodity.
    // For now, we fetch the latest available data.
    const records = await fetchMarketData();
    
    // The API includes seeds in the same endpoint, so we'll filter for non-seed items.
    // This is a heuristic, as the API doesn't have a clean category split.
    return records.filter((r: any) => !r.commodity.toLowerCase().includes('seed'));
}

export async function getLatestSeedPrices(): Promise<SeedPrice[]> {
    // To get seeds, we explicitly filter for commodities that are likely seeds.
    const records = await fetchMarketData();
    
    // This is a heuristic to find seeds. A better approach might be needed if the API is inconsistent.
    return records.filter((r: any) => r.commodity.toLowerCase().includes('seed'));
}
