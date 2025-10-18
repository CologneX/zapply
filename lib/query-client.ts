export const queryClientOptions = {
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 1,
        },

    },
};

// const queryClient = new QueryClient(queryClientOptions);
