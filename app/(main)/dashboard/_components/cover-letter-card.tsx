"use client";

import { CoverLetterType } from "@/types/cover-letter.types";
import { Button } from "@/components/ui/button";
import { Trash2, DownloadCloudIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useCoverLetterQuery } from "@/hooks/query/use-coverLetter";
import { closeDialog, openDialog } from "@/components/common/dialog";

interface CoverLetterCardProps {
  coverLetter: CoverLetterType;
}

export function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
  const { DownloadServerPDF, DeleteCoverLetter } = useCoverLetterQuery();
  const handleDeleteCL = () => {
    openDialog({
      title: "Delete Cover Letter",
      description:
        "Are you sure you want to delete this cover letter? This action cannot be undone.",
      footer: (
        <Button
          variant="destructive"
          onClick={async () => {
            DeleteCoverLetter.mutate(coverLetter._id);
            closeDialog();
          }}
          loading={DeleteCoverLetter.isPending}
        >
          Delete
        </Button>
      ),
    });
  };
  return (
    <div className="relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80 w-96">
      {/* Content */}
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h6>{coverLetter.companyName}</h6>
            <p className="text-xs text-muted-foreground truncate">
              {coverLetter.jobTitle}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(coverLetter.createdAt), {
              addSuffix: true,
            })}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => DownloadServerPDF.mutate(coverLetter._id)}
              loading={DownloadServerPDF.isPending}
              title="Download PDF"
            >
              <DownloadCloudIcon className="h-3.5 w-3.5" />
            </Button>
            {/* <Button
              variant="ghost"
              size="icon-sm"
              
              onClick={() => onEdit?.(coverLetter._id)}
              title="Edit"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button> */}
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={handleDeleteCL}
              loading={DeleteCoverLetter.isPending}
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
