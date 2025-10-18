"use client";

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useAuthQuery } from "@/hooks/query/use-auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccountSettingsContent() {
  const { Logout } = useAuthQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOnClose = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.delete("settings");
    const qs = params.toString();
    router.replace(`${window.location.pathname}${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  };
  return (
    <div className="space-y-4">
      <p>Here you can manage your account settings.</p>
      <div className="flex gap-2 items-center justify-end">
        <Button
          variant="destructive"
          className="mr-auto"
          onClick={() => Logout.mutate()}
          loading={Logout.isPending}
        >
          <LogOutIcon />
          Logout
        </Button>
        <Button variant="ghost" onClick={handleOnClose}>
          Close
        </Button>
        <Button onClick={() => alert("Not implemented yet")}>Save</Button>
      </div>
    </div>
  );
}
