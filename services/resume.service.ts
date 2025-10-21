"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ClientCreateResumeType, CreateResumeSchema, CreateResumeType } from "@/types/resume.types";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";




export async function CreateResumeAction(data: ClientCreateResumeType) {
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
}