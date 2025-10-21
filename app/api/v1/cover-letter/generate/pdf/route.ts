import { auth } from "@/lib/auth";
// import { db } from "@/lib/db";
import { headers } from "next/headers";

export async  function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // const profile = await db.collection("profiles").findOne({
        //     user_id: session.user.id,
        //     deletedAt: null,
        // });

        

    } catch (error) {
        console.error("GenerateCoverLetterPDFRoute error:", error);
        return new Response(JSON.stringify({ error: "Failed to generate PDF" }), { status: 500 });
    }
}