"use client";

import DialogProvider from "@/components/common/dialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { queryClientOptions } from "@/lib/query-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <DialogProvider>{children}</DialogProvider>
        <Toaster position="top-center" />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
