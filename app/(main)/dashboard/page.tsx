import { ErrorPageWrapper } from "@/components/common/errors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CoverLetterSchema } from "@/types/cover-letter.types";
import { ResumeSchema } from "@/types/resume.types";
import { headers } from "next/headers";
import { HeroButtonsSection } from "@/app/(main)/dashboard/_components/hero-buttons";
import { DashboardSection } from "@/app/(main)/dashboard/_components/dashboard-section";
import { ScrollContainer } from "@/app/(main)/dashboard/_components/scroll-container";
import { CoverLetterCard } from "@/app/(main)/dashboard/_components/cover-letter-card";
import { ResumeCard } from "@/app/(main)/dashboard/_components/resume-card";
import { ObjectId } from "mongodb";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <ErrorPageWrapper>
        <h2 className="text-center">Unauthorized</h2>
      </ErrorPageWrapper>
    );
  }

  // Fetch cover letters
  const coverLettersRaw = await db
    .collection("coverLetters")
    .find({
      user_id: new ObjectId(session.user.id),
      deletedAt: null,
    })
    .toArray();
  const coverLettersResult =
    CoverLetterSchema.array().safeParse(coverLettersRaw);

  if (!coverLettersResult.success) {
    return (
      <ErrorPageWrapper>
        <h2 className="text-center">Failed to load cover letters</h2>
      </ErrorPageWrapper>
    );
  }

  const coverLetters = coverLettersResult.data;

  // Fetch resumes
  const resumesRaw = await db
    .collection("resumes")
    .find({
      user_id: new ObjectId(session.user.id),
      deletedAt: null,
    })
    .toArray();

  const resumesResult = ResumeSchema.array().safeParse(resumesRaw);

  if (!resumesResult.success) {
    return (
      <ErrorPageWrapper>
        <h2 className="text-center">Failed to load resumes</h2>
      </ErrorPageWrapper>
    );
  }

  const resumes = resumesResult.data;

  return (
    <div className="flex flex-col gap-8 px-4 mx-auto container py-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your resumes and cover letters
        </p>
      </div>

      {/* Hero Buttons */}
      <HeroButtonsSection />

      {/* Cover Letters Section */}
      <DashboardSection
        title="Your Cover Letters"
        isEmpty={coverLetters.length === 0}
        emptyMessage="No cover letters yet. Create one to get started!"
      >
        <ScrollContainer containerClassName="relative">
          {coverLetters.map((coverLetter) => (
            <CoverLetterCard
              key={coverLetter._id}
              coverLetter={coverLetter}
              // onEdit={(id) => console.log("Edit cover letter:", id)}
              // onView={(id) => console.log("View cover letter:", id)}
              // onDelete={(id) => console.log("Delete cover letter:", id)}
            />
          ))}
        </ScrollContainer>
      </DashboardSection>

      {/* Resumes Section */}
      <DashboardSection
        title="Your Resumes"
        isEmpty={resumes.length === 0}
        emptyMessage="No resumes yet. Create one to get started!"
      >
        <ScrollContainer containerClassName="relative">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              // onEdit={(id) => console.log("Edit resume:", id)}
              // onView={(id) => console.log("View resume:", id)}
              // onDelete={(id) => console.log("Delete resume:", id)}
            />
          ))}
        </ScrollContainer>
      </DashboardSection>
    </div>
  );
}
