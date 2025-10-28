"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ClientCreateResumeType, GeneratedResumeSuggestionReturnSchema, GeneratedResumeSuggestionReturnType, GenerateResumeRequestType, ResumeSchema } from "@/types/resume.types";
import { resumeKeys } from "@/types/query-keys/resume.keys";
import { RouteURL } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { transformProfileDates } from "@/lib/utils";
import { CreateResumeAction, DeleteResumeAction } from "@/services/resume.service";

export const useResumeQuery = () => {
    const router = useRouter()

    const query = useQuery({
        queryKey: resumeKeys.all,
        queryFn: async () => {
            const req = await fetch('/api/v1/resume')
            if (!req.ok) {
                throw new Error('Failed to fetch resumes')
            }
            const resumes = ResumeSchema.array().safeParse(await req.json())
            return resumes.data
        }
    })

    const CreateResume = useMutation({
        mutationFn: async (data: ClientCreateResumeType) => {
            const result = await CreateResumeAction(data)
            if (result?.error) {
                throw new Error(result.error)
            }
            return result
        },
        onSuccess: (result) => {
            query.refetch()
            toast.success('Resume created successfully!')
            if (result?.id) {
                router.push(`${RouteURL.CREATE_RESUME}/completed/${result.id}`)
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create resume.')
        }
    })

    const DeleteResume = useMutation({
        mutationFn: async (id: string) => {
            const result = await DeleteResumeAction(id)
            if (result?.error) {
                throw new Error(result.error)
            }
            return result
        },
        onSuccess: () => {
            query.refetch()
            toast.success('Resume deleted successfully!')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete resume.')
        }
    })

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

    const DownloadServerPDF = useMutation({
        mutationFn: async (id: string) => {
            const req = await fetch(`/api/v1/resume/generate/pdf/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!req.ok) {
                throw new Error('Failed to generate PDF')
            }
            const blob = await req.blob()
            // Extract filename from Content-Disposition header
            const contentDisposition = req.headers.get('Content-Disposition')
            let filename = ''
            if (contentDisposition) {
                const matches = contentDisposition.match(/filename="(.+)"/)
                if (matches) {
                    filename = matches[1]
                }
            }

            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)
        }
    })
    return {
        ...query,
        CreateResume,
        GenerateResume,
        DeleteResume,
        DownloadServerPDF,
    }
};