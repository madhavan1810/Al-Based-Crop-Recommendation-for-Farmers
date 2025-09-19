
'use server';
/**
 * @fileOverview An AI agent that fetches market prices for crops and seeds.
 *
 * - getMarketPrices - A function that handles fetching market prices.
 * - MarketPriceInput - The input type for the getMarketPrices function.
 * - MarketPriceOutput - The return type for the getMarketPrices function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const MarketPriceInputSchema = z.object({
  location: z.string().describe('The location (e.g., state, country) for which to fetch prices.'),
  crops: z.array(z.string()).describe('A list of crops to fetch prices for.'),
  seeds: z.array(z.string()).describe('A list of seeds to fetch prices for.'),
});
export type MarketPriceInput = z.infer<typeof MarketPriceInputSchema>;

export const MarketPriceOutputSchema = z.object({
  status: z.string().describe('A status message indicating the result of the operation.'),
});
export type MarketPriceOutput = z.infer<typeof MarketPriceOutputSchema>;

export async function getMarketPrices(input: MarketPriceInput): Promise<MarketPriceOutput> {
  return marketPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketPricePrompt',
  input: { schema: MarketPriceInputSchema },
  output: { schema: MarketPriceOutputSchema },
  prompt: `You are an expert agricultural market analyst. Your task is to find the current market prices for a list of crops and seeds in a specific location.

Location: {{{location}}}
Crops: {{#each crops}}- {{{this}}}{{/each}}
Seeds: {{#each seeds}}- {{{this}}}{{/each}}

1. First, determine the current market prices for each of the specified crops. For each crop, find its price per quintal in Indian Rupees and the percentage change in the last 24 hours.

2. Next, determine the current market prices for popular varieties of each of the specified seeds. For each seed, find a common variety and its price per quintal in Indian Rupees.

3. After finding the prices, provide a final status message confirming that the prices have been noted.
`,
});

const marketPriceFlow = ai.defineFlow(
  {
    name: 'marketPriceFlow',
    inputSchema: MarketPriceInputSchema,
    outputSchema: MarketPriceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      return { status: 'Failed to get a response from the AI.' };
    }
    return output;
  }
);
