import { z } from "zod";
import { ClientCreateProfileSchema } from "./profile.types";
import { ClientBaseTimestamps, ObjectIdtoStringSchema } from "./helper.types";
import { ObjectId } from "mongodb";


export const SuggestionItemSchema = z.object({
    id: z.string(),
    originalValue: z.any().nullable().optional(),
    fieldPath: z.string(),
    suggestedValue: z.any(),
    explanation: z.string().optional(),
});

export const GenerateResumeRequestSchema = z.object({
    jobTitle: z.string(),
    jobDescription: z.string(),
    companyName: z.string().optional(),
});

export const ResumeSuggestionSchema = z.object({
    suggestions: z.array(SuggestionItemSchema).optional(),
    matchScore: z.number().min(0).max(100).optional(),
    keywordsMatched: z.array(z.string()).optional(),
    keywordsMissing: z.array(z.string()).optional(),
});

export const GeneratedResumeSuggestionReturnSchema = z.object({
    profile: ClientCreateProfileSchema,
}).extend(ResumeSuggestionSchema.shape);


//DATABASE OBJECTS
export const ResumeSchema = z.object({
    user_id: ObjectIdtoStringSchema,
    _id: ObjectIdtoStringSchema,
    // AI generation tracking
    appliedSuggestions: z.array(SuggestionItemSchema).optional(),
    profile: ClientCreateProfileSchema
}).extend(ClientBaseTimestamps.shape).extend(GenerateResumeRequestSchema.shape).extend(ResumeSuggestionSchema.shape);


export const CreateResumeSchema = z.object({
    _id: z.custom<ObjectId>(),
    user_id: z.custom<ObjectId>(),
    // AI generation tracking
    appliedSuggestions: z.array(SuggestionItemSchema).optional(),
    profile: ClientCreateProfileSchema
}).extend(GenerateResumeRequestSchema.shape).extend(ClientBaseTimestamps.shape).extend(ResumeSuggestionSchema.shape);

export const ClientCreateResumeSchema = z.object({
    // AI generation tracking
    appliedSuggestions: z.array(SuggestionItemSchema).optional(),
    profile: ClientCreateProfileSchema,
}).extend(GenerateResumeRequestSchema.shape).extend(ResumeSuggestionSchema.shape);


export type SuggestionItemType = z.infer<typeof SuggestionItemSchema>;
export type ResumeSuggestionType = z.infer<typeof ResumeSuggestionSchema>;
export type GeneratedResumeSuggestionReturnType = z.infer<typeof GeneratedResumeSuggestionReturnSchema>;
export type ResumeType = z.infer<typeof ResumeSchema>;
export type CreateResumeType = z.infer<typeof CreateResumeSchema>;
export type GenerateResumeRequestType = z.infer<typeof GenerateResumeRequestSchema>;
export type ClientCreateResumeType = z.infer<typeof ClientCreateResumeSchema>;


export const ResumeSuggestionsGeminiSchema = {
    type: "object",
    properties: {
        suggestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Unique identifier for the suggestion"
                    },
                    fieldPath: {
                        type: "string",
                        description: "Path to the field being suggested (e.g., 'headline' or 'workExperiences.0.description')"
                    },
                    originalValue: {
                        description: "Current value of the field",
                        type: "string",
                        nullable: true
                    },
                    suggestedValue: {
                        type: "string",
                        description: "Improved/suggested value for the field"
                    },
                    explanation: {
                        type: "string",
                        description: "Why this change helps match the job"
                    },
                },
                required: ["id", "fieldPath", "suggestedValue"],
                propertyOrdering: ["id", "fieldPath", "originalValue", "suggestedValue", "explanation"]
            },
            description: "Array of suggestions to improve the resume"
        },
        matchScore: {
            type: "integer",
            minimum: 0,
            maximum: 100,
            description: "Overall match score between profile and job (0-100)"
        },
        keywordsMatched: {
            type: "array",
            items: {
                type: "string"
            },
            description: "Keywords from job description that are present in the profile"
        },
        keywordsMissing: {
            type: "array",
            items: {
                type: "string"
            },
            description: "Important keywords from job description missing in the profile"
        }
    },
    required: ["matchScore"],
    propertyOrdering: ["suggestions", "matchScore", "keywordsMatched", "keywordsMissing"]
};