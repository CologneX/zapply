import { queryClientOptions } from "@/lib/query-client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProfileSchema } from "@/types/profile.types";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { ErrorPageWrapper } from "@/components/common/errors";
import ProfileForm from "./_components/form";

export default async function ProfilePage() {
  const queryClient = new QueryClient(queryClientOptions);
  try {
    await queryClient.fetchQuery({
      queryKey: ["profile"],
      queryFn: async () => {
        const session = await auth.api.getSession({
          headers: await headers(),
        });
        if (!session?.user) {
          return { error: "Unauthorized" };
        }
        const rawprofile = await db.collection("profiles").findOne({
          user_id: new ObjectId(session.user.id),
          deletedAt: null,
        });

        const profile = ProfileSchema.safeParse(rawprofile);
        if (!profile.success) {
          console.error("Profile validation failed:", profile.error);
          throw new Error("Profile data is corrupted");
        }
        return profile.data;
      },
    });
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div>
          {/* <h1>Profile Page</h1> */}
          <ProfileForm />
        </div>
      </HydrationBoundary>
    );
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
