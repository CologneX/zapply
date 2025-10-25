import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { CoverLetterType } from "@/types/cover-letter.types";
import { parseHTMLParagraphs } from "@/lib/utils";

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

export function CoverLetterPDF1({
  coverLetter,
  userEmail,
  userName,
  userPhone,
  userLocation,
}: {
  coverLetter: CoverLetterType;
  userEmail: string;
  userName: string;
  userPhone?: string;
  userLocation?: string;
}) {
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
            {userPhone && <Text>•</Text>}
            <Text>{userPhone}</Text>
            {userLocation && <Text>•</Text>}
            <Text>{userLocation}</Text>
          </View>
        </View>

        {/* Date */}
        <View style={tw("mb-lg")}>
          <Text style={tw("text-sm text-slate-600")}>{dateString}</Text>
        </View>

        {/* Cover Letter Content */}
        <View style={tw("mb-lg space-y-md")}>
          {parseHTMLParagraphs(coverLetter.content).map((paragraph, index) => (
            <Text
              key={index}
              style={tw("text-sm leading-relaxed text-slate-700 mb-md")}
            >
              {paragraph}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
