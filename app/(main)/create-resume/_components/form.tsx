"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppForm, AppFormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { useResumeQuery } from "@/hooks/query/use-resume";
import { FormField } from "@/components/ui/form";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/ui/rich-text-editor"),
  {
    ssr: false,
    loading: () => <div className="min-h-[120px]" />,
  }
);
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useState } from "react";
import ResumeProfileSections from "./sections";
import {
  ClientCreateResumeSchema,
  ClientCreateResumeType,
  GenerateResumeRequestSchema,
  GenerateResumeRequestType,
} from "@/types/resume.types";

export default function ResumeTailorPage() {
  const [isEnterGeneral, setIsEnterGeneral] = useState<boolean>(true);

  const generateForm = useForm<GenerateResumeRequestType>({
    resolver: zodResolver(GenerateResumeRequestSchema),
    defaultValues: {
      jobDescription: "",
      jobTitle: "",
      companyName: "",
    },
  });

  const createResumeForm = useForm<ClientCreateResumeType>({
    resolver: zodResolver(ClientCreateResumeSchema),
    defaultValues: {
      appliedSuggestions: [],
      matchScore: undefined,
      keywordsMatched: [],
      keywordsMissing: [],
      profile: {},
    },
  });

  const { GenerateResume, CreateResume } = useResumeQuery();
  const handleGenerate = async () => {
    try {
      const result = await GenerateResume.mutateAsync(generateForm.getValues());
      createResumeForm.reset({
        profile: result.profile,
        appliedSuggestions: [],
        suggestions: result.suggestions,
        matchScore: result.matchScore,
        keywordsMatched: result.keywordsMatched,
        keywordsMissing: result.keywordsMissing,
        jobTitle: generateForm.getValues().jobTitle,
        jobDescription: generateForm.getValues().jobDescription,
        companyName: generateForm.getValues().companyName,
      });
      setIsEnterGeneral(false);
    } catch (error) {
      console.error("Error generating resume suggestions:", error);
      const err = error as Error;
      generateForm.setError("root", {
        type: "manual",
        message: err?.message || "Failed to generate suggestions",
      });
    }
  };

  const handleSaveResume = async () => {
    try {
      await CreateResume.mutateAsync(createResumeForm.getValues());
    } catch (error) {
      console.error("Error saving resume:", error);
      const err = error as Error;
      generateForm.setError("root", {
        type: "manual",
        message: err?.message || "Failed to save resume",
      });
    }
  };

  return (
    <>
      <AppForm
        form={generateForm}
        onSubmit={generateForm.handleSubmit(handleGenerate)}
        error={generateForm.formState.errors.root?.message}
      >
        {isEnterGeneral && (
          <motion.section
            id="general-info"
            className="space-y-4"
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <FormField
              control={generateForm.control}
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
              control={generateForm.control}
              name="companyName"
              render={({ field }) => (
                <AppFormField
                  label="Company Name"
                  description="The name of the company you are applying to."
                >
                  <Input {...field} placeholder="Optional" />
                </AppFormField>
              )}
            />
            <FormField
              control={generateForm.control}
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

      <AppForm
        form={createResumeForm}
        onSubmit={createResumeForm.handleSubmit(handleSaveResume)}
        error={createResumeForm.formState.errors.root?.message}
      >
        {!isEnterGeneral && (
          <motion.section
            id="profile-sections"
            className="space-y-6"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ResumeProfileSections form={createResumeForm} />
          </motion.section>
        )}
      </AppForm>
    </>
  );
}
