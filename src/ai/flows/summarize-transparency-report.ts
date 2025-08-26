'use server';

/**
 * @fileOverview Summarizes a product transparency report, highlighting key information and insights.
 *
 * - summarizeTransparencyReport - A function that handles the summarization process.
 * - SummarizeTransparencyReportInput - The input type for the summarizeTransparencyReport function.
 * - SummarizeTransparencyReportOutput - The return type for the summarizeTransparencyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTransparencyReportInputSchema = z.object({
  report: z.string().describe('The full product transparency report text.'),
});
export type SummarizeTransparencyReportInput = z.infer<typeof SummarizeTransparencyReportInputSchema>;

const SummarizeTransparencyReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the product transparency report.'),
});
export type SummarizeTransparencyReportOutput = z.infer<typeof SummarizeTransparencyReportOutputSchema>;

export async function summarizeTransparencyReport(input: SummarizeTransparencyReportInput): Promise<SummarizeTransparencyReportOutput> {
  return summarizeTransparencyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTransparencyReportPrompt',
  input: {schema: SummarizeTransparencyReportInputSchema},
  output: {schema: SummarizeTransparencyReportOutputSchema},
  prompt: `You are an expert at summarizing product transparency reports. Your goal is to provide a concise summary of the key information and insights contained within the report.

  Report:
  {{report}}`,
});

const summarizeTransparencyReportFlow = ai.defineFlow(
  {
    name: 'summarizeTransparencyReportFlow',
    inputSchema: SummarizeTransparencyReportInputSchema,
    outputSchema: SummarizeTransparencyReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
