"use server";
import { CoverLetterPDF1 } from "@/components/pdf/cover-letter.1";
import { CoverLetterPDF2 } from "@/components/pdf/cover-letter.2";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CoverLetterSchema } from "@/types/cover-letter.types";
import { ProfileSchema } from "@/types/profile.types";
import { pdf } from "@react-pdf/renderer";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    // console.log("Generating PDF for cover letter ID:", itemId);
    const profileRaw = await db.collection("profiles").findOne({
      user_id: new ObjectId(session.user.id),
      deletedAt: null,
    });
    if (!profileRaw) {
      return new Response("Profile not found. Please create a profile first.", {
        status: 404,
      });
    }

    const profile = ProfileSchema.safeParse(profileRaw);
    if (!profile.success) {
      console.error("Profile validation error:", profile.error);
      return new Response("Invalid profile data", { status: 500 });
    }

    const coverLetterRaw = await db.collection("coverLetters").findOne({
      user_id: new ObjectId(session.user.id),
      _id: new ObjectId(id),
      deletedAt: null,
    });

    const coverLetter = CoverLetterSchema.safeParse(coverLetterRaw);
    if (!coverLetter.success) {
      console.error("Cover Letter validation error:", coverLetter.error);
      return new Response("Invalid cover letter data", { status: 500 });
    }

    if (!profile.data || !coverLetter.data) {
      return new Response("Invalid data", { status: 500 });
    }

    // Render PDF logic
    const document = await pdf(
      <CoverLetterPDF2
        userEmail={profile.data.email}
        userName={profile.data.name}
        userLocation={profile.data.location}
        userPhone={profile.data.mobile}
        {...{
          coverLetter: coverLetter.data,
        }}
      />
    ).toBlob();

    return new Response(document, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Cover_Letter-${coverLetter.data.companyName}_${profile.data?.name}.pdf"`,
      },
    });
  } catch (error) {
    console.error("GenerateCoverLetterPDFRoute error:", error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
