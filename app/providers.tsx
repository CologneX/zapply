"use client";

import DialogProvider, { openDialog } from "@/components/common/dialog";
import dynamic from "next/dynamic";

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => m.Toaster),
  { ssr: false }
);

import { queryClientOptions } from "@/lib/query-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
const Banner = dynamic(
  () => import("@/components/ui/banner").then((m) => m.Banner),
  { ssr: false }
);
const BannerIcon = dynamic(
  () => import("@/components/ui/banner").then((m) => m.BannerIcon),
  { ssr: false }
);
const BannerTitle = dynamic(
  () => import("@/components/ui/banner").then((m) => m.BannerTitle),
  { ssr: false }
);
const BannerAction = dynamic(
  () => import("@/components/ui/banner").then((m) => m.BannerAction),
  { ssr: false }
);
import { CircleAlert } from "lucide-react";
import { useSession } from "@/lib/auth-client";
const AccountSettingsContent = dynamic(
  () => import("@/components/common/account-settings-dialog").then((m) => m.default),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));
  const { data } = useSession();
  return (
    <QueryClientProvider client={queryClient}>
      {data !== undefined && !data?.user?.displayUsername && (
        <Banner>
          <BannerIcon icon={CircleAlert} />
          <BannerTitle>Set up your Username to share your profile</BannerTitle>
          <BannerAction
            onClick={() => {
              openDialog({
                title: "Account Settings",
                description: "Manage your account preferences",
                children: <AccountSettingsContent />,
                showCloseButton: true,
              });
            }}
          >
            Open settings
          </BannerAction>
        </Banner>
      )}
      <DialogProvider>{children}</DialogProvider>
      <Toaster position="bottom-left" />
    </QueryClientProvider>
  );
}
