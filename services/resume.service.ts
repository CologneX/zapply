"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { geminiClient } from "@/lib/gen-ai";
import { CreateResumeSchema, CreateResumeType } from "@/types/resume.types";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";


export async function generateResumeSuggestions(payload: CreateResumeType) {
    const parsed = CreateResumeSchema.safeParse(payload);
    if (!parsed.success) return {
        error: parsed.error.message
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session?.user) return { error: "Unauthorized" };

    const profile = await db.collection("profiles").findOne({ user_id: new ObjectId(session.user.id), deletedAt: null });
    if (!profile) return { error: "Profile not found. Please create your profile first." };

    const jsonSchema = { /* JSON schema for structured output (see earlier example) */ };
    const gen = await geminiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: JSON.stringify({ profile, jobTitle: parsed.data.jobTitle, jobDescription: parsed.data.jobDescription }),
        config: {

        }
    });

    return { suggestions: gen };
}