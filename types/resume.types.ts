import { z } from "zod";
import { ClientCreateProfileSchema, CreateProfileSchema, ProfileSchema } from "./profile.types";
import { BaseTimestamps, ObjectIdtoStringSchema } from "./helper.types";
import { ObjectId } from "bson";

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
    profile: ProfileSchema,
    suggestions: z.array(SuggestionOpSchema),
    matchScore: z.number().min(0).max(100).optional(),
    keywordsMatched: z.array(z.string()).optional(),
    keywordsMissing: z.array(z.string()).optional(),
});


export const ResumeSchema = z.object({
    user_id: ObjectIdtoStringSchema,
    _id: ObjectIdtoStringSchema,
    // Job context
    jobTitle: z.string(),
    jobDescription: z.string(),
    companyName: z.string().optional(),
    // AI generation tracking
    appliedSuggestions: z.array(SuggestionOpSchema).optional(),
    // Match insights (from Gemini)
    matchScore: z.number().min(0).max(100).optional(),
    keywordsMatched: z.array(z.string()).optional(),
    keywordsMissing: z.array(z.string()).optional(),
}).extend(BaseTimestamps.shape);

export const CreateResumeSchema = ClientCreateProfileSchema.extend({
    _id: z.custom<ObjectId>().default(() => new ObjectId()),
    user_id: z.custom<ObjectId>(),

    // Job context
    jobTitle: z.string(),
    jobDescription: z.string(),
    companyName: z.string().optional(),

    // AI generation tracking
    appliedSuggestions: z.array(SuggestionOpSchema).optional(),

    // Match insights (from Gemini)
    matchScore: z.number().min(0).max(100).optional(),
    keywordsMatched: z.array(z.string()).optional(),
    keywordsMissing: z.array(z.string()).optional(),
}).extend(BaseTimestamps.shape);

export const GeneratedResumeSuggestionSchema = z.object({
    // Job context
    jobTitle: z.string(),
    jobDescription: z.string(),
    companyName: z.string().optional(),

    appliedSuggestions: z.array(SuggestionOpSchema).optional(),

    matchScore: z.number().min(0).max(100).optional(),
    keywordsMatched: z.array(z.string()).optional(),
    keywordsMissing: z.array(z.string()).optional(),
});


export type SuggestionOpType = z.infer<typeof SuggestionOpSchema>;
export type ResumeSuggestionsStructuredType = z.infer<typeof ResumeSuggestionsStructuredSchema>;

export const ClientCreateResumeSchema = ClientCreateProfileSchema.extend(GeneratedResumeSuggestionSchema.shape);

export type ResumeType = z.infer<typeof ResumeSchema>;
export type CreateResumeType = z.infer<typeof CreateResumeSchema>;
export type ClientCreateResumeType = z.infer<typeof ClientCreateResumeSchema>;
export type GeneratedResumeSuggestionType = z.infer<typeof GeneratedResumeSuggestionSchema>;