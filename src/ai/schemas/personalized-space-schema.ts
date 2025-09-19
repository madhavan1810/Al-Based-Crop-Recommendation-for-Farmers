
import { z } from 'genkit';

// Input Schema
export const PersonalizedCultivationPlanInputSchema = z.object({
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
  stage: z.string().describe('A short, simple name of the cultivation stage for this week (e.g., "Land Prep", "Growth", "Harvesting").'),
  tasks: z.string().describe('A detailed, actionable list of tasks and advice for the farmer to perform during this specific week. Use simple language.'),
  iconName: z.string().describe('The name of a Lucide icon that best represents the primary action for the week (e.g., "Tractor", "Droplets", "Bug", "Wheat").'),
});
export type WeeklyTask = z.infer<typeof WeeklyTaskSchema>;

export const PersonalizedCultivationPlanOutputSchema = z.object({
  cultivationPlan: z.array(WeeklyTaskSchema).describe('A week-by-week plan for the entire crop cycle.'),
});
export type PersonalizedCultivationPlanOutput = z.infer<typeof PersonalizedCultivationPlanOutputSchema>;

    
