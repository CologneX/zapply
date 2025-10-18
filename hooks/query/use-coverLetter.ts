import { ActionErrorWrapper } from "@/lib/utils"
import { CreateCoverLetterAction, DeleteCoverLetterAction } from "@/services/cover-letter.service"
import { CreateCoverLetterType } from "@/types/cover-letter.types"
import { CoverLetterKeys } from "@/types/query-keys/cover-letter.keys"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCoverLetterQuery = () => {
    const query = useQuery({
        queryKey: CoverLetterKeys.all,
        queryFn: async () => {
            const req = await fetch('/api/cover-letters')
            if (!req.ok) {
                throw new Error('Failed to fetch cover letters')
            }
            return req.json()
        }
    })
    const CreateCoverLetter = useMutation({
        mutationFn: async (data: CreateCoverLetterType) => {
            toast.promise(
                ActionErrorWrapper(CreateCoverLetterAction(data)), {
                loading: 'Creating cover letter...',
                success: 'Cover letter created successfully!',
                error: 'Failed to create cover letter.'
            }
            )
        }, onSuccess: () => {
            query.refetch()
        }
    })

    const DeleteCoverLetter = useMutation({
        mutationFn: async (id: string) => {
            toast.promise(
                ActionErrorWrapper(DeleteCoverLetterAction(id)), {
                loading: 'Deleting cover letter...',
                success: 'Cover letter deleted successfully!',
                error: 'Failed to delete cover letter.'
            }
            )
        }, onSuccess: () => {
            query.refetch()
        }
    })
    return {
        ...query,
        CreateCoverLetter,
        DeleteCoverLetter
    }
}