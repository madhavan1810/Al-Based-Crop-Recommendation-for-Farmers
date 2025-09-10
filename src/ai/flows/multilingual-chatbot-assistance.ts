// This is a server-side file.
'use server';

/**
 * @fileOverview A multilingual chatbot assistance AI agent for farmers.
 *
 * - multilingualChatbotAssistance - A function that handles the chatbot assistance process.
 * - MultilingualChatbotAssistanceInput - The input type for the multilingualChatbotAssistance function.
 * - MultilingualChatbotAssistanceOutput - The return type for the multilingualChatbotAssistance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MultilingualChatbotAssistanceInputSchema = z.object({
  query: z.string().describe('The question asked by the farmer in their local language.'),
  language: z.string().describe('The language of the query.'),
});
export type MultilingualChatbotAssistanceInput = z.infer<
  typeof MultilingualChatbotAssistanceInputSchema
>;

const MultilingualChatbotAssistanceOutputSchema = z.object({
  answer: z
    .string()
    .describe('The answer to the question in the same language as the query.'),
});
export type MultilingualChatbotAssistanceOutput = z.infer<
  typeof MultilingualChatbotAssistanceOutputSchema
>;

export async function multilingualChatbotAssistance(
  input: MultilingualChatbotAssistanceInput
): Promise<MultilingualChatbotAssistanceOutput> {
  return multilingualChatbotAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multilingualChatbotAssistancePrompt',
  input: {
    schema: MultilingualChatbotAssistanceInputSchema,
  },
  output: {
    schema: MultilingualChatbotAssistanceOutputSchema,
  },
  prompt: `You are a helpful AI chatbot assistant for farmers.
      The farmer will ask a question in their local language, and you will respond in the same language.

      Language: {{{language}}}
      Question: {{{query}}}

      Answer: `,
});

const multilingualChatbotAssistanceFlow = ai.defineFlow(
  {
    name: 'multilingualChatbotAssistanceFlow',
    inputSchema: MultilingualChatbotAssistanceInputSchema,
    outputSchema: MultilingualChatbotAssistanceOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
