"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CreateResumeSchema } from "@/types/resume.types";
import { ResumeSuggestionsStructuredSchema } from "@/types/helper.types";
import { db } from "@/lib/db";
import { geminiClient } from "@/lib/gen-ai";

export async function POST(request: Request) {
    try {
        // 1. Parse input
        const body = await request.json();
        const validatedInput = CreateResumeSchema.safeParse(body);

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
            user_id: session.user.id,
        });

        if (!profile) {
            return Response.json(
                { error: "Profile not found. Please create a profile first." },
                { status: 404 }
            );
        }

        // 3. Generate AI suggestions with Gemini
        const prompt = `You are a professional resume optimization AI. 
        
Given the user's profile and target job, generate specific suggestions to tailor the resume.

USER PROFILE:
${JSON.stringify(profile, null, 2)}

TARGET JOB:
Title: ${validatedInput.data.jobTitle}
Company: ${validatedInput.data.companyName || "Not specified"}
Description: ${validatedInput.data.jobDescription}

OUTPUT REQUIREMENTS:
1. Analyze the job description for key skills, requirements, and keywords
2. Generate suggestions to modify the user's profile fields to better match the job
3. Focus on: headline, work experience descriptions, skills emphasis
4. Provide explanations for each suggestion
5. Calculate a match score (0-100) based on how well the profile fits
6. List keywords that are matched and missing

Return JSON matching this schema:
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
  "keywordsMatched": ["react", "node.js"],
  "keywordsMissing": ["kubernetes", "docker"]
}`;

        const result = await geminiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
            },
        })

        if (!result.data || !result.text) {
            console.error("Gemini API error",);
            return Response.json(
                { error: "Failed to generate resume suggestions" },
                { status: 500 }
            );
        }

        // 4. Validate AI output
        const aiOutput = ResumeSuggestionsStructuredSchema.safeParse(
            JSON.parse(result.text)
        );

        if (!aiOutput.success) {
            console.error("AI output validation failed:", aiOutput.error);
            return Response.json(
                { error: "AI generated invalid response" },
                { status: 500 }
            );
        }

        // 5. Return profile + suggestions to UI
        return Response.json({
            profile,
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