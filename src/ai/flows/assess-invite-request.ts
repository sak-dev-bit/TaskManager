'use server';

/**
 * @fileOverview Assess invite requests for potentially fraudulent behavior.
 *
 * - assessInviteRequest - A function that assesses invite requests for fraudulent behavior.
 * - AssessInviteRequestInput - The input type for the assessInviteRequest function.
 * - AssessInviteRequestOutput - The return type for the assessInviteRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessInviteRequestInputSchema = z.object({
  requestDetails: z
    .string()
    .describe('Details of the invite request, including timestamp, user ID, and recipient email.'),
});
export type AssessInviteRequestInput = z.infer<typeof AssessInviteRequestInputSchema>;

const AssessInviteRequestOutputSchema = z.object({
  isFraudulent: z
    .boolean()
    .describe(
      'Whether the invite request is likely to be fraudulent.  True if likely fraudulent, false if likely legitimate.'
    ),
  fraudReason: z
    .string()
    .optional()
    .describe('If fraudulent, the reason why the invite request is considered fraudulent.'),
});
export type AssessInviteRequestOutput = z.infer<typeof AssessInviteRequestOutputSchema>;

export async function assessInviteRequest(input: AssessInviteRequestInput): Promise<AssessInviteRequestOutput> {
  return assessInviteRequestFlow(input);
}

const assessInviteRequestPrompt = ai.definePrompt({
  name: 'assessInviteRequestPrompt',
  input: {schema: AssessInviteRequestInputSchema},
  output: {schema: AssessInviteRequestOutputSchema},
  prompt: `You are an AI assistant that specializes in detecting fraudulent activity.
  You are given the details of an invite request, and you must determine if it is fraudulent.
  Respond with a JSON object that indicates whether the request is fraudulent and, if so, the reason why.

  Invite Request Details:
  {{requestDetails}}`,
});

const assessInviteRequestFlow = ai.defineFlow(
  {
    name: 'assessInviteRequestFlow',
    inputSchema: AssessInviteRequestInputSchema,
    outputSchema: AssessInviteRequestOutputSchema,
  },
  async input => {
    const {output} = await assessInviteRequestPrompt(input);
    return output!;
  }
);
