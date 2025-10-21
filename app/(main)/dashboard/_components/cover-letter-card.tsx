"use client";

import { CoverLetterType } from "@/types/cover-letter.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Edit2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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
    <Card
      className={cn(
        "relative overflow-hidden min-w-[300px] max-h-32 w-full",
        "bg-gradient-to-br from-primary/5 to-primary/10",
        "border-primary/20 hover:border-primary/40",
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
              {coverLetter.companyName}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {coverLetter.jobTitle}
            </p>
          </div>
        </div>

        {/* Preview */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {truncatedPreview}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-primary/10">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(coverLetter.createdAt), {
              addSuffix: true,
            })}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onView?.(coverLetter._id)}
            >
              <Eye className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onEdit?.(coverLetter._id)}
            >
              <Edit2 className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:text-destructive"
              onClick={() => onDelete?.(coverLetter._id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
