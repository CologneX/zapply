import { Header } from "@/components/common/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className=" w-full h-full">
      <Header user={sessionData?.user || null} />
      <main className="h-[calc(100dvh-var(--header-height))]">{children}</main>
    </div>
  );
}
