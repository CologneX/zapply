export const CoverLetterKeys = {
    all: ["cover-letters"],
    lists: () => [...CoverLetterKeys.all, "list"],
    list: (filters?: string) => [...CoverLetterKeys.lists(), { filters }],
    details: () => [...CoverLetterKeys.all, "detail"],
    detail: (id: string) => [...CoverLetterKeys.details(), id],
};