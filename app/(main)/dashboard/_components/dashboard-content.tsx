"use client";

import { HeroButtonsSection } from "@/app/(main)/dashboard/_components/hero-buttons";
import { DashboardSection } from "@/app/(main)/dashboard/_components/dashboard-section";
import { ScrollContainer } from "@/app/(main)/dashboard/_components/scroll-container";
import { CoverLetterCard } from "@/app/(main)/dashboard/_components/cover-letter-card";
import { ResumeCard } from "@/app/(main)/dashboard/_components/resume-card";
import { useCoverLetterQuery } from "@/hooks/query/use-coverLetter";
import { useResumeQuery } from "@/hooks/query/use-resume";
import { useProfileQuery } from "@/hooks/query/use-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { searchItems } from "@/lib/utils";

export function DashboardContent() {
  const { data: coverLetters, isLoading: coverLettersLoading } =
    useCoverLetterQuery();
  const { data: resumes, isLoading: resumesLoading } = useResumeQuery();
  const { data: profile } = useProfileQuery();
  const [coverLetterSearch, setCoverLetterSearch] = useState("");
  const [resumeSearch, setResumeSearch] = useState("");

  const canCreateCoverLetterAndResume = !!(
    profile !== null &&
    profile?.name &&
    profile?.email &&
    profile?.description &&
    profile?.headline
  );

  // Efficiently filter cover letters based on search
  const filteredCoverLetters = useMemo(
    () =>
      searchItems(
        coverLetters || [],
        coverLetterSearch,
        ["jobTitle", "companyName"]
      ),
    [coverLetters, coverLetterSearch]
  );

  // Efficiently filter resumes based on search
  const filteredResumes = useMemo(
    () =>
      searchItems(resumes || [], resumeSearch, ["jobTitle", "companyName"]),
    [resumes, resumeSearch]
  );

  if (coverLettersLoading || resumesLoading) {
    return (
      <div className="flex flex-col gap-8 px-4 mx-auto container py-8">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your resumes and cover letters
          </p>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 mx-auto container py-8">
      {/* Page Title */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your resumes and cover letters
        </p>
      </div>

      {/* Hero Buttons */}
      <HeroButtonsSection
        canCreateCoverLetterAndResume={canCreateCoverLetterAndResume}
      />

      {/* Cover Letters Section */}
      <DashboardSection
        title="Your Cover Letters"
        searchValue={coverLetterSearch}
        onSearchChange={setCoverLetterSearch}
        isEmpty={!coverLetters || coverLetters.length === 0}
        isSearchEmpty={
          coverLetters && coverLetters.length > 0 && filteredCoverLetters.length === 0
        }
        emptyMessage="No cover letters yet. Create one to get started!"
      >
        <ScrollContainer containerClassName="relative">
          {filteredCoverLetters && filteredCoverLetters.length > 0 ? (
            filteredCoverLetters.map((coverLetter) => (
              <CoverLetterCard
                key={String(coverLetter._id)}
                coverLetter={coverLetter}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No cover letters available
            </div>
          )}
        </ScrollContainer>
      </DashboardSection>

      {/* Resumes Section */}
      <DashboardSection
        title="Your Resumes"
        searchValue={resumeSearch}
        onSearchChange={setResumeSearch}
        isEmpty={!resumes || resumes.length === 0}
        isSearchEmpty={
          resumes && resumes.length > 0 && filteredResumes.length === 0
        }
        emptyMessage="No resumes yet. Create one to get started!"
      >
        <ScrollContainer containerClassName="relative">
          {filteredResumes && filteredResumes.length > 0 ? (
            filteredResumes.map((resume) => (
              <ResumeCard key={String(resume._id)} resume={resume} />
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No resumes available
            </div>
          )}
        </ScrollContainer>
      </DashboardSection>
    </div>
  );
}
