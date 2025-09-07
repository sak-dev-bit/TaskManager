'use server';

/**
 * @fileOverview Generates a shareable link for a task list.
 *
 * - generateShareableLink - A function that generates a shareable link.
 * - GenerateShareableLinkInput - The input type for the generateShareableLink function.
 * - GenerateShareableLinkOutput - The return type for the generateShareableLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShareableLinkInputSchema = z.object({
  taskListId: z.string().describe('The ID of the task list to share.'),
  userId: z.string().describe('The ID of the user generating the link.'),
});
export type GenerateShareableLinkInput = z.infer<typeof GenerateShareableLinkInputSchema>;

const GenerateShareableLinkOutputSchema = z.object({
  shareableLink: z.string().describe('The generated shareable link.'),
});
export type GenerateShareableLinkOutput = z.infer<typeof GenerateShareableLinkOutputSchema>;

const isLikelyFraudulentSchema = z.object({
  isFraudulent: z.boolean().describe('True if the invitation seems fraudulent, false otherwise.'),
  reason: z.string().optional().describe('Reasoning behind the fraudulent determination, if any.'),
});

const isLikelyFraudulent = ai.defineTool(
  {
    name: 'isLikelyFraudulent',
    description: 'Determine if an invitation request seems fraudulent based on task list and user details.',
    inputSchema: GenerateShareableLinkInputSchema,
    outputSchema: isLikelyFraudulentSchema,
  },
  async (input) => {
    // Placeholder implementation: Replace with actual fraud detection logic
    // This could involve checking user history, task list activity, etc.
    // For now, we'll just return a random boolean value.
    const isFraud = Math.random() < 0.2; // 20% chance of being fraudulent
    return {
      isFraudulent: isFraud,
      reason: isFraud ? 'Randomly determined as potentially fraudulent.' : undefined,
    };
  }
);

export async function generateShareableLink(input: GenerateShareableLinkInput): Promise<GenerateShareableLinkOutput> {
  return generateShareableLinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShareableLinkPrompt',
  tools: [isLikelyFraudulent],
  input: {schema: GenerateShareableLinkInputSchema},
  output: {schema: GenerateShareableLinkOutputSchema},
  prompt: `You are a helpful assistant designed to generate shareable links for task lists.

  Given a task list ID and a user ID, create a unique, non-guessable shareable link.
  Before generating the link, use the isLikelyFraudulent tool to check if the request seems fraudulent.
  If the request is likely fraudulent, do not generate the link and respond accordingly.

  Task List ID: {{{taskListId}}}
  User ID: {{{userId}}}

  If the isLikelyFraudulent tool indicates the request is not fraudulent, generate a shareable link:
  Shareable Link: tasksync.com/share/{{{taskListId}}}/{{{userId}}}/{{randomString}}
  Where randomString is a randomly generated string.
  If the isLikelyFraudulent tool indicates the request is fraudulent, then the shareableLink should be "FRAUDULENT".
  `,
});

const generateShareableLinkFlow = ai.defineFlow(
  {
    name: 'generateShareableLinkFlow',
    inputSchema: GenerateShareableLinkInputSchema,
    outputSchema: GenerateShareableLinkOutputSchema,
  },
  async input => {
    const fraudCheckResult = await isLikelyFraudulent(input);

    if (fraudCheckResult.isFraudulent) {
      return {shareableLink: 'FRAUDULENT'};
    }

    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const {output} = await prompt({
      ...input,
      randomString,
    });
    return output!;
  }
);
