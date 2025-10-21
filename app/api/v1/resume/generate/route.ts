"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { geminiClient } from "@/lib/gen-ai";
import { ObjectId } from "mongodb";
import { GeneratedResumeSuggestionSchema, ResumeSuggestionsStructuredSchema } from "@/types/resume.types";

export async function POST(request: Request) {
    try {
        // 1. Parse input
        const body = await request.json();
        const validatedInput = GeneratedResumeSuggestionSchema.safeParse(body);

        if (!validatedInput.success) {
            return Response.json(
                { error: "Invalid input", details: validatedInput.error.issues },
                { status: 400 }
            );
        }

        // 2. Get session & user profile
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const profile = await db.collection("profiles").findOne({
            user_id: new ObjectId(session.user.id),
        });

        if (!profile) {
            return Response.json(
                { error: "Profile not found. Please create a profile first." },
                { status: 404 }
            );
        }

        // 3. Generate AI suggestions with Gemini
        const systemInstruction = `
        You are a professional resume optimization AI. 
        Given the user's profile and target job, generate specific suggestions to tailor the resume.

        OUTPUT REQUIREMENTS:
        1. Analyze the job description for key skills, requirements, and keywords
        2. Generate suggestions to modify the user's profile fields to better match the job
        3. Focus on: headline, work experience descriptions, skills emphasis
        4. Provide explanations for each suggestion
        5. Quantitativelt calculate a match score (0-100) based on how well the profile fits 
        6. List keywords that are matched and missing
        7. Do NOT includes changes to sections not present in the profile

        OUTPUT JSON FORMAT:
        {
        "suggestions": [
            {
            "id": "unique-id",
            "fieldPath": "headline" or "workExperiences.0.description",
            "originalValue": "current value",
            "suggestedValue": "improved value",
            "explanation": "why this change helps",
            "confidence": 0.0-1.0
            }
        ],
        "matchScore": 85,
        "keywordsMatched": ["React", "Node.JS"],
        "keywordsMissing": ["Kubernetes", "Docker"]
        }
        `
        const prompt = JSON.stringify({
            profile,
            job_title: validatedInput.data.jobTitle,
            company_name: validatedInput.data.companyName,
            job_description: validatedInput.data.jobDescription,
        });

        const result = await geminiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.3,
                responseMimeType: "application/json",
                thinkingConfig: {
                    thinkingBudget: 0,
                },
                systemInstruction,
            },
        })
        if (!result.text) {
            console.error("Gemini API error");
            return Response.json(
                { error: "Failed to generate resume suggestions" },
                { status: 500 }
            );
        }

        const finalizedOutput = {
            ...JSON.parse(result.text),
            profile,
        }
        // 4. Validate AI output
        const aiOutput = ResumeSuggestionsStructuredSchema.safeParse(
            finalizedOutput
        );

        if (!aiOutput.success) {
            console.error("AI output validation failed:", aiOutput.error);
            return Response.json(
                { error: "AI generated invalid response" },
                { status: 500 }
            );
        }
        return Response.json({
            profile: aiOutput.data.profile,
            suggestions: aiOutput.data.suggestions,
            matchScore: aiOutput.data.matchScore,
            keywordsMatched: aiOutput.data.keywordsMatched,
            keywordsMissing: aiOutput.data.keywordsMissing,
        });

    } catch (error) {
        console.error("Resume generation error:", error);
        return Response.json(
            { error: "Failed to generate resume suggestions" },
            { status: 500 }
        );
    }
}