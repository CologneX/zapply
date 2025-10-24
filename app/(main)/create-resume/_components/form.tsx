"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppForm, AppFormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { useResumeQuery } from "@/hooks/query/use-resume";
import { FormField } from "@/components/ui/form";
import RichTextEditor from "@/components/ui/rich-text-editor";
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
      jobDescription: `About the job
Are you passionate about building great products? Do you want to redefine the way travellers explore the world? Keen to be part of this growth journey with a bunch of amazing people? Then Pelago is the place for you!

We are looking for ambitious and motivated talents who are excited about staying on the cutting edge of Technology and always keen on innovating new ways to drive growth and taking our startup to new heights.

WHO ARE WE? 

Pelago is a travel experiences platform created by Singapore Airlines Group. Think of us as a travel magazine that you can book - highly curated, visually inspiring, with the trust and quality of Singapore Airlines. We connect you with global, local cultures and ideas so you can expand your life.

We are a team of diverse, passionate, empowered, inclusive, authentic and open individuals who share the same values and strive towards a common goal!

WHAT CAN WE OFFER YOU? 

 A unique opportunity to take end-to-end ownership of your workstream to deliver real value to users.
 Platforms to solve real user problems concerning travel planning & booking with innovative products/services.
 An amazing peer group to work with, and the ability to learn from the similarly great minds around you.
 An opportunity to be an integral part of shaping the company’s growth and culture with a diverse, fun, and dynamic environment with teammates from different parts of the world.
 Competitive compensation and benefits - including work flexibility, insurance, remote working and more!

WHAT WILL YOU BE DOING?

 Develop performant, accessible, and responsive frontend applications using modern web technologies.
 Collaborate with product managers, designers, and backend engineers to deliver user-centric solutions.
 Drive the architecture and design of frontend systems using best practices and scalable patterns.
 Write clean, maintainable, and well-tested code using TypeScript, React.js , and Next.js .
 Ensure the frontend stack meets high standards of usability, performance, security, and scalability.
 Embrace agile methodologies, contribute to sprint planning, retrospectives, and code reviews.
 Stay current with emerging technologies and advocate for their adoption where appropriate.
 Champion frontend excellence across engineering, including design systems and component libraries.
 Contribute to team knowledge sharing through discussions, code reviews, and mentoring.

WHAT EXPERTISE ARE MUST HAVES?

 3-5 years of experience building production-grade frontend applications with React.js , Next.js and TypeScript.
 Deep familiarity with Next.js and modern frontend architecture for server-side rendering and static site generation.
 Solid understanding of Core Web Vitals and performance metrics like LCP, FID, CLS, TTFB and how they affect user experience and SEO
 Strong experience with CSS and preprocessors (e.g., SASS/SCSS).
 Experience integrating with APIs, including REST and ideally GraphQL (Apollo or similar).
 Solid understanding of accessibility, performance optimization, and responsive design.
 Proficiency with tools and processes such as Git, CI/CD pipelines, unit/integration testing, and code reviews.
 Strong collaboration skills and the ability to work cross-functionally in a remote setup.
 Excellent communication skills—able to explain ideas and decisions clearly to various stakeholders.

WHAT EXPERTISE ARE GOOD TO HAVE?

 Experience with frontend observability tools (e.g., Sentry, LogRocket, etc.)
 Experience working on travel platforms or B2C consumer products
 Contributions to design systems or frontend infrastructure
 Familiarity with headless CMS integrations or e-commerce platforms

OUR TECH STACK (WEB)

Languages / Frameworks: Next.js , TypeScript, React.js , Apollo GraphQL, SASS (or similar), Node.js (for SSR/edge logic)

Other Tools: Jest, React Testing Library, GitHub Actions, Storybook, Vercel, Figma, Sentry
`,
      jobTitle: "Remote Frontend Engineer",
      companyName: "Pelago",
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
      console.log("Generated resume suggestions:", result.profile.projects);
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
