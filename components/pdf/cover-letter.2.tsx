import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { CoverLetterType } from "@/types/cover-letter.types";
import { parseHTMLParagraphs } from "@/lib/utils";

const tw = createTw({
  fontFamily: {
    serif: ["Times-Roman"],
  },
  colors: {
    black: "#000000",
    gray: {
      800: "#1f2937",
      700: "#374151",
      600: "#4b5563",
    },
  },
});

export function CoverLetterPDF2({
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
      author={userName}
      keywords={`cover letter, ${coverLetter.jobTitle}, ${coverLetter.companyName}, ${userName}`}
    >
      <Page size="A4" style={tw("p-16 bg-white text-black font-serif")}>
        {/* Header - Name */}
        <View style={tw("mb-4 text-center")}>
          <Text style={tw("text-xl font-bold uppercase tracking-wide")}>
            {userName}
          </Text>
        </View>

        {/* Contact Information - Centered */}
        <View style={tw("mb-6 text-center")}>
          <View style={tw("flex flex-row justify-center gap-2 text-xs")}>
            {userEmail && <Text>{userEmail}</Text>}
            {userPhone && userEmail && <Text>|</Text>}
            {userPhone && <Text>{userPhone}</Text>}
            {userLocation && (userPhone || userEmail) && <Text>|</Text>}
            {userLocation && <Text>{userLocation}</Text>}
          </View>
        </View>

        {/* Horizontal line separator */}
        <View style={tw("w-full h-px bg-black mb-6")} />

        {/* Date
        <View style={tw("mb-6")}>
          <Text style={tw("text-xs")}>{dateString}</Text>
        </View> */}

        {/* Cover Letter Body */}
        <View style={tw("mb-6")}>
          {parseHTMLParagraphs(coverLetter.content).map((paragraph, index) => (
            <Text
              key={index}
              style={tw("text-xs leading-relaxed text-justify mb-3")}
            >
              {paragraph}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
