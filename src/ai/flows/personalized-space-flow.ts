
'use server';

/**
 * @fileOverview Generates a personalized, week-by-week cultivation plan for a farmer.
 *
 * - getPersonalizedCultivationPlan - Generates a complete cultivation plan.
 */

import { ai } from '@/ai/genkit';
import { getWeatherData } from '@/services/weather-service';
import { z } from 'genkit';
import { PersonalizedCultivationPlanInputSchema, PersonalizedCultivationPlanOutputSchema } from '@/ai/schemas/personalized-space-schema';

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

// The exported wrapper function
export async function getPersonalizedCultivationPlan(input: z.infer<typeof PersonalizedCultivationPlanInputSchema>): Promise<z.infer<typeof PersonalizedCultivationPlanOutputSchema>> {
  return personalizedCultivationPlanFlow(input);
}


// Main prompt definition
const prompt = ai.definePrompt({
  name: 'personalizedCultivationPlanPrompt',
  input: { schema: PersonalizedCultivationPlanInputSchema },
  output: { schema: PersonalizedCultivationPlanOutputSchema },
  tools: [getWeatherTool],
  prompt: `You are a master agronomist with decades of experience in Indian agriculture. Your task is to create a comprehensive, week-by-week cultivation plan for a farmer, designed for a low-literacy user. The output must be visual and easily understandable.

**Farmer's Context:**
*   **Crop:** {{{crop}}}
*   **Location (District):** {{{district}}}
*   **Planned Sowing Date:** {{{sowingDate}}}
*   **User Profile:** {{{userProfile}}}
{{#if soilReport}}
*   **Soil Report Data:**
    {{#if isSoilReportFile}}
        You have been provided an image or PDF of the soil report. Analyze it to extract key details like pH, N, P, K levels, and soil type.
        Soil Report File: {{media url=soilReport}}
    {{else}}
        The farmer has provided the following soil analysis text: "{{{soilReport}}}"
    {{/if}}
{{else}}
*   **Soil Report:** Not provided. Generate advice based on typical soil conditions for the specified crop and district.
{{/if}}

**Your Task:**
1.  **Fetch Weather Data:** Use the \`getWeather\` tool for the farmer's district to understand the current climate and short-term forecast.
2.  **Analyze All Inputs:** Synthesize all provided information.
3.  **Determine Crop Duration:** Estimate the total cultivation duration in weeks.
4.  **Create Weekly Breakdown:** Generate a JSON array of weekly tasks. Each item must represent one week.
    *   **stage:** A short, clear label for the cultivation stage (e.g., "Land Prep," "Sowing," "Growth," "Harvest").
    *   **tasks:** A concise, simple, and actionable to-do list for that week. Use simple language.
    *   **iconName:** For each week, select the MOST IMPORTANT action and assign a corresponding Lucide icon name from the list below. This icon will be the primary visual cue for the week's tasks.
    *   **dailyTasks:** Create a 7-day breakdown of tasks for the week, starting with Monday. For each day, provide a short task and a relevant icon. If a day has no specific task, you can label it "Rest Day" or "Monitoring" and use a relevant icon like 'Calendar' or 'ClipboardCheck'.

**Lucide Icon List for Weekly Icons:**
*   \`Tractor\`: For land preparation, plowing.
*   \`Bean\`: For seed selection or treatment.
*   \`Droplets\`: For irrigation or water management.
*   \`Package\`: For fertilizer application.
*   \`Shield\`: For pest/disease prevention.
*   \`Bug\`: For pest/disease treatment.
*   \`Scissors\`: For pruning or weeding.
*   \`Flower\`: For flowering stage.
*   \`Wheat\`: For harvesting.
*   \`Archive\`: For post-harvest activities.
*   \`ClipboardCheck\`: For general inspection or monitoring.

**Lucide Icon List for Daily Icons:**
*   Use any relevant icon from the weekly list, plus:
*   \`Calendar\`: For rest days or days with no specific, active tasks.
*   \`Sun\`: For monitoring weather/sunlight.
*   \`CloudRain\`: If irrigation depends on rainfall.
*   \`Check\`: For completing a simple check or task.

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
    const isFile = !!input.soilReport && input.soilReport.startsWith('data:');
    
    const {output} = await prompt({
        ...input,
        soilReport: input.soilReport || '', // Ensure soilReport is not undefined
        isSoilReportFile: isFile,
    });
    
    if (!output) {
      throw new Error('Failed to generate a cultivation plan.');
    }
    return output;
  }
);
    
