import CoverLetterForm from "./_components/form";

export default function CoverLetterPage() {
  return (
    <div className="flex flex-col gap-8 px-4 mx-auto container py-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Cover Letter</h1>
        <p className="text-muted-foreground">
          Create personalized cover letters tailored to specific job
          descriptions
        </p>
      </div>
      <CoverLetterForm />
    </div>
  );
}
