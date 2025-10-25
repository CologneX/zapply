"use client";

import { AppForm, AppFormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCoverLetterQuery } from "@/hooks/query/use-coverLetter";
import {
  CreateCoverLetterSchema,
  CreateCoverLetterType,
} from "@/types/cover-letter.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, SparklesIcon } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

export default function CoverLetterForm() {
  const [isGenerating, setStartGenerating] = useTransition();
  const form = useForm<CreateCoverLetterType>({
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
      additionalInfo: "",
      content: "",
    },
    resolver: zodResolver(CreateCoverLetterSchema),
    mode: "onBlur",
  });

  const { CreateCoverLetter } = useCoverLetterQuery();
  const handleGenerateGemini = async () => {
    await form.trigger();
    if (!form.formState.isValid) {
      return;
    }

    try {
      setStartGenerating(async () => {
        const response = await fetch("/api/v1/cover-letter/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobTitle: form.getValues("jobTitle"),
            companyName: form.getValues("companyName"),
            jobDescription: form.getValues("jobDescription"),
            additionalInfo: form.getValues("additionalInfo"),
            content: form.getValues("content"),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          form.setError("root", {
            type: "manual",
            message: error.error || "Failed to generate cover letter",
          });
          return;
        }

        if (!response.body) {
          form.setError("root", {
            type: "manual",
            message: "No response body from server",
          });
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let generatedContent = "";

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunkValue = decoder.decode(value, { stream: true });
            generatedContent += chunkValue;
            form.setValue("content", generatedContent);
          }
        } finally {
          reader.releaseLock();
        }
      });
    } catch (error) {
      console.error("Error generating cover letter:", error);
      form.setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate cover letter",
      });
    }
  };
  return (
    <AppForm form={form} className="grid grid-cols-2">
      <div className="space-y-8 overflow-y-auto p-2 relative">
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <AppFormField
              label="Job Title"
              description="The title of the job you are applying for."
            >
              <Input placeholder="Required" {...field} />
            </AppFormField>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <AppFormField
              label="Company Name"
              description="The name of the company you are applying to."
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
              description="Paste the job description here. This will help tailor the cover letter."
            >
              <RichTextEditor content={field.value} onChange={field.onChange} />
            </AppFormField>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <AppFormField
              label="Additional Information"
              description="Any additional information you'd like to include in the cover letter, such as specific skills, experiences, achievements, or motivation."
            >
              <Textarea rows={4} {...field} />
            </AppFormField>
          )}
        />
        <div className="flex flex-row gap-2">
          <Button
            type="button"
            className="flex-1"
            onClick={handleGenerateGemini}
            loading={isGenerating}
          >
            <SparklesIcon />
            Generate Content
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => CreateCoverLetter.mutate(form.getValues())}
            loading={CreateCoverLetter.isPending}
            disabled={
              isGenerating ||
              !form.formState.isValid ||
              !form.getValues().content
            }
          >
            <SaveIcon />
            Save
          </Button>
        </div>
      </div>

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <AppFormField className="p-2">
            <RichTextEditor
              content={field.value}
              onChange={field.onChange}
              editable={!isGenerating}
            />
          </AppFormField>
        )}
      />
    </AppForm>
  );
}
