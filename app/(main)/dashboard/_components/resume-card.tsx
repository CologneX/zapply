"use client";

import { ResumeType } from "@/types/resume.types";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Edit2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface ResumeCardProps {
  resume: ResumeType;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ResumeCard({
  resume,
  onEdit,
  onView,
  onDelete,
}: ResumeCardProps) {
  const matchScore = resume.matchScore ?? 0;
  const keywordsMatched = resume.keywordsMatched?.length ?? 0;
  const keywordsMissing = resume.keywordsMissing?.length ?? 0;

  // Determine color based on match score
  const getMatchScoreColor = (score: number) => {
    if (score >= 75) return "bg-green-500/10 text-green-700 border-green-200";
    if (score >= 50) return "bg-amber-500/10 text-amber-700 border-amber-200";
    return "bg-red-500/10 text-red-700 border-red-200";
  };

  return (
    <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80">
      {/* Content */}
      <div className="flex flex-col gap-2">
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
              className={`flex-shrink-0 text-xs font-semibold ${getMatchScoreColor(matchScore)}`}
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
            </span>
            keywords
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(resume.createdAt), {
              addSuffix: true,
            })}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onView?.(resume._id)}
              title="View"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onEdit?.(resume._id)}
              title="Edit"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete?.(resume._id)}
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
