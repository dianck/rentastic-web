'use server';

import {
  analyzeReviewSentimentAndSuggestResponse,
  type ReviewSentimentAnalysisInput,
  type ReviewSentimentAnalysisOutput,
} from '@/ai/flows/review-sentiment-analysis';

export async function analyzeReview(
  data: ReviewSentimentAnalysisInput
): Promise<ReviewSentimentAnalysisOutput | { error: string }> {
  try {
    if (!data.reviewText || !data.tenantName || !data.propertyName) {
      return { error: 'All fields are required.' };
    }

    const result = await analyzeReviewSentimentAndSuggestResponse(data);
    return result;
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to analyze review: ${errorMessage}` };
  }
}
