"use client";

import { ResumeType } from "@/types/resume.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Edit2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
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
    <Card
      className={cn(
        "relative overflow-hidden min-w-[300px] h-auto w-full",
        "bg-gradient-to-br from-chart-2/5 to-chart-2/10",
        "border-chart-2/20 hover:border-chart-2/40",
        "transition-all duration-300 hover:shadow-lg",
        "group cursor-default"
      )}
    >
      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {resume.jobTitle}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {resume.companyName || "Job Optimization"}
            </p>
          </div>
          {/* Match Score Badge */}
          {matchScore > 0 && (
            <Badge
              className={cn(
                "flex-shrink-0 text-xs font-semibold",
                getMatchScoreColor(matchScore)
              )}
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
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-chart-2/10">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(resume.createdAt), {
              addSuffix: true,
            })}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onView?.(resume._id)}
            >
              <Eye className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onEdit?.(resume._id)}
            >
              <Edit2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:text-destructive"
              onClick={() => onDelete?.(resume._id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
