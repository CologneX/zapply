"use client";

import { SuggestionOpType } from "@/types/resume.types";
import { SuggestionCard } from "./suggestion-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { AnimatePresence } from "motion/react";

interface SuggestionsListProps {
  suggestions: SuggestionOpType[];
  appliedSuggestions: SuggestionOpType[];
  onApply: (suggestion: SuggestionOpType) => void;
  onUndo: (suggestionId: string) => void;
}

export function SuggestionsList({
  suggestions,
  appliedSuggestions,
  onApply,
  onUndo,
}: SuggestionsListProps) {
  const appliedIds = new Set(appliedSuggestions.map((s) => s.id));

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No suggestions yet</EmptyTitle>
              <EmptyDescription>
                Generate suggestions to see recommendations for your resume.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  // Separate applied and unapplied suggestions
  const appliedSuggestions_ = suggestions.filter((s) => appliedIds.has(s.id));
  const unappliedSuggestions = suggestions.filter((s) => !appliedIds.has(s.id));

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-lg">
          Suggestions ({suggestions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Applied Suggestions Section */}
        {appliedSuggestions_.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Applied ({appliedSuggestions_.length})
            </p>
            <AnimatePresence>
              {appliedSuggestions_.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  isApplied={true}
                  onApply={onApply}
                  onUndo={onUndo}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Divider */}
        {appliedSuggestions_.length > 0 && unappliedSuggestions.length > 0 && (
          <div className="border-t my-4" />
        )}

        {/* Unapplied Suggestions Section */}
        {unappliedSuggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Available ({unappliedSuggestions.length})
            </p>
            <AnimatePresence>
              {unappliedSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  isApplied={false}
                  onApply={onApply}
                  onUndo={onUndo}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
