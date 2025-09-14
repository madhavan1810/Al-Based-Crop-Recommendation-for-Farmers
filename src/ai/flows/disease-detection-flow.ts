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
  disease: z.string().describe("The specific name of the detected disease or pest (e.g., 'Powdery Mildew', 'Aphids'). If the plant is healthy, return 'Healthy'."),
  confidence: z.number().describe('A confidence score (0-100) in the accuracy of the diagnosis. 100 means certainty.'),
  treatment: z.string().describe("A concise, actionable, and easy-to-follow recommendation for treating the disease. If healthy, provide a relevant care tip (e.g., watering, sunlight)."),
});
export type DiseaseDetectionOutput = z.infer<typeof DiseaseDetectionOutputSchema>;


export async function detectPlantDisease(input: DiseaseDetectionInput): Promise<DiseaseDetectionOutput> {
  return diseaseDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diseaseDetectionPrompt',
  input: { schema: DiseaseDetectionInputSchema },
  output: { schema: DiseaseDetectionOutputSchema },
  prompt: `You are an expert plant pathologist and agricultural diagnostician. Your task is to analyze an image of a plant leaf and provide a precise diagnosis.

Follow these steps for your analysis:
1.  **Initial Observation**: Examine the image closely. Note the plant's overall appearance, leaf color, and any visible patterns.
2.  **Symptom Identification**: Look for specific symptoms, such as spots (color, size, shape), lesions, wilting, discoloration (yellowing, browning), pests, or fungal growth.
3.  **Diagnosis**: Based on the symptoms, determine the most likely disease or pest. If no issues are visible, classify the plant as 'Healthy'.
4.  **Confidence Score**: Assign a confidence level to your diagnosis based on the clarity and uniqueness of the symptoms.
5.  **Treatment Recommendation**: Provide a simple, actionable treatment plan. For diseases, suggest organic or chemical solutions. For pests, recommend control methods. If healthy, give a relevant care tip.

Analyze the following image and provide your diagnosis.

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
