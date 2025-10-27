import { Button } from "@/components/ui/button";
import DownloadCLButton from "./_components/download-button";
import Link from "next/link";
import { RouteURL } from "@/lib/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Letter Created | Zapply",
  description: "Your cover letter has been successfully created. Download or share your personalized cover letter.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CompletedCoverLetterPage({
  params,
}: {
  params: Promise<{ cover_letter_id: string }>;
}) {
  const { cover_letter_id } = await params;
  return (
    <div className="px-4 mx-auto container py-8 grid place-items-center">
      <div className="flex flex-col gap-8">
        <h1 className="text-primary">Cover Letter created successfully!</h1>
        <div className="flex gap-2 justify-center">
          <Link href={RouteURL.DASHBOARD}>
            <Button variant="ghost" size="lg">
              Go to Dashboard
            </Button>
          </Link>
          <DownloadCLButton cover_letter_id={cover_letter_id} />
        </div>
      </div>
    </div>
  );
}
