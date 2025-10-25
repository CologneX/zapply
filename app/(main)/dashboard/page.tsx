import { ErrorPageWrapper } from "@/components/common/errors";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DashboardContent } from "@/app/(main)/dashboard/_components/dashboard-content";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { CoverLetterKeys } from "@/types/query-keys/cover-letter.keys";
import { resumeKeys } from "@/types/query-keys/resume.keys";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { CoverLetterSchema } from "@/types/cover-letter.types";
import { ResumeSchema } from "@/types/resume.types";
import { ProfileSchema } from "@/types/profile.types";

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

  const userId = new ObjectId(session.user.id);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: resumeKeys.all,
    queryFn: async () => {
      // Fetch resumes
      const resumesRaw = await db
        .collection("resumes")
        .find({
          user_id: userId,
          deletedAt: null,
        })
        .toArray();

      const resumesResult = ResumeSchema.array().safeParse(resumesRaw);

      if (!resumesResult.success) {
        throw new Error("Failed to parse resumes data");
      }
      // Set resumes query data
      return resumesResult.data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: CoverLetterKeys.all,
    queryFn: async () => {
      // Fetch cover letters
      const coverLettersRaw = await db
        .collection("coverLetters")
        .find({
          user_id: userId,
          deletedAt: null,
        })
        .toArray();

      const coverLettersResult =
        CoverLetterSchema.array().safeParse(coverLettersRaw);

      if (!coverLettersResult.success) {
        console.error(
          "Cover letters validation failed:",
          coverLettersResult.error
        );
      }

      return coverLettersResult.data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profileRaw = await db.collection("profiles").findOne({
        user_id: userId,
        deletedAt: null,
      });

      const profileResult = ProfileSchema.safeParse(profileRaw);

      if (!profileResult.success) {
        throw new Error("Failed to parse profile data");
      }

      return profileResult.data;
    },
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardContent />
    </HydrationBoundary>
  );
}
