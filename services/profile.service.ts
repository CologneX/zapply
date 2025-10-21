"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ClientCreateProfileType, CreateProfileSchema, ProfileType } from "@/types/profile.types";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

/**
 * Get the current user's profile
 * Returns profile where deletedAt is null
 */
export async function GetProfileAction() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const profile = await db.collection("profiles").findOne({
            user_id: new ObjectId(session.user.id),
            deletedAt: null,
        });

        if (!profile) {
            return { error: "Profile not found" };
        }

        return { data: profile as unknown as ProfileType };
    } catch (error) {
        console.error("GetProfileAction error:", error);
        return { error: "Failed to fetch profile" };
    }
}

/**
 * Create or update user profile
 * Updates if profile exists, creates if it doesn't
 */
export async function ProfileAction(data: ClientCreateProfileType) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const validatedFields = CreateProfileSchema.safeParse(data);
        if (!validatedFields.success) {
            console.error("Validation error:", validatedFields.error);
            return { error: "Invalid input" };
        }

        const userId = new ObjectId(session.user.id);

        // Upsert here
        await db.collection("profiles").updateOne({
            user_id: userId,
        }, {
            $set: {
                ...validatedFields.data,
            }
        }, {
            upsert: true
        });
    } catch (error) {
        console.error("ProfileAction error:", error);
        return { error: "Failed to save profile" };
    }
}
