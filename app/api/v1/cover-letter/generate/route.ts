"use server"

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { geminiClient } from "@/lib/gen-ai";
import { CreateCoverLetterSchema, CreateCoverLetterType } from "@/types/cover-letter.types";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const body = (await request.json()) as CreateCoverLetterType;
        body.content = "-- placeholder --";

        const validatedFields = CreateCoverLetterSchema.safeParse(body);
        if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error);
            return new Response(JSON.stringify({ error: "Invalid input" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const profile = await db.collection("profiles").findOne({
            user_id: new ObjectId(session.user.id),
            deletedAt: null,
        });

        if (!profile) {
            return new Response(
                JSON.stringify({
                    error: "Profile not found. Please create your profile first.",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Generate cover letter content using AI with streaming
        const response = await geminiClient.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: JSON.stringify({
                profile,
                jobTitle: validatedFields.data.jobTitle,
                companyName: validatedFields.data.companyName,
                jobDescription: validatedFields.data.jobDescription,
                additionalInfo: validatedFields.data.additionalInfo,
            }),
            config: {
                systemInstruction: `Generate a professional cover letter based on the provided profile and job details. 
                
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
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Failed to generate cover letter",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
