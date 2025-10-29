"use client";

import { ResumeType } from "@/types/resume.types";
import { Button } from "@/components/ui/button";
import { Trash2, DownloadCloudIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { closeDialog, openDialog } from "@/components/common/dialog";
import { useResumeQuery } from "@/hooks/query/use-resume";

interface ResumeCardProps {
  resume: ResumeType;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const { DeleteResume, DownloadServerPDF } = useResumeQuery();
  const matchScore = resume.matchScore ?? 0;
  const keywordsMatched = resume.keywordsMatched?.length ?? 0;
  const keywordsMissing = resume.keywordsMissing?.length ?? 0;

  // Determine color based on match score
  const getMatchScoreColor = (score: number) => {
    if (score >= 75) return "bg-green-500/10 text-green-700 border-green-200";
    if (score >= 50) return "bg-amber-500/10 text-amber-700 border-amber-200";
    return "bg-red-500/10 text-red-700 border-red-200";
  };

  const handleDeleteResume = () => {
    openDialog({
      title: "Delete Cover Letter",
      description:
        "Are you sure you want to delete this cover letter? This action cannot be undone.",
      footer: (
        <Button
          variant="destructive"
          onClick={async () => {
            DeleteResume.mutate(resume._id);
            closeDialog();
          }}
          loading={DeleteResume.isPending}
        >
          Delete
        </Button>
      ),
    });
  };

  return (
    <div className="relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80 w-96">
      {/* Content */}
      <div className="flex flex-col gap-2 h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h6>{resume.jobTitle}</h6>
            <p className="text-xs text-muted-foreground truncate">
              {resume.companyName || "Job Optimization"}
            </p>
          </div>
          {/* Match Score Badge */}
          {matchScore > 0 && (
            <Badge
              className={`shrink-0 text-xs font-semibold ${getMatchScoreColor(
                matchScore
              )}`}
            >
              {matchScore}%
            </Badge>
          )}
        </div>

        {/* Keywords Info */}
        {(keywordsMatched > 0 || keywordsMissing > 0) && (
          <p className="text-xs text-muted-foreground">
            <span className="text-green-700 font-medium">
              {keywordsMatched}
            </span>
            /
            <span className="text-amber-700 font-medium">
              {keywordsMissing}
            </span>{" "}
            keywords
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(resume.createdAt), {
              addSuffix: true,
            })}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => DownloadServerPDF.mutate(resume._id)}
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
              onClick={handleDeleteResume}
              loading={DeleteResume.isPending}
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
