"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { openDialog, closeDialog } from "@/components/common/dialog";
import AccountSettingsContent from "./account-settings-content";

export default function AccountSettingsDialogHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isOpen = searchParams?.get("settings") === "account";

  useEffect(() => {
    if (isOpen) {
      openDialog({
        title: "Account Settings",
        description: "Manage your account preferences",
        children: <AccountSettingsContent />,
        showCloseButton: true,
        onCloseAction: () => {
          // remove the `settings` param when dialog closes
          const params = new URLSearchParams(window.location.search);
          params.delete("settings");
          const qs = params.toString();
          router.replace(`${window.location.pathname}${qs ? `?${qs}` : ""}`, {
            scroll: false,
          });
        },
      });
    } else {
      closeDialog();
    }
    // We intentionally only care about the stringified params and isOpen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, searchParams?.toString()]);

  return null;
}
