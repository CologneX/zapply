import z from "zod";
import { BaseTimestamps, ObjectIdtoStringSchema } from "./helper.types";

export const CoverLetterSchema = z.object({
    _id: ObjectIdtoStringSchema,
    user_id: ObjectIdtoStringSchema,

    // Job context
    jobTitle: z.string(),
    companyName: z.string(),
    jobDescription: z.string(),

    // User customization
    additionalInfo: z.string().optional(),

    // Generated content
    content: z.string(),
}).extend(BaseTimestamps.shape);

export const CreateCoverLetterSchema = z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    companyName: z.string().min(1, "Company name is required"),
    jobDescription: z.string(),
    additionalInfo: z.string().optional(),
    content: z.string(),
});

export type CoverLetterType = z.infer<typeof CoverLetterSchema>;
export type CreateCoverLetterType = z.infer<typeof CreateCoverLetterSchema>;