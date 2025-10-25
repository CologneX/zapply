"use client";
import { Button } from "@/components/ui/button";
import { useResumeQuery } from "@/hooks/query/use-resume";

export default function DownloadResumeButton({
  resume_id,
}: {
  resume_id: string;
}) {
  const { DownloadServerPDF } = useResumeQuery();
  return (
    <Button size="lg" onClick={() => DownloadServerPDF.mutate(resume_id)}>
      Download PDF
    </Button>
  );
}
