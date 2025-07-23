'use server';

/**
 * @fileOverview This file contains a Genkit flow for analyzing the sentiment of user reviews and suggesting responses for tenants.
 *
 * - analyzeReviewSentimentAndSuggestResponse - Analyzes review sentiment and suggests a tenant response.
 * - ReviewSentimentAnalysisInput - The input type for the analyzeReviewSentimentAndSuggestResponse function.
 * - ReviewSentimentAnalysisOutput - The output type for the analyzeReviewSentimentAndSuggestResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewSentimentAnalysisInputSchema = z.object({
  reviewText: z.string().describe('The text content of the user review.'),
  tenantName: z.string().describe('The name of the tenant.'),
  propertyName: z.string().describe('The name of the property being reviewed.'),
});

export type ReviewSentimentAnalysisInput = z.infer<
  typeof ReviewSentimentAnalysisInputSchema
>;

const ReviewSentimentAnalysisOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the review (e.g., positive, negative, neutral).' // Removed unnecessary conditional check.
    ),
  suggestedResponse: z
    .string()
    .describe(
      'A suggested response for the tenant, considering the review sentiment.'
    ),
});

export type ReviewSentimentAnalysisOutput = z.infer<
  typeof ReviewSentimentAnalysisOutputSchema
>;

export async function analyzeReviewSentimentAndSuggestResponse(
  input: ReviewSentimentAnalysisInput
): Promise<ReviewSentimentAnalysisOutput> {
  return reviewSentimentAnalysisFlow(input);
}

const reviewSentimentAnalysisPrompt = ai.definePrompt({
  name: 'reviewSentimentAnalysisPrompt',
  input: {schema: ReviewSentimentAnalysisInputSchema},
  output: {schema: ReviewSentimentAnalysisOutputSchema},
  prompt: `You are an AI assistant helping a tenant respond to a user review.

  Analyze the sentiment of the following review and suggest a personalized response for the tenant.

  Review: {{{reviewText}}}

  Tenant Name: {{{tenantName}}}

  Property Name: {{{propertyName}}}

  Consider the sentiment of the review when crafting the response.  If the sentiment is positive, express gratitude and appreciation.
  If the sentiment is negative, acknowledge the issue and offer a solution or apology.
  If the sentiment is neutral, provide a polite and professional response.

  Respond in a way that is appropriate for the sentiment and tailored to the specific review.
  Also keep the tone and brand of the tenant and property in mind.

  Your output should be a JSON object with the following keys:
  - sentiment: The sentiment of the review (positive, negative, or neutral).
  - suggestedResponse: A suggested response for the tenant.
  `,
});

const reviewSentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'reviewSentimentAnalysisFlow',
    inputSchema: ReviewSentimentAnalysisInputSchema,
    outputSchema: ReviewSentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await reviewSentimentAnalysisPrompt(input);
    return output!;
  }
);
