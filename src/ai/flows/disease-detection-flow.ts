'use server';

/**
 * @fileOverview An AI agent that detects diseases in plants from an image.
 *
 * - detectPlantDisease - A function that handles the plant disease detection process.
 * - DiseaseDetectionInput - The input type for the detectPlantDisease function.
 * - DiseaseDetectionOutput - The return type for the detectPlantDisease function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiseaseDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiseaseDetectionInput = z.infer<typeof DiseaseDetectionInputSchema>;

const DiseaseDetectionOutputSchema = z.object({
  disease: z.string().describe("The name of the detected disease. If the plant is healthy, return 'Healthy'."),
  confidence: z.number().describe('The confidence score of the detection, from 0 to 100.'),
  treatment: z.string().describe("A concise, actionable recommendation for treating the disease. If the plant is healthy, provide a general care tip."),
});
export type DiseaseDetectionOutput = z.infer<typeof DiseaseDetectionOutputSchema>;


export async function detectPlantDisease(input: DiseaseDetectionInput): Promise<DiseaseDetectionOutput> {
  return diseaseDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diseaseDetectionPrompt',
  input: { schema: DiseaseDetectionInputSchema },
  output: { schema: DiseaseDetectionOutputSchema },
  prompt: `You are an expert plant pathologist. Analyze the provided image of a plant leaf.

Identify any diseases present. If the plant appears healthy, state that. Provide a confidence score for your diagnosis.
Based on your diagnosis, provide a concise, actionable treatment plan. If the plant is healthy, provide a simple, helpful care tip.

Image: {{media url=photoDataUri}}`,
});

const diseaseDetectionFlow = ai.defineFlow(
  {
    name: 'diseaseDetectionFlow',
    inputSchema: DiseaseDetectionInputSchema,
    outputSchema: DiseaseDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
