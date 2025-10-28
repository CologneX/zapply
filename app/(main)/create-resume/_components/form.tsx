"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppForm, AppFormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { useResumeQuery } from "@/hooks/query/use-resume";
import { FormField } from "@/components/ui/form";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import ResumeProfileSections from "./sections";
import {
  ClientCreateResumeSchema,
  ClientCreateResumeType,
  GenerateResumeRequestSchema,
  GenerateResumeRequestType,
} from "@/types/resume.types";
import { ProgressCircle } from "@/components/ui/progress";
import { Check } from "lucide-react";

const RichTextEditor = dynamic(
  () => import("@/components/ui/rich-text-editor"),
  {
    ssr: false,
    loading: () => <div className="min-h-[120px]" />,
  }
);

export default function ResumeTailorPage() {
  const [isEnterGeneral, setIsEnterGeneral] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const steps = useMemo(
    () => [
      { label: "Reading profile", duration: 2000 },
      { label: "Understanding job description", duration: 2000 },
      { label: "Tinkering with resume", duration: 3000 },
      { label: "Done", duration: 0 },
    ],
    []
  );

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

  useEffect(() => {
    if (!GenerateResume.isPending) {
      setCurrentStep(0);
      setCompletedSteps([false, false, false, false]);
      return;
    }

    // Start step progression
    const stepTimers: NodeJS.Timeout[] = [];
    let requestCompleted = false;

    const progressSteps = async () => {
      for (let i = 0; i < steps.length - 1; i++) {
        if (requestCompleted) {
          setCurrentStep(steps.length - 1);
          setCompletedSteps((prev) => {
            const newSteps = [...prev];
            for (let j = 0; j < i; j++) {
              newSteps[j] = true;
            }
            newSteps[steps.length - 1] = true;
            return newSteps;
          });
          return;
        }

        setCurrentStep(i);

        const timer = new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            setCompletedSteps((prev) => {
              const newSteps = [...prev];
              newSteps[i] = true;
              return newSteps;
            });
            resolve();
          }, steps[i].duration);
          stepTimers.push(timeout);
        });

        await timer;
      }

      // Set to Done step when all steps complete
      setCurrentStep(steps.length - 1);
      setCompletedSteps((prev) => {
        const newSteps = [...prev];
        newSteps[steps.length - 1] = true;
        return newSteps;
      });
    };

    progressSteps();

    // Monitor request completion
    const checkRequestComplete = setInterval(() => {
      if (!GenerateResume.isPending) {
        requestCompleted = true;
        clearInterval(checkRequestComplete);
      }
    }, 100);

    return () => {
      clearInterval(checkRequestComplete);
      stepTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [GenerateResume.isPending, steps]);

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
      <div className="relative">
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
        <AnimatePresence>
          {GenerateResume.isPending && (
            <motion.div
              key="form-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-background/30 backdrop-blur-xs -m-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="flex flex-col items-center gap-6"
              >
                <ProgressCircle
                  value={25}
                  size={64}
                  strokeWidth={10}
                  className="text-primary animate-spin"
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                  className="text-center text-sm text-muted-foreground"
                >
                  Generating suggestions...
                </motion.p>

                {/* Step Progress */}
                <div className="flex flex-col gap-3">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      {/* Status Icon */}
                      <div className="w-5 h-5 flex items-center justify-center">
                        {completedSteps[index] ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                            }}
                          >
                            <Check className="w-5 h-5 text-green-500" />
                          </motion.div>
                        ) : currentStep === index ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                          />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                        )}
                      </div>

                      {/* Step Label */}
                      <span
                        className={`text-sm transition-colors ${
                          completedSteps[index]
                            ? "text-green-500"
                            : currentStep === index
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
