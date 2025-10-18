import { Header } from "@/components/common/header/header.component";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AccountSettingsDialogHandler from "@/components/common/account-settings/account-settings-dialog-handler";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="relative w-full h-full">
      <Header user={sessionData?.user || null} />
      <AccountSettingsDialogHandler />
      <main className="h-[calc(100dvh-var(--header-height))]">{children}</main>
    </div>
  );
}
