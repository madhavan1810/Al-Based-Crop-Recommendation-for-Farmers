'use server';

/**
 * @fileOverview Provides personalized farming advice based on local weather forecasts.
 *
 * - getPersonalizedFarmingAdvice - A function that generates personalized farming advice.
 * - PersonalizedFarmingAdviceInput - The input type for the getPersonalizedFarmingAdvice function.
 * - PersonalizedFarmingAdviceOutput - The return type for the getPersonalizedFarmingAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFarmingAdviceInputSchema = z.object({
  location: z.string().describe('The location for which to get the weather forecast.'),
  soilAnalysis: z.string().describe('The soil analysis data for the farm.'),
  crop: z.string().describe('The type of crop being grown.'),
});
export type PersonalizedFarmingAdviceInput = z.infer<typeof PersonalizedFarmingAdviceInputSchema>;

const PersonalizedFarmingAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized farming advice based on the weather forecast.'),
});
export type PersonalizedFarmingAdviceOutput = z.infer<typeof PersonalizedFarmingAdviceOutputSchema>;

export async function getPersonalizedFarmingAdvice(input: PersonalizedFarmingAdviceInput): Promise<PersonalizedFarmingAdviceOutput> {
  return personalizedFarmingAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFarmingAdvicePrompt',
  input: {schema: PersonalizedFarmingAdviceInputSchema},
  output: {schema: PersonalizedFarmingAdviceOutputSchema},
  prompt: `You are an expert agricultural advisor. Provide personalized advice to a farmer based on the following information:

Location: {{{location}}}
Soil Analysis: {{{soilAnalysis}}}
Crop: {{{crop}}}

Consider the local weather forecast for the location provided and tailor your advice accordingly. Focus on optimizing farming practices to improve yields.`,
});

const personalizedFarmingAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedFarmingAdviceFlow',
    inputSchema: PersonalizedFarmingAdviceInputSchema,
    outputSchema: PersonalizedFarmingAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
