
'use server';

/**
 * @fileOverview Generates a personalized, week-by-week cultivation plan for a farmer.
 *
 * - getPersonalizedCultivationPlan - Generates a complete cultivation plan.
 * - PersonalizedCultivationPlanInput - Input schema for the plan generation.
 * - PersonalizedCultivationPlanOutput - Output schema for the plan generation.
 */

import { ai } from '@/ai/genkit';
import { getWeatherData } from '@/services/weather-service';
import { z } from 'genkit';

// Tool to get weather data
const getWeatherTool = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Get the current weather and a brief forecast for a specific location.',
    inputSchema: z.object({
      location: z.string().describe('The city or district to get the weather for.'),
    }),
    outputSchema: z.any(),
  },
  async ({ location }) => {
    try {
        return await getWeatherData(location);
    } catch (error) {
        console.error(`Weather tool failed for ${location}:`, error);
        return { error: 'Could not retrieve weather data.' };
    }
  }
);

// Input Schema
const PersonalizedCultivationPlanInputSchema = z.object({
  crop: z.string().describe('The crop the farmer intends to grow (e.g., "Tomato", "Wheat").'),
  district: z.string().describe('The district where the farm is located (e.g., "Ludhiana", "Nashik").'),
  sowingDate: z.string().describe('The planned sowing date for the crop in YYYY-MM-DD format.'),
  soilReport: z.string().optional().describe(
    "The farmer's soil report, either as text or a Data URI of a PDF/image. E.g., 'pH: 6.8, N: High, P: Med, K: Low' or 'data:application/pdf;base64,...'"
  ),
  userProfile: z.string().describe("A brief summary of the farmer's profile, including location, experience, and resources."),
});
export type PersonalizedCultivationPlanInput = z.infer<typeof PersonalizedCultivationPlanInputSchema>;


// Output Schema
export const WeeklyTaskSchema = z.object({
  stage: z.string().describe('The name of the cultivation stage for this week (e.g., "Land Preparation", "Vegetative Growth", "Flowering", "Harvesting").'),
  tasks: z.string().describe('A detailed, actionable list of tasks and advice for the farmer to perform during this specific week.'),
});
export type WeeklyTask = z.infer<typeof WeeklyTaskSchema>;

const PersonalizedCultivationPlanOutputSchema = z.object({
  cultivationPlan: z.array(WeeklyTaskSchema).describe('A week-by-week plan for the entire crop cycle.'),
});
export type PersonalizedCultivationPlanOutput = z.infer<typeof PersonalizedCultivationPlanOutputSchema>;


// The exported wrapper function
export async function getPersonalizedCultivationPlan(input: PersonalizedCultivationPlanInput): Promise<PersonalizedCultivationPlanOutput> {
  return personalizedCultivationPlanFlow(input);
}


// Main prompt definition
const prompt = ai.definePrompt({
  name: 'personalizedCultivationPlanPrompt',
  input: { schema: PersonalizedCultivationPlanInputSchema },
  output: { schema: PersonalizedCultivationPlanOutputSchema },
  tools: [getWeatherTool],
  prompt: `You are a master agronomist with decades of experience in Indian agriculture. Your task is to create a comprehensive, week-by-week cultivation plan for a farmer.

The plan must be highly personalized and actionable. Use all the information provided and leverage your expert knowledge.

**Farmer's Context:**
*   **Crop:** {{{crop}}}
*   **Location (District):** {{{district}}}
*   **Planned Sowing Date:** {{{sowingDate}}}
*   **User Profile:** {{{userProfile}}}
{{#if soilReport}}
*   **Soil Report Data:**
    {{#if (contains soilReport "data:")}}
        You have been provided an image or PDF of the soil report. Analyze it to extract key details like pH, N, P, K levels, and soil type.
        Soil Report File: {{media url=soilReport}}
    {{else}}
        The farmer has provided the following soil analysis text: "{{{soilReport}}}"
    {{/if}}
{{else}}
*   **Soil Report:** Not provided. Generate advice based on typical soil conditions for the specified crop and district.
{{/if}}

**Your Task:**
1.  **Fetch Weather Data:** Use the \`getWeather\` tool for the farmer's district to understand the current climate conditions and short-term forecast. Incorporate this into your advice, especially regarding irrigation and pest/disease risk.
2.  **Analyze All Inputs:** Synthesize the crop type, sowing date, soil data (if available), user profile, and weather forecast.
3.  **Determine Crop Duration:** Based on the crop, estimate the total cultivation duration in weeks (from pre-sowing to final harvest).
4.  **Create Weekly Breakdown:** Generate a JSON array of weekly tasks. Each item in the array should represent one week of the cultivation cycle.
    *   **Stage:** Clearly label the cultivation stage for each week (e.g., "Land Preparation," "Seed Treatment," "Germination & Early Growth," "Vegetative Stage," "Flowering," "Fruiting," "Harvesting," "Post-Harvest").
    *   **Tasks:** Provide specific, concise, and actionable advice for that week. Include details on:
        *   **Land & Seed:** Tillage, bed preparation, seed treatment, sowing method.
        *   **Nutrient Management:** Specific fertilizer types (e.g., Urea, DAP, MOP) and quantities (in kg/acre or as appropriate). Tailor this heavily to the soil report if provided.
        *   **Water Management:** Irrigation schedules and amounts, adjusted for weather.
        *   **Pest & Disease Control:** Proactive and reactive measures. Mention common threats for the crop in that region and stage.
        *   **Other Activities:** Weeding, pruning, staking, etc.

**Output Format:**
Respond ONLY with the JSON object that adheres to the \`PersonalizedCultivationPlanOutput\` schema. The entire plan must be contained within the \`cultivationPlan\` array.
`,
});

// The Genkit Flow
const personalizedCultivationPlanFlow = ai.defineFlow(
  {
    name: 'personalizedCultivationPlanFlow',
    inputSchema: PersonalizedCultivationPlanInputSchema,
    outputSchema: PersonalizedCultivationPlanOutputSchema,
  },
  async (input) => {
    // Helper to check for substring in Handlebars
    ai.handlebars.registerHelper('contains', function(context, substring) {
        return context && context.includes(substring);
    });
      
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate a cultivation plan.');
    }
    return output;
  }
);
