"use server"

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { geminiClient } from "@/lib/gen-ai";
import { CreateCoverLetterSchema, CreateCoverLetterType } from "@/types/cover-letter.types";
import { ProfileSchema } from "@/types/profile.types";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = (await request.json()) as CreateCoverLetterType;
        body.content = "-- placeholder --";

        const validatedFields = CreateCoverLetterSchema.safeParse(body);
        if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error);
            return new Response("Invalid Input", { status: 400 });
        }

        const profileRaw = await db.collection("profiles").findOne({
            user_id: new ObjectId(session.user.id),
            deletedAt: null,
        });

        if (!profileRaw) {
            return new Response("Profile not found. Please create a profile first.", { status: 404 });
        }

        const profile = ProfileSchema.safeParse(profileRaw);
        if (!profile.success) {
            console.error("Profile validation failed:", profile.error);
            return new Response("Profile data is corrupted", { status: 500 });
        }

        // Generate cover letter content using AI with streaming
        const response = await geminiClient.models.generateContentStream({
            model: "gemini-2.5-flash-lite",
            contents: JSON.stringify({
                profile: profile.data,
                jobTitle: validatedFields.data.jobTitle,
                companyName: validatedFields.data.companyName,
                jobDescription: validatedFields.data.jobDescription,
                additionalInfo: validatedFields.data.additionalInfo,
            }),
            config: {
                systemInstruction: `
                Generate a professional cover letter based on the provided profile, job title, description, company name, and take into account the additional info.
                
                Briefly research the company to understand its values and culture, and tailor the cover letter accordingly.
                
                Output ONLY valid HTML with these formatting elements:
                - <p> for paragraphs
                - <strong> for bold text
                - <em> for italic text
                - <ul> and <li> for unordered lists
                - <ol> and <li> for ordered lists
                - <br> for line breaks

                Do NOT include:
                - HTML tags other than those listed above
                - head, body, html, div, span, or any other tags
                - Inline styles or class attributes
                - HTML comments

                Do NOT include any explanations or additional text outside of the HTML structure.
                Only provide the BODY of the cover letter, without any greetings, only ending with a signature line.

                Start directly with the content (e.g., <p>...</p>) without any wrapper elements.`,
                thinkingConfig: {
                    thinkingBudget: 0,
                },
            },
        });

        // Create a readable stream that chunks the response
        const readableStream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of response) {
                        const chunkText = chunk.text;
                        controller.enqueue(encoder.encode(chunkText));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(readableStream, {
            status: 200,
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Generate stream error:", error);
        return new Response("Failed to generate cover letter", { status: 500 });
    }
}
