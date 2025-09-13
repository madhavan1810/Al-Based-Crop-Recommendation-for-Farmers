
'use server';
/**
 * @fileOverview An AI agent that fetches market prices for crops and seeds and updates them in Firestore.
 *
 * - getMarketPrices - A function that handles fetching and storing market prices.
 * - MarketPriceInput - The input type for the getMarketPrices function.
 * - MarketPriceOutput - The return type for the getMarketPrices function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { updateCropPrices, updateSeedPrices } from '@/services/market-service';

// Tool to update crop prices in Firestore
const updateCropPricesTool = ai.defineTool(
  {
    name: 'updateCropPrices',
    description: 'Updates the crop prices in the database.',
    inputSchema: z.array(
      z.object({
        name: z.string().describe('The name of the crop.'),
        price: z.number().describe('The price of the crop per quintal.'),
        change: z
          .number()
          .describe('The percentage change in price over the last 24 hours.'),
      })
    ),
    outputSchema: z.string(),
  },
  async (prices) => {
    await updateCropPrices(prices);
    return 'Crop prices updated successfully in the database.';
  }
);

// Tool to update seed prices in Firestore
const updateSeedPricesTool = ai.defineTool(
  {
    name: 'updateSeedPrices',
    description: 'Updates the seed variety prices in the database.',
    inputSchema: z.array(
      z.object({
        name: z.string().describe('The name of the crop seed.'),
        variety: z.string().describe('The variety of the seed.'),
        price: z.number().describe('The price of the seed per quintal.'),
      })
    ),
    outputSchema: z.string(),
  },
  async (prices) => {
    await updateSeedPrices(prices);
    return 'Seed prices updated successfully in the database.';
  }
);

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
  tools: [updateCropPricesTool, updateSeedPricesTool],
  prompt: `You are an expert agricultural market analyst. Your task is to find the current market prices for a list of crops and seeds in a specific location and then use the provided tools to update the database.

Location: {{{location}}}
Crops: {{#each crops}}- {{{this}}}{{/each}}
Seeds: {{#each seeds}}- {{{this}}}{{/each}}

1.  First, determine the current market prices for each of the specified crops. For each crop, find its price per quintal in Indian Rupees and the percentage change in the last 24 hours. Then, call the \`updateCropPrices\` tool with this data.

2.  Next, determine the current market prices for popular varieties of each of the specified seeds. For each seed, find a common variety and its price per quintal in Indian Rupees. Then, call the \`updateSeedPrices\` tool with this data.

3.  After calling the tools, provide a final status message confirming that the prices have been updated.
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
