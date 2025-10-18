"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateResumeSchema, CreateResumeType } from "@/types/resume.types";
import { AppForm, AppFormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useResumeGeneration } from "@/hooks/query/use-resume";
import SuggestionReviewPanel from "./_components/SuggestionReviewPanel";
import { Input } from "@/components/ui/input";
import { ResumeSuggestionsStructuredType } from "@/types/helper.types";
import { ProfileType } from "@/types/profile.types";

export default function GenerateResumePage() {
  const [generationResult, setGenerationResult] = useState<
    | ({
        profile: ProfileType;
      } & ResumeSuggestionsStructuredType)
    | null
  >(null);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(
    new Set()
  );

  const form = useForm<CreateResumeType>({
    resolver: zodResolver(CreateResumeSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      companyName: "",
    },
  });

  const { mutateAsync, isPending } = useResumeGeneration();

  const handleGenerate = async (data: CreateResumeType) => {
    try {
      const result = await mutateAsync(data);
      setGenerationResult(result);
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Generation failed",
      });
    }
  };

  const handleAcceptSuggestion = (id: string) => {
    setAcceptedSuggestions((prev) => new Set(prev).add(id));
  };

  const handleRejectSuggestion = (id: string) => {
    setAcceptedSuggestions((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  if (generationResult) {
    return (
      <SuggestionReviewPanel
        jobTitle={form.getValues("jobTitle")}
        companyName={form.getValues("companyName")}
        profile={generationResult.profile}
        suggestions={generationResult.suggestions}
        matchScore={generationResult.matchScore}
        keywordsMatched={generationResult.keywordsMatched}
        keywordsMissing={generationResult.keywordsMissing}
        acceptedSuggestions={acceptedSuggestions}
        onAccept={handleAcceptSuggestion}
        onReject={handleRejectSuggestion}
        onSave={async () => {
          // Save resume with accepted suggestions
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Generate Resume</h1>

      <AppForm
        form={form}
        onSubmit={form.handleSubmit(handleGenerate)}
        className="space-y-4"
      >
        {/* <FormField control={form.control} name="jobTitle">
          {({ field }) => (
            <AppFormField label="Job Title">
              <Input {...field} />
            </AppFormField>
          )}
        </FormField> */}

        <AppFormField label="Company Name" description="Optional">
          <Input
            placeholder="e.g., Tech Corp"
            {...form.register("companyName")}
          />
        </AppFormField>

        <AppFormField label="Job Title">
          <Input
            placeholder="e.g., Software Engineer"
            {...form.register("jobTitle")}
            required
          />
        </AppFormField>

        <AppFormField label="Company Name" description="Optional">
          <Textarea
            placeholder="Paste the full job description here..."
            className="min-h-[200px]"
            {...form.register("jobDescription")}
          />
        </AppFormField>

        <Button type="submit" loading={isPending} className="w-full">
          Generate Resume
        </Button>
      </AppForm>
    </div>
  );
}
