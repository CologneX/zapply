"use client";

import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { CoverLetterType } from "@/types/cover-letter.types";

const tw = createTw({
  fontFamily: {
    sans: ["Helvetica"],
  },
  colors: {
    slate: {
      900: "#0f172a",
      700: "#374151",
      600: "#4b5563",
      500: "#6b7280",
      400: "#9ca3af",
      100: "#f1f5f9",
    },
    blue: {
      600: "#2563eb",
      50: "#eff6ff",
    },
  },
  spacing: {
    xs: "6pt",
    sm: "12pt",
    md: "16pt",
    lg: "24pt",
    xl: "32pt",
  },
});

interface CoverLetterPDFProps {
  coverLetter: CoverLetterType;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  userLocation?: string;
}

export default function CoverLetterPDF1({
  coverLetter,
  userEmail = "contact@example.com",
  userName = "Your Name",
  userPhone = "+1 (555) 000-0000",
  userLocation = "City, State",
}: CoverLetterPDFProps) {
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title={`Cover Letter - ${coverLetter.companyName}`}
      subject={`Cover Letter for ${coverLetter.jobTitle} at ${coverLetter.companyName}`}
    >
      <Page
        size="A4"
        style={tw("p-12 bg-white text-slate-900 font-sans leading-relaxed")}
      >
        {/* Header with Contact Info */}
        <View style={tw("mb-lg border-b border-slate-200 pb-md")}>
          <Text style={tw("text-2xl font-bold text-slate-900")}>
            {userName}
          </Text>
          <View style={tw("mt-xs flex flex-row gap-sm text-sm text-slate-600")}>
            <Text>{userEmail}</Text>
            <Text>•</Text>
            <Text>{userPhone}</Text>
            <Text>•</Text>
            <Text>{userLocation}</Text>
          </View>
        </View>

        {/* Date */}
        <View style={tw("mb-lg")}>
          <Text style={tw("text-sm text-slate-600")}>{dateString}</Text>
        </View>

        {/* Recipient Info */}
        <View style={tw("mb-lg")}>
          <Text style={tw("text-sm font-semibold text-slate-700")}>
            {coverLetter.companyName}
          </Text>
          <Text style={tw("text-sm text-slate-600")}>
            Hiring Manager
          </Text>
        </View>

        {/* Greeting */}
        <View style={tw("mb-md")}>
          <Text style={tw("text-sm text-slate-700")}>Dear Hiring Team,</Text>
        </View>

        {/* Cover Letter Content */}
        <View style={tw("mb-lg space-y-md")}>
          {coverLetter.content.split("\n\n").map((paragraph, index) => (
            <Text
              key={index}
              style={tw("text-sm leading-relaxed text-slate-700 mb-md")}
            >
              {paragraph.trim()}
            </Text>
          ))}
        </View>

        {/* Closing */}
        <View style={tw("mt-lg")}>
          <Text style={tw("text-sm text-slate-700")}>Sincerely,</Text>
          <View style={tw("mt-lg")}>
            <Text style={tw("text-sm font-semibold text-slate-900")}>
              {userName}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View
          fixed
          style={tw("absolute bottom-md left-md right-md text-center")}
        >
          <Text
            style={tw(
              "text-xs text-slate-400 border-t border-slate-200 pt-sm"
            )}
          >
            {userEmail} • {userPhone}
          </Text>
        </View>
      </Page>
    </Document>
  );
}