"use server";
import { ResumePDf1 } from "@/components/pdf/resume.1";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileSchema } from "@/types/profile.types";
import { ResumeSchema } from "@/types/resume.types";
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

    const resumeRaw = await db.collection("resumes").findOne({
      user_id: new ObjectId(session.user.id),
      _id: new ObjectId(id),
      deletedAt: null,
    });

    if (!resumeRaw) {
      return new Response("Resume not found.", { status: 404 });
    }

    const resume = ResumeSchema.safeParse(resumeRaw);
    if (!resume.success) {
      console.error("Resume validation error:", resume.error);
      return new Response("Invalid resume data", { status: 500 });
    }

    const document = await pdf(
      <ResumePDf1
        resume={resume.data.profile}
        jobTitle={resume.data.jobTitle}
        companyName={resume.data.companyName}
      />
    ).toBlob();

    return new Response(document, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Resume_${profile.data?.name}_${resume.data.jobTitle}.pdf"`,
      },
    });
  } catch (error) {
    console.error("GenerateCoverLetterPDFRoute error:", error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
