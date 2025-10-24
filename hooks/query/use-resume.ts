"use client";

import { useMutation } from "@tanstack/react-query";
import { ClientCreateResumeType, GeneratedResumeSuggestionReturnSchema, GeneratedResumeSuggestionReturnType, GenerateResumeRequestType } from "@/types/resume.types";
import { toast } from "sonner";
import { ActionErrorWrapper, transformProfileDates } from "@/lib/utils";
import { CreateResumeAction } from "@/services/resume.service";

export const useResumeQuery = () => {
    // const query = useQuery({
    //     queryKey: resumeKeys.list('all'),
    //     queryFn: async () => {
    //         const req = await fetch('/api/resumes')
    //         if (!req.ok) {
    //             throw new Error('Failed to fetch cover letters')
    //         }
    //         return req.json()
    //     }
    // })
    const CreateResume = useMutation({
        mutationFn: async (data: ClientCreateResumeType) => {
            toast.promise(
                ActionErrorWrapper(CreateResumeAction(data)), {
                loading: 'Creating resume...',
                success: 'Resume created successfully!',
                error: 'Failed to create resume.'
            }
            )
        },
    })

    // const DeleteCoverLetter = useMutation({
    //     mutationFn: async (id: string) => {
    //         toast.promise(
    //             ActionErrorWrapper(DeleteCoverLetterAction(id)), {
    //             loading: 'Deleting cover letter...',
    //             success: 'Cover letter deleted successfully!',
    //             error: 'Failed to delete cover letter.'
    //         }
    //         )
    //     }, onSuccess: () => {
    //         query.refetch()
    //     }
    // })

    const GenerateResume = useMutation({
        mutationFn: async (data: GenerateResumeRequestType): Promise<GeneratedResumeSuggestionReturnType> => {
            const response = await fetch("/api/v1/resume/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const resJson = await response.json();
            if (!response.ok) {
                throw new Error(resJson.error || "Failed to generate resume suggestions");
            }

            // const transformed = transformProfileDates(resJson.profile);

            // const generated = {
            //     ...resJson,
            //     profile: transformed,
            // }
            // // if (!generated.success) {
            // //     console.error("Resume generation response validation error:", generated.error);
            // //     throw new Error("Invalid response format from server");
            // // }
            const dataProfile = transformProfileDates(resJson.profile);
            const returnData = GeneratedResumeSuggestionReturnSchema.safeParse({
                ...resJson,
                profile: dataProfile,
            });

            if (!returnData.success) {
                console.error("Resume generation response validation error:", returnData.error);
                throw new Error("Invalid response format from server");
            }

            return returnData.data;
        },
    })
    return {
        // ...query,
        CreateResume,
        GenerateResume,
    }
};