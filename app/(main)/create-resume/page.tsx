import { Metadata } from "next";
import GenerateResumeForm from "./_components/form";

export const metadata: Metadata = {
  title: "Generate Resume | Zapply",
  description:
    "Create personalized resume tailored to specific job descriptions with AI assistance.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GenerateResumePage() {
  return (
    <div className="flex flex-col gap-8 px-4 mx-auto container py-8">
      <div>
        <h1 className="mb-2">Tailor Your Resume</h1>
        <p className="text-muted-foreground">
          Enter the job details to get AI-powered suggestions for your resume.
        </p>
      </div>
      <GenerateResumeForm />
    </div>
  );
}
