import { z } from "zod";
import { ProfileSchema } from "./profile.types";
import { BaseTimestamps, ObjectIdtoStringSchema, SuggestionOpSchema } from "./helper.types";

export const ResumeSchema = ProfileSchema.extend({
    _id: ObjectIdtoStringSchema,
    user_id: ObjectIdtoStringSchema,

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

export const CreateResumeSchema = z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    jobDescription: z.string().min(1, "Job description is required"),
    companyName: z.string().optional(),
});

export type ResumeType = z.infer<typeof ResumeSchema>;
export type CreateResumeType = z.infer<typeof CreateResumeSchema>;