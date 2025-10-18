import { z } from "zod";
import { ObjectId } from "bson";

// Custom Zod schema to validate and transform MongoDB ObjectId to string
export const ObjectIdtoStringSchema = z.custom<ObjectId>().transform((val) => val.toString());

export const BaseTimestamps = z.object({
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional().default(() => new Date()),
  deletedAt: z.date().nullable().optional().default(null),
});

export const SuggestionOpSchema = z.object({
  id: z.string(),
  fieldPath: z.string(),
  originalValue: z.any().nullable(),
  suggestedValue: z.any(),
  explanation: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  appliedAt: z.date().optional(),
});

export const ResumeSuggestionsStructuredSchema = z.object({
  suggestions: z.array(SuggestionOpSchema),
  matchScore: z.number().min(0).max(100).optional(),
  keywordsMatched: z.array(z.string()).optional(),
  keywordsMissing: z.array(z.string()).optional(),
});

export type SuggestionOpType = z.infer<typeof SuggestionOpSchema>;
export type ResumeSuggestionsStructuredType = z.infer<typeof ResumeSuggestionsStructuredSchema>;