import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ResumeSchema } from "@/types/resume.types";
import { headers } from "next/headers";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session || !session.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const rawresume = await db.collection("resumes").find({
            user_id: session.user.id,
            deletedAt: null,
        }).toArray()
        if (!rawresume) {
            return new Response("Resume not found", { status: 404 });
        }
        const resumes = ResumeSchema.array().safeParse(rawresume);
        if (!resumes.success) {
            console.error("Resume validation failed:", resumes.error);
            return new Response("Resume data is corrupted", { status: 500 });
        }
        return new Response(JSON.stringify(resumes.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        const error = e as Error;
        console.error("Error in GET /api/v1/resume:", error);
        return new Response(error.message, {
            status: 500,
        });
    }
}