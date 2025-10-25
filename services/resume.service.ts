"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RouteURL } from "@/lib/routes";
import { ClientCreateResumeType, CreateResumeSchema, CreateResumeType } from "@/types/resume.types";
import { InsertOneResult, ObjectId } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export async function CreateResumeAction(data: ClientCreateResumeType) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }
        const newResume: CreateResumeType = {
            ...data,
            user_id: new ObjectId(session.user.id),
            _id: new ObjectId(),
            deletedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const resume = CreateResumeSchema.safeParse(newResume);
        if (!resume.success) {
            return { error: "Invalid resume data" };
        }

        const result = await db.collection("resumes").insertOne(resume.data);
        if (!result.acknowledged) {
            return { error: "Failed to create resume" };
        }
        
        return { id: result.insertedId.toString() };
    } catch (error) {
        const err = error as Error;
        console.error("CreateResumeAction error:", err);
        return { error: "Failed to create resume" };
    }
}

export async function DeleteResumeAction(resumeId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const result = await db.collection("resumes").updateOne(
        {
            _id: new ObjectId(resumeId),
            user_id: new ObjectId(session.user.id),
            deletedAt: null,
        },
        {
            $set: {
                deletedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        }
    );

    if (result.modifiedCount === 0) {
        return { error: "Resume not found or already deleted" };
    }
}