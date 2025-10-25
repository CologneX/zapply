"use client";
import { Button } from "@/components/ui/button";
import { useCoverLetterQuery } from "@/hooks/query/use-coverLetter";

export default function DownloadCLButton({
  cover_letter_id,
}: {
  cover_letter_id: string;
}) {
  const { DownloadServerPDF } = useCoverLetterQuery();
  return (
    <Button size="lg" onClick={() => DownloadServerPDF.mutate(cover_letter_id)}>
      Download PDF
    </Button>
  );
}
