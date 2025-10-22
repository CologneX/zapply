import { ErrorPageWrapper } from "@/components/common/errors";
import { db } from "@/lib/db";
import { ProfileSchema } from "@/types/profile.types";
import { ProfileDisplay } from "./display";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
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
