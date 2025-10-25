import { Button } from "@/components/ui/button";
import DownloadResumeButton from "./_components/download-button";
import Link from "next/link";
import { RouteURL } from "@/lib/routes";

export default async function CompletedResumePage({
  params,
}: {
  params: Promise<{ resume_id: string }>;
}) {
  const { resume_id } = await params;

  return (
    <div className="px-4 mx-auto container py-8 grid place-items-center">
      <div className="flex flex-col gap-8">
        <h1 className="text-primary">Resume created successfully!</h1>
        <div className="flex gap-2 justify-center">
          <Link href={RouteURL.DASHBOARD}>
            <Button variant="ghost" size="lg">
              Go to Dashboard
            </Button>
          </Link>
          <DownloadResumeButton resume_id={resume_id} />
        </div>
      </div>
    </div>
  );
}
