"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateCoverLetterSchema, CreateCoverLetterType } from "@/types/cover-letter.types";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";


/**
 * Create a new cover letter with AI-generated content
 */
export async function CreateCoverLetterAction(data: CreateCoverLetterType) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const validatedFields = CreateCoverLetterSchema.safeParse(data);
        if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error);
            return { error: "Invalid input" };
        }

        const action = await db.collection("coverLetters").insertOne({
            user_id: new ObjectId(session.user.id),
            jobTitle: validatedFields.data.jobTitle,
            companyName: validatedFields.data.companyName,
            jobDescription: validatedFields.data.jobDescription || "",
            additionalInfo: validatedFields.data.additionalInfo || "",
            content: validatedFields.data.content || "",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return { id: action.insertedId.toString() };
    } catch (error) {
        console.error("CreateCoverLetterAction error:", error);
        return { error: "Failed to create cover letter" };
    }
}

/**
 * Delete a cover letter by ID
 */
export async function DeleteCoverLetterAction(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const coverLetterId = new ObjectId(id);
        const userId = new ObjectId(session.user.id);

        // Verify ownership before deletion
        const coverLetter = await db.collection("coverLetters").findOne({
            _id: coverLetterId,
            user_id: userId,
        });

        if (!coverLetter) {
            return { error: "Cover letter not found" };
        }

        // Delete the cover letter
        await db.collection("coverLetters").updateOne(
            { _id: coverLetterId },
            { $set: { deletedAt: new Date() } }
        );

    } catch (error) {
        console.error("DeleteCoverLetterAction error:", error);
        return { error: "Failed to delete cover letter" };
    }
}