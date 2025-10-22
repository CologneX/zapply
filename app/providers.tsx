"use client";

import DialogProvider from "@/components/common/dialog";
import { Toaster } from "@/components/ui/sonner";
import { queryClientOptions } from "@/lib/query-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      <DialogProvider>{children}</DialogProvider>
      <Toaster position="bottom-left" />
    </QueryClientProvider>
  );
}
