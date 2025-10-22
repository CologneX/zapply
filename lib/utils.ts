import { ProfileType } from "@/types/profile.types";
import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Wraps a Next.js Server Action promise.
 * It inspects the result and throws a client-side error if the action
 * returned an object with an `error` property.
 * This allows React Query's `error` state and `onError` callback to be triggered.
 * @param actionPromise The promise returned by calling a server action.
 * @returns The successful result of the server action.
 * @throws {Error} Throws an error with the message provided by the server action.
 */
export const ActionErrorWrapper = async <T>(
  actionPromise: Promise<(T & { error?: string; }) | void>
): Promise<T | void> => {
  const result = await actionPromise;

  if (result?.error) {
    throw new Error(result.error);
  }

  return result;
};

// export const downloadPDF = (pdfData: Uint8Array, fileName: string) => {
//   const blob = new Blob([pdfData], { type: "application/pdf" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = fileName;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// }

export function transformProfileDates(profile: ProfileType) {
  return {
    ...profile,
    createdAt: profile?.createdAt ? new Date(profile.createdAt) : undefined,
    updatedAt: profile?.updatedAt ? new Date(profile.updatedAt) : undefined,
    workExperiences: profile?.workExperiences?.map((exp) => ({
      ...exp,
      startDate: new Date(exp.startDate),
      endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    })),
    educations: profile?.educations?.map((edu) => ({
      ...edu,
      startDate: new Date(edu.startDate),
      endDate: edu.endDate ? new Date(edu.endDate) : undefined,
    })),
    certifications: profile?.certifications?.map((cert) => ({
      ...cert,
      startDate: new Date(cert.startDate),
      endDate: cert.endDate ? new Date(cert.endDate) : undefined,
    })),
    awardOrHonors: profile?.awardOrHonors?.map((award) => ({
      ...award,
      date: new Date(award.date),
    })),
    publications: profile?.publications?.map((pub) => ({
      ...pub,
      date: new Date(pub.date),
    })),
  };
}

export const formatMonth = (date?: Date) => {
  return date ? format(date, 'MMM yyyy') : '';
}