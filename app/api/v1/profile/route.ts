import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileSchema } from "@/types/profile.types";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            console.log("No active session found");
            return new Response("Unauthorized", { status: 401 });
        }
        const rawprofile = await db.collection("profiles").findOne({
            user_id: new ObjectId(session.user.id),
            deletedAt: null,
        });

        const profile = ProfileSchema.safeParse(rawprofile);
        if (!profile.success) {
            console.error("Profile validation failed:", profile.error);
            return new Response("Profile data is corrupted", { status: 500 });
        }
        return new Response(JSON.stringify(rawprofile), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        const error = e as Error;
        console.error("Error in GET /api/v1/profile:", error);
        return new Response(error.message, {
            status: 500,
        });
    }
}