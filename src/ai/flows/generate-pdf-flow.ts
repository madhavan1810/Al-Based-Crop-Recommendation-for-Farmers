
'use server';

/**
 * @fileOverview Converts HTML content of a cultivation plan into a downloadable PDF.
 *
 * - generatePdfFlow - A function that takes HTML and plan data to generate a PDF.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { WeeklyTaskSchema } from '@/ai/schemas/personalized-space-schema';

// Input Schema
export const GeneratePdfInputSchema = z.object({
  htmlContent: z.string().describe('The HTML content of the cultivation plan to be converted to a PDF.'),
  language: z.string().describe('The ISO 639-1 language code for the PDF content (e.g., "en", "hi").'),
  cultivationPlan: z.object({
    cultivationPlan: z.array(WeeklyTaskSchema),
  }).describe('The structured data of the cultivation plan.'),
});
export type GeneratePdfInput = z.infer<typeof GeneratePdfInputSchema>;

// Output Schema
export const GeneratePdfOutputSchema = z.object({
  pdfBase64: z.string().describe('The Base64-encoded string of the generated PDF file.'),
});
export type GeneratePdfOutput = z.infer<typeof GeneratePdfOutputSchema>;


// The exported wrapper function
export async function generatePdfFlow(input: GeneratePdfInput): Promise<GeneratePdfOutput> {
  return generateAndConvertToPdf(input);
}


// Main prompt definition
const prompt = ai.definePrompt({
  name: 'generatePdfPrompt',
  input: { schema: GeneratePdfInputSchema },
  output: { schema: z.object({ markdownContent: z.string() }) },
  prompt: `You are a document generation expert. Your task is to convert the provided cultivation plan data into a clean, well-structured Markdown document. The final output will be converted to a PDF, so use clear headings, lists, and tables.

**Instructions:**
1.  Translate the entire content into the target language: **{{{language}}}**.
2.  Create a title: "Cultivation Plan".
3.  For each week in the plan, create a section with a clear heading (e.g., "Week 1: Land Preparation").
4.  Under each week's heading, list the tasks in a bulleted or numbered format.
5.  Format the output as a single Markdown string.

**Cultivation Plan Data:**
\`\`\`json
{{{jsonStringify cultivationPlan}}}
\`\`\`
`,
});

// Helper to convert Markdown to a format that can be used by a PDF library
// In a real app, you might use a more robust library like 'showdown' or 'marked',
// but for this example, we will do a simplified conversion.
function simpleMarkdownToHtml(markdown: string) {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/<\/ul>\n<ul>/gim, '')
    .replace(/\n/g, '<br>');
}


// The Genkit Flow
const generateAndConvertToPdf = ai.defineFlow(
  {
    name: 'generateAndConvertToPdf',
    inputSchema: GeneratePdfInputSchema,
    outputSchema: GeneratePdfOutputSchema,
  },
  async (input) => {
    // Register a Handlebars helper to stringify JSON
    ai.handlebars.registerHelper('jsonStringify', function(context) {
        return JSON.stringify(context);
    });

    // 1. Generate the content in Markdown format in the target language
    const { output } = await prompt(input);
    if (!output?.markdownContent) {
      throw new Error('Failed to generate Markdown content for the PDF.');
    }

    // This is a simplified "conversion" for the demo.
    // A real implementation would use a proper PDF generation library (e.g., Puppeteer on a server)
    // to render HTML/Markdown into a PDF. For this example, we will just encode the generated
    // markdown into a base64 string, assuming the client can handle it.
    // In a real app, the server would return a proper PDF buffer.
    
    const pdfContent = `
    This is a placeholder for the PDF content. In a real application, a library like Puppeteer would be used on the server to convert the generated markdown/HTML into a real PDF file.

    Language: ${input.language}

    ${output.markdownContent}
    `;

    const pdfBase64 = Buffer.from(pdfContent).toString('base64');
    
    return { pdfBase64 };
  }
);

    