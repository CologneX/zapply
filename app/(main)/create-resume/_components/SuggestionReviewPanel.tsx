"use client";

import { ProfileType } from "@/types/profile.types";
import {
  ResumeSuggestionsStructuredType,
  SuggestionOpType,
} from "@/types/helper.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

type SuggestionReviewPanelProps = {
  profile: ProfileType;
  acceptedSuggestions: Set<string>;
  jobTitle: string;
  companyName?: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onSave: () => Promise<void>;
} & ResumeSuggestionsStructuredType;

export default function SuggestionReviewPanel({
  jobTitle,
  companyName,
  suggestions,
  matchScore,
  keywordsMatched,
  keywordsMissing,
  acceptedSuggestions,
  onAccept,
  onReject,
  onSave,
}: SuggestionReviewPanelProps) {
//   const pendingSuggestions = suggestions.filter(
//     (s) => !acceptedSuggestions.has(s.id)
//   );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Match Score Header */}
      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Resume Preview</h2>
            <p className="text-muted-foreground">
              {jobTitle} {companyName ? `at ${companyName}` : ""}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{matchScore}%</div>
            <p className="text-sm text-muted-foreground">Match Score</p>
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <div>
            <p className="text-sm font-medium">Matched Keywords</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {keywordsMatched?.map((kw) => (
                <Badge key={kw} variant="secondary">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
          {keywordsMissing && keywordsMissing.length > 0 && (
            <div>
              <p className="text-sm font-medium text-yellow-600">
                Missing Keywords
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {keywordsMissing.map((kw) => (
                  <Badge key={kw} variant="outline">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            isAccepted={acceptedSuggestions.has(suggestion.id)}
            onAccept={() => onAccept(suggestion.id)}
            onReject={() => onReject(suggestion.id)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {acceptedSuggestions.size} of {suggestions.length} suggestions
          accepted
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => suggestions.forEach((s) => onReject(s.id))}
          >
            Reject All
          </Button>
          <Button
            variant="outline"
            onClick={() => suggestions.forEach((s) => onAccept(s.id))}
          >
            Accept All
          </Button>
          <Button onClick={onSave}>Save Resume</Button>
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({
  suggestion,
  isAccepted,
  onAccept,
  onReject,
}: {
  suggestion: SuggestionOpType;
  isAccepted: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        isAccepted ? "bg-green-50 border-green-200" : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="text-sm font-medium text-muted-foreground">
          {suggestion.fieldPath}
        </div>
        {suggestion.confidence && (
          <Badge variant="secondary">
            {Math.round(suggestion.confidence * 100)}% confident
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Original:</p>
          <p className="text-sm line-through opacity-60">
            {suggestion.originalValue || "(empty)"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Suggested:</p>
          <p className="text-sm font-medium">{suggestion.suggestedValue}</p>
        </div>

        {suggestion.explanation && (
          <div className="bg-blue-50 p-2 rounded text-sm">
            💡 {suggestion.explanation}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        {isAccepted ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            className="flex-1"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Undo
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
            <Button size="sm" onClick={onAccept} className="flex-1">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Accept
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
