'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating follow-up questions based on previous answers in a form.
 *
 * - generateFollowUpQuestions - A function that generates follow-up questions based on user input.
 * - GenerateFollowUpQuestionsInput - The input type for the generateFollowUpQuestions function.
 * - GenerateFollowUpQuestionsOutput - The return type for the generateFollowUpQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFollowUpQuestionsInputSchema = z.object({
  previousAnswers: z.record(z.string(), z.any()).describe('A record of the previous answers provided in the form.'),
  currentQuestion: z.string().describe('The current question being answered.'),
});
export type GenerateFollowUpQuestionsInput = z.infer<typeof GenerateFollowUpQuestionsInputSchema>;

const GenerateFollowUpQuestionsOutputSchema = z.object({
  followUpQuestions: z.array(z.string()).describe('An array of follow-up questions generated based on the previous answers.'),
});
export type GenerateFollowUpQuestionsOutput = z.infer<typeof GenerateFollowUpQuestionsOutputSchema>;

export async function generateFollowUpQuestions(
  input: GenerateFollowUpQuestionsInput
): Promise<GenerateFollowUpQuestionsOutput> {
  return generateFollowUpQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFollowUpQuestionsPrompt',
  input: {schema: GenerateFollowUpQuestionsInputSchema},
  output: {schema: GenerateFollowUpQuestionsOutputSchema},
  prompt: `You are an AI assistant designed to generate follow-up questions for a product information form. Based on the user's previous answers and the current question, generate a list of relevant follow-up questions to gather more detailed information.

Previous Answers:
{{#each previousAnswers}}
  {{@key}}: {{this}}
{{/each}}

Current Question: {{{currentQuestion}}}

Follow-Up Questions:`,
});

const generateFollowUpQuestionsFlow = ai.defineFlow(
  {
    name: 'generateFollowUpQuestionsFlow',
    inputSchema: GenerateFollowUpQuestionsInputSchema,
    outputSchema: GenerateFollowUpQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
