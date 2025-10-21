import GenerateResumeForm from "./_components/form";

export default function GenerateResumePage() {
  return (
    <div className="flex flex-col gap-8 px-4 mx-auto container py-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Resume</h1>
        <p className="text-muted-foreground">
          Create personalized resumes tailored to specific job descriptions
        </p>
      </div>
      <GenerateResumeForm />
    </div>
  );
}
