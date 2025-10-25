import { CreateCoverLetterAction, DeleteCoverLetterAction } from "@/services/cover-letter.service"
import { CoverLetterSchema, CreateCoverLetterType } from "@/types/cover-letter.types"
import { CoverLetterKeys } from "@/types/query-keys/cover-letter.keys"
import { RouteURL } from "@/lib/routes"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const useCoverLetterQuery = () => {
    const router = useRouter()
    
    const query = useQuery({
        queryKey: CoverLetterKeys.all,
        queryFn: async () => {
            const req = await fetch('/api/v1/cover-letter')
            if (!req.ok) {
                throw new Error('Failed to fetch cover letters')
            }
            const coverLetters = CoverLetterSchema.array().safeParse(await req.json())
            return coverLetters.data
        }
    })

    const CreateCoverLetter = useMutation({
        mutationFn: async (data: CreateCoverLetterType) => {
            const result = await CreateCoverLetterAction(data)
            if (result?.error) {
                throw new Error(result.error)
            }
            return result
        }, 
        onSuccess: (result) => {
            query.refetch()
            toast.success('Cover letter created successfully!')
            if (result?.id) {
                router.push(`${RouteURL.CREATE_COVER_LETTER}/completed/${result.id}`)
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create cover letter.')
        }
    })

    const DeleteCoverLetter = useMutation({
        mutationFn: async (id: string) => {
            const result = await DeleteCoverLetterAction(id)
            if (result?.error) {
                throw new Error(result.error)
            }
            return result
        }, 
        onSuccess: () => {
            query.refetch()
            toast.success('Cover letter deleted successfully!')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete cover letter.')
        }
    })

    const DownloadServerPDF = useMutation({
        mutationFn: async (id: string) => {
            const req = await fetch(`/api/v1/cover-letter/generate/pdf/${id}`, {
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

            // Create a link to download the PDF
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
        CreateCoverLetter,
        DeleteCoverLetter,
        DownloadServerPDF,
    }
}