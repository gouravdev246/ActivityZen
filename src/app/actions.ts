'use server';

import { suggestCategory, type SuggestCategoryInput } from '@/ai/flows/suggest-category';
import { z } from 'zod';

const actionSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().optional(),
});

export async function getCategorySuggestion(input: SuggestCategoryInput): Promise<{ category?: string; error?: string }> {
  const validation = actionSchema.safeParse(input);
  if (!validation.success) {
    return { error: 'Invalid input' };
  }

  try {
    const result = await suggestCategory(validation.data);
    return { category: result.category };
  } catch (error) {
    console.error('Error suggesting category:', error);
    return { error: 'Failed to get suggestion.' };
  }
}
