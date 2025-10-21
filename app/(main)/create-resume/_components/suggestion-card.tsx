"use client";

import { SuggestionOpType } from "@/types/resume.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

interface SuggestionCardProps {
  suggestion: SuggestionOpType;
  isApplied: boolean;
  onApply: (suggestion: SuggestionOpType) => void;
  onUndo: (suggestionId: string) => void;
}

export function SuggestionCard({
  suggestion,
  isApplied,
  onApply,
  onUndo,
}: SuggestionCardProps) {
  const fieldName =
    suggestion.fieldPath
      .split(".")
      .pop()
      ?.replace(/([A-Z])/g, " $1")
      .toLowerCase() || "Field";

  const capitalizedFieldName =
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

  const handleApply = () => {
    onApply(suggestion);
  };

  const handleUndo = () => {
    onUndo(suggestion.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`transition-all ${
          isApplied
            ? "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
            : ""
        }`}
      >
        <CardContent className="pt-4">
          {/* Header with Field Name and Confidence */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {capitalizedFieldName}
                </Badge>
                {isApplied && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Applied
                  </Badge>
                )}
              </div>
              {suggestion.confidence && (
                <p className="text-xs text-muted-foreground">
                  Confidence: {Math.round(suggestion.confidence * 100)}%
                </p>
              )}
            </div>
          </div>

          {/* Explanation */}
          {suggestion.explanation && (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                {suggestion.explanation}
              </p>
              <Separator className="mb-3" />
            </>
          )}

          {/* Before and After */}
          <div className="space-y-2 mb-4">
            {suggestion.originalValue && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Current
                </p>
                <div className="bg-background border border-red-200 dark:border-red-800 rounded p-2">
                  <p className="text-sm text-foreground break-words line-clamp-2">
                    {String(suggestion.originalValue)}
                  </p>
                </div>
              </div>
            )}

            <div className="text-center text-xs text-muted-foreground">↓</div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Suggested
              </p>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-2">
                <p className="text-sm text-foreground break-words line-clamp-2">
                  {String(suggestion.suggestedValue)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {!isApplied ? (
              <Button
                size="sm"
                // type="button"
                onClick={handleApply}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Apply
              </Button>
            ) : (
              <Button
                size="sm"
                // type="button"
                onClick={handleUndo}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Undo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
