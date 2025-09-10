'use server';

/**
 * @fileOverview An AI agent that recommends crops based on soil analysis, weather data, and historical yields.
 *
 * - getCropRecommendations - A function that handles the crop recommendation process.
 * - CropRecommendationInput - The input type for the getCropRecommendations function.
 * - CropRecommendationOutput - The return type for the getCropRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationInputSchema = z.object({
  soilAnalysis: z
    .string()
    .describe('The results of a soil analysis, including pH, nitrogen, phosphorus, and potassium levels.'),
  weatherData: z
    .string()
    .describe('Current and historical weather data for the location, including temperature, rainfall, and sunlight.'),
  historicalYields: z
    .string()
    .describe('Historical crop yields for the location, including types of crops and amounts produced.'),
});
export type CropRecommendationInput = z.infer<typeof CropRecommendationInputSchema>;

const CropRecommendationOutputSchema = z.object({
  recommendedCrops: z
    .string()
    .describe('A list of recommended crops, along with the reasons for the recommendations.'),
  plantingInstructions: z
    .string()
    .describe('Detailed planting instructions for the recommended crops, including timing, spacing, and fertilization.'),
  riskAssessment: z
    .string()
    .describe('An assessment of the risks associated with planting the recommended crops, including potential pests, diseases, and weather-related challenges.'),
});
export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

export async function getCropRecommendations(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return cropRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided soil analysis, weather data, and historical yields, recommend the best crops for the farmer.

Soil Analysis: {{{soilAnalysis}}}
Weather Data: {{{weatherData}}}
Historical Yields: {{{historicalYields}}}

Consider the following factors when making your recommendations:

* Soil type and nutrient levels
* Climate and growing season
* Market demand and profitability
* Risk factors, such as pests, diseases, and weather-related challenges

Provide detailed planting instructions for the recommended crops, including timing, spacing, and fertilization. Also, provide an assessment of the risks associated with planting the recommended crops.
`,
});

const cropRecommendationFlow = ai.defineFlow(
  {
    name: 'cropRecommendationFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
