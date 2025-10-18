"use client";

import { useMutation } from "@tanstack/react-query";
import { CreateResumeType } from "@/types/resume.types";
import { ResumeSuggestionsStructuredType } from "@/types/helper.types";
import { ProfileType } from "@/types/profile.types";

export const useResumeGeneration = () => {
    return useMutation({
        mutationFn: async (data: CreateResumeType): Promise<ResumeSuggestionsStructuredType & {
            profile: ProfileType
        }> => {
            const response = await fetch("/api/v1/resume/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate resume");
            }

            return response.json();
        },
    });
};