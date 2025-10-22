"use client";

import { CoverLetterType } from "@/types/cover-letter.types";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Edit2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CoverLetterCardProps {
  coverLetter: CoverLetterType;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function CoverLetterCard({
  coverLetter,
  onEdit,
  onView,
  onDelete,
}: CoverLetterCardProps) {
  const contentPreview = coverLetter.content
    .substring(0, 150)
    .replace(/<[^>]*>/g, "");

  const truncatedPreview =
    contentPreview.length === 150 ? contentPreview + "..." : contentPreview;

  return (
    <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80">
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

        {/* Preview */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {truncatedPreview}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(coverLetter.createdAt), {
              addSuffix: true,
            })}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onView?.(coverLetter._id)}
              title="View"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onEdit?.(coverLetter._id)}
              title="Edit"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete?.(coverLetter._id)}
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
