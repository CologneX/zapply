import type { Metadata } from "next";
import { ErrorPageWrapper } from "@/components/common/errors";
import { db } from "@/lib/db";
import { ProfileSchema } from "@/types/profile.types";
import { ProfileDisplay } from "./display";

type Params = Promise<{ username: string }>;

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const { username } = await params;

    if (!username) {
      return {
        title: "User Profile - Zapply",
        description: "View user profile on Zapply",
      };
    }

    // Find user by username
    const user = await db.collection("user").findOne({
      username: username,
    });

    if (!user) {
      return {
        title: "Profile Not Found - Zapply",
        description: "The requested user profile could not be found",
      };
    }

    const profileRaw = await db.collection("profiles").findOne({
      user_id: user._id,
      deletedAt: null,
    });

    const profile = ProfileSchema.safeParse(profileRaw);

    if (!profile || !profile.success) {
      return {
        title: "Profile Not Found - Zapply",
        description: "The requested user profile could not be found",
      };
    }

    const profileData = profile.data;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zapply.io";
    const profileUrl = `${baseUrl}/u/${username}`;

    // Extract skills for keywords
    const skills = profileData?.skills || [];
    const keywords = [
      profileData?.name,
      profileData?.headline,
      ...skills,
      "resume",
      "cv",
      "profile",
    ].filter(Boolean);

    // Create a compelling description
    const description =
      profileData?.description && profileData.description.length > 0
        ? profileData.description
            .replace(/<[^>]*>/g, "") // Remove HTML tags
            .substring(0, 160) // Limit to 160 chars for meta description
        : `${profileData?.name} - ${profileData?.headline || "Professional Profile"}`;

    return {
      title: `${profileData?.name} - ${profileData?.headline} | Zapply`,
      description,
      keywords: keywords.join(", "),
      authors: [{ name: profileData?.name }],
      openGraph: {
        title: `${profileData?.name} - ${profileData?.headline}`,
        description: description.substring(0, 160),
        url: profileUrl,
        type: "website",
        siteName: "Zapply",
      },
      twitter: {
        card: "summary",
        title: `${profileData?.name} - ${profileData?.headline}`,
        description: description.substring(0, 160),
      },
      alternates: {
        canonical: profileUrl,
      },
    };
  } catch {
    return {
      title: "User Profile - Zapply",
      description: "View user profile on Zapply",
    };
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: Params;
}) {
  try {
    const { username } = await params;
    if (!username) {
      return (
        <ErrorPageWrapper>
          <h2 className="text-center">Where is the username?</h2>
        </ErrorPageWrapper>
      );
    }

    // Find user by username
    const user = await db.collection("user").findOne({
      username: username,
    });

    if (!user) {
      return (
        <ErrorPageWrapper>
          <h2 className="text-center">
            Whoops, this profile doesn&apos;t exist
          </h2>
        </ErrorPageWrapper>
      );
    }

    const profileRaw = await db.collection("profiles").findOne({
      user_id: user._id,
      deletedAt: null,
    });

    const profile = ProfileSchema.safeParse(profileRaw);

    if (!profile || !profile.success) {
      return (
        <ErrorPageWrapper>
          <h2 className="text-center">
            Whoops, this profile doesn&apos;t exist
          </h2>
        </ErrorPageWrapper>
      );
    }

    return <ProfileDisplay profile={profile.data} />;
  } catch (err) {
    const error = err as Error;
    return (
      <ErrorPageWrapper>
        <h2 className="text-center">Something went wrong</h2>
        <p className="text-sm text-center text-muted-foreground">
          {error.message}
        </p>
      </ErrorPageWrapper>
    );
  }
}
