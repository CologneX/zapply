import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CoverLetterSchema } from "@/types/cover-letter.types";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session || !session.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const rawcoverletters = await db.collection("coverLetters").find({
            user_id: new ObjectId(session.user.id),
            deletedAt: null,
        }).toArray();

        if (!rawcoverletters) {
            return new Response("Cover letters not found", { status: 404 });
        }
        const coverletters = CoverLetterSchema.array().safeParse(rawcoverletters);
        if (!coverletters.success) {
            console.error("Cover letters validation failed:", coverletters.error);
            return new Response("Cover letters data is corrupted", { status: 500 });
        }
        return new Response(JSON.stringify(coverletters.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        const error = e as Error;
        console.error("Error in GET /api/v1/coverletter:", error);
        return new Response(error.message, {
            status: 500,
        });
    }
}