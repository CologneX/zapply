"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppForm, AppFormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { useResumeQuery } from "@/hooks/query/use-resume";
import {
  ClientCreateResumeSchema,
  ClientCreateResumeType,
  SuggestionOpType,
} from "@/types/resume.types";
import { FormField } from "@/components/ui/form";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRadial } from "@/components/ui/progress";
import { CountingNumber } from "@/components/ui/counting-number";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { ProfilePreview } from "./profile-preview";
import { SuggestionsList } from "./suggestions-list";
import { useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";

export default function ResumeTailorPage() {
  const form = useForm<ClientCreateResumeType>({
    resolver: zodResolver(ClientCreateResumeSchema),
    defaultValues: {
      jobDescription: `About the Role

The Software Developer contributes to SCG Indonesia's digital transformation by designing, developing, and maintaining software solutions that enhance business operations. This role involves working closely with internal teams to build applications, improve system functionality, and deliver user-focused digital tools that support SCG's diverse businesses.


Key Responsibilities

Develop, test, and deploy software applications based on business requirements.
Collaborate with cross-functional teams to design system features and integrations.
Maintain and improve existing applications, ensuring performance, security, and scalability.
Write clean, maintainable, and efficient code following best practices.
Troubleshoot and resolve software defects or system issues in a timely manner.
Participate in code reviews, testing processes, and documentation.
Explore new technologies and suggest solutions that support SCG's digital initiatives.


Qualifications

Bachelor's degree in Computer Science, Software Engineering, or related field.
1–3 years of experience in software development; strong internship experience may also be considered.
Proficiency in one or more programming languages (e.g., Java, Python, C#, JavaScript).
Familiarity with databases, APIs, and modern development frameworks.
Knowledge of version control systems (e.g., Git) and agile development methods.
Strong problem-solving skills and ability to work collaboratively.
Communication proficiency in Bahasa Indonesia and English.`,
      jobTitle: "Software Developer – SCG Indonesia",
      appliedSuggestions: [],
      keywordsMatched: [],
      keywordsMissing: [],
      matchScore: undefined,
    },
  });

  const [isEnterGeneral, setIsEnterGeneral] = useState<boolean>(true);

  const [availableSuggestions, setAvailableSuggestions] = useState<
    SuggestionOpType[]
  >([]);

  const formValues = form.watch();

  const { GenerateResume, CreateResume } = useResumeQuery();

  const effectiveProfile = useMemo(() => {
    const profile = { ...formValues };
    if (
      formValues.appliedSuggestions &&
      formValues.appliedSuggestions.length > 0
    ) {
      formValues.appliedSuggestions.forEach((suggestion) => {
        const paths = suggestion.fieldPath.split(".");
        let current: Record<string, unknown> = profile;

        // Navigate to the parent object
        for (let i = 0; i < paths.length - 1; i++) {
          const path = paths[i];
          const numPath = Number(path);

          if (!isNaN(numPath) && Array.isArray(current)) {
            current = current[numPath] as Record<string, unknown>;
          } else {
            if (!current[path]) {
              current[path] = {};
            }
            current = current[path] as Record<string, unknown>;
          }
        }

        const lastPath = paths[paths.length - 1];
        current[lastPath] = suggestion.suggestedValue;
      });
    }

    return profile;
  }, [formValues]);

  const handleGenerate = async () => {
    try {
      const result = await GenerateResume.mutateAsync(form.getValues());
      setAvailableSuggestions(result.suggestions || []);

      form.reset({
        ...form.getValues(),
        matchScore: result.matchScore,
        keywordsMatched: result.keywordsMatched,
        keywordsMissing: result.keywordsMissing,
      });

      setIsEnterGeneral(false);
    } catch (error) {
      console.error("Error generating resume suggestions:", error);
      const err = error as Error;
      form.setError("root", {
        type: "manual",
        message: err?.message || "Failed to generate suggestions",
      });
    }
  };

  const handleApplySuggestion = (suggestion: SuggestionOpType) => {
    const currentApplied = formValues.appliedSuggestions || [];
    if (currentApplied.some((s) => s.id === suggestion.id)) {
      return;
    }
    form.setValue("appliedSuggestions", [...currentApplied, suggestion]);
  };

  const handleUndoSuggestion = (suggestionId: string) => {
    const currentApplied = formValues.appliedSuggestions || [];
    form.setValue(
      "appliedSuggestions",
      currentApplied.filter((s) => s.id !== suggestionId)
    );
  };

  const handleSaveResume = async () => {
    try {
      await CreateResume.mutateAsync(form.getValues());
    } catch (error) {
      console.error("Error saving resume:", error);
      const err = error as Error;
      form.setError("root", {
        type: "manual",
        message: err?.message || "Failed to save resume",
      });
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <AppForm
        form={form}
        onSubmit={form.handleSubmit(handleGenerate)}
        error={form.formState.errors.root?.message}
      >
        {/* Left Column: Input Form */}
        {isEnterGeneral && (
          <motion.section
            transition={{ duration: 0.4, ease: "easeInOut" }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="lg:col-span-1 space-y-4"
          >
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <AppFormField
                  label="Job Title"
                  description="The title of the job you are applying for."
                >
                  <Input {...field} />
                </AppFormField>
              )}
            />
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <AppFormField
                  label="Job Description"
                  description="The description of the job you are applying for."
                >
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                  />
                </AppFormField>
              )}
            />

            <Button
              type="submit"
              loading={GenerateResume.isPending}
              className="flex-1"
            >
              Generate Suggestions
            </Button>
          </motion.section>
        )}
      </AppForm>

      {/* Middle Column: Profile Preview */}
      {!isEnterGeneral && (
        <motion.div className="space-y-2">
          <Button
            type="button"
            onClick={() => setIsEnterGeneral(true)}
            variant="link"
          >
            <ArrowLeftIcon />
            Go back
          </Button>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:col-span-1"
          >
            <ProfilePreview profile={effectiveProfile} />
          </motion.div>

          <Button
            type="button"
            loading={CreateResume.isPending}
            className="w-full"
            onClick={handleSaveResume}
          >
            Save Resume
          </Button>
        </motion.div>
      )}

      {/* Right Column: Suggestions & Metrics */}
      {!isEnterGeneral && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="lg:col-span-1 space-y-4"
        >
          {/* Match Score Card */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <ProgressRadial
                value={formValues.matchScore || 0}
                size={120}
                startAngle={-180}
                endAngle={0}
                strokeWidth={10}
                indicatorClassName="text-primary"
                className="text-primary"
              >
                <div className="text-center">
                  <CountingNumber
                    from={0}
                    to={formValues.matchScore || 0}
                    duration={3}
                    className="text-2xl font-bold"
                  />
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </ProgressRadial>

              {/* Keywords */}
              <Separator className="w-full" />

              {/* Matched Keywords */}
              {formValues.keywordsMatched &&
                formValues.keywordsMatched.length > 0 && (
                  <div className="w-full">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Matched Keywords
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {formValues.keywordsMatched
                        .slice(0, 5)
                        .map((keyword, idx) => (
                          <Badge
                            key={idx}
                            className="text-xs p-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            variant="secondary"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      {formValues.keywordsMatched.length > 5 && (
                        <Badge variant="secondary" className="text-xs p-1">
                          +{formValues.keywordsMatched.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

              {/* Missing Keywords */}
              {formValues.keywordsMissing &&
                formValues.keywordsMissing.length > 0 && (
                  <div className="w-full">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Missing Keywords
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {formValues.keywordsMissing
                        .slice(0, 5)
                        .map((keyword, idx) => (
                          <Badge
                            key={idx}
                            className="text-xs p-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            variant="secondary"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      {formValues.keywordsMissing.length > 5 && (
                        <Badge variant="secondary" className="text-xs p-1">
                          +{formValues.keywordsMissing.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Suggestions List */}
          {formValues.matchScore && (
            <SuggestionsList
              suggestions={availableSuggestions}
              appliedSuggestions={formValues.appliedSuggestions || []}
              onApply={handleApplySuggestion}
              onUndo={handleUndoSuggestion}
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
