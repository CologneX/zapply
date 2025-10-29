import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { ClientCreateProfileType } from "@/types/profile.types";
import { format } from "date-fns";
import { parseHtmlToText, parseHtmlToLines } from "@/lib/html-to-pdf";

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
  },
  spacing: {
    xs: "4pt",
    sm: "8pt",
    md: "12pt",
    lg: "16pt",
    xl: "20pt",
  },
});

export function ResumePDf1({
  resume: profile,
  jobTitle,
  companyName,
}: {
  resume: ClientCreateProfileType;
  jobTitle: string;
  companyName?: string;
}) {
  const formatDate = (date: Date | string | undefined, isCurrent?: boolean) => {
    if (!date) return "";
    const d = new Date(date);
    return isCurrent ? "Present" : format(d, "MMM yyyy");
  };

  const formatDateRange = (
    startDate: Date | string | undefined,
    endDate: Date | string | undefined,
    isCurrent?: boolean
  ) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate, isCurrent);
    return `${start}${end ? ` - ${end}` : ""}`;
  };

  return (
    <Document
      title={`Resume - ${profile.name}`}
      subject={`Resume for ${jobTitle} at ${companyName}`}
    >
      <Page size="A4" style={tw("p-12 bg-white text-slate-900 font-sans")}>
        {/* Header - Name and Contact Info */}
        <View style={tw("mb-lg")}>
          <Text style={tw("text-2xl font-bold text-slate-900")}>
            {profile.name}
          </Text>

          {/* Contact Information */}
          <View style={tw("mt-sm")}>
            <View style={tw("flex flex-row gap-sm text-xs text-slate-600")}>
              {profile.email && <Text>{profile.email}</Text>}
              {profile.mobile && (
                <>
                  <Text>•</Text>
                  <Text>{profile.mobile}</Text>
                </>
              )}
              {profile.socials &&
                profile.socials.length > 0 &&
                profile.socials.map((s) => (
                  <>
                    <Text>•</Text>
                    <Text>{s.url}</Text>
                  </>
                ))}
              {profile.location && (
                <>
                  <Text>•</Text>
                  <Text>{profile.location}</Text>
                </>
              )}
            </View>
          </View>

          {/* Headline */}
          {profile.headline && (
            <Text style={tw("mt-sm text-sm font-semibold text-slate-700")}>
              {profile.headline}
            </Text>
          )}
        </View>

        {/* Professional Summary / Description */}
        {profile.description && (
          <View style={tw("mb-lg")}>
            <Text style={tw("text-sm font-bold text-slate-900 mb-sm")}>
              PROFESSIONAL SUMMARY
            </Text>
            <Text style={tw("text-xs leading-relaxed text-slate-700")}>
              {parseHtmlToText(profile.description)}
            </Text>
          </View>
        )}

        {/* Work Experience Section */}
        {profile.workExperiences && profile.workExperiences.length > 0 && (
          <View style={tw("mb-lg")}>
            <Text style={tw("text-sm font-bold text-slate-900 mb-sm")}>
              WORK EXPERIENCE
            </Text>

            {profile.workExperiences.map((exp, index) => (
              <View key={index} style={tw("mb-md")}>
                {/* Job Title and Company */}
                <View style={tw("flex flex-row justify-between mb-xs")}>
                  <Text style={tw("text-xs font-bold text-slate-900")}>
                    {exp.name}
                  </Text>
                  <Text style={tw("text-xs text-slate-600")}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </Text>
                </View>

                {/* Company and Location */}
                <View style={tw("flex flex-row justify-between mb-xs")}>
                  <Text style={tw("text-xs font-semibold text-slate-700")}>
                    {exp.company}
                  </Text>
                  {exp.location && (
                    <Text style={tw("text-xs text-slate-600")}>
                      {exp.location}
                    </Text>
                  )}
                </View>

                {/* Job Type */}
                {exp.type && (
                  <Text style={tw("text-xs text-slate-600 mb-xs")}>
                    {exp.type}
                  </Text>
                )}

                {/* Description as bullets */}
                {exp.description && (
                  <View style={tw("ml-md")}>
                    {parseHtmlToLines(exp.description).map(
                      (line, idx) =>
                        line.trim() && (
                          <View key={idx} style={tw("flex flex-row mb-xs")}>
                            <Text style={tw("text-xs text-slate-600 mr-sm")}>
                              •
                            </Text>
                            <Text
                              style={tw(
                                "text-xs leading-relaxed text-slate-700 flex-1"
                              )}
                            >
                              {line.trim()}
                            </Text>
                          </View>
                        )
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {profile.educations && profile.educations.length > 0 && (
          <View style={tw("mb-lg")}>
            <Text style={tw("text-sm font-bold text-slate-900 mb-sm")}>
              EDUCATION
            </Text>

            {profile.educations.map((edu, index) => (
              <View key={index} style={tw("mb-md")}>
                {/* Degree and Field */}
                <View style={tw("flex flex-row justify-between mb-xs")}>
                  <Text style={tw("text-xs font-bold text-slate-900")}>
                    {edu.degree} in {edu.name}
                  </Text>
                  <Text style={tw("text-xs text-slate-600")}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                  </Text>
                </View>

                {/* Institution and Location */}
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-xs font-semibold text-slate-700")}>
                    {edu.institution}
                  </Text>
                  {edu.location && (
                    <Text style={tw("text-xs text-slate-600")}>
                      {edu.location}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Certifications Section */}
        {profile.certifications && profile.certifications.length > 0 && (
          <View style={tw("mb-lg")}>
            <Text style={tw("text-sm font-bold text-slate-900 mb-sm")}>
              CERTIFICATIONS
            </Text>

            {profile.certifications.map((cert, index) => (
              <View key={index} style={tw("mb-xs")}>
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-xs font-semibold text-slate-900")}>
                    {cert.name}
                  </Text>
                  <Text style={tw("text-xs text-slate-600")}>
                    {formatDate(cert.startDate)}
                  </Text>
                </View>
                <Text style={tw("text-xs text-slate-700")}>
                  {cert.issuer}
                  {cert.credentialId && ` • ID: ${cert.credentialId}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages Section */}
        {profile.languages && profile.languages.length > 0 && (
          <View style={tw("mb-lg")}>
            <Text style={tw("text-sm font-bold text-slate-900 mb-sm")}>
              LANGUAGES
            </Text>

            {profile.languages.map((lang, index) => (
              <Text
                key={index}
                style={tw("text-xs leading-relaxed text-slate-700")}
              >
                {lang.name} - {lang.proficiency}
                {lang.level && ` (${lang.level})`}
              </Text>
            ))}
          </View>
        )}

        {/* Awards and Honors Section */}
        {profile.awardOrHonors && profile.awardOrHonors.length > 0 && (
          <View style={tw("mb-lg")}>
            <Text style={tw("text-sm font-bold text-slate-900 mb-sm")}>
              AWARDS & HONORS
            </Text>

            {profile.awardOrHonors.map((award, index) => (
              <View key={index} style={tw("mb-md")}>
                <View style={tw("flex flex-row justify-between mb-xs")}>
                  <Text style={tw("text-xs font-semibold text-slate-900")}>
                    {award.name}
                  </Text>
                  <Text style={tw("text-xs text-slate-600")}>
                    {formatDate(award.date)}
                  </Text>
                </View>
                <Text style={tw("text-xs text-slate-700")}>
                  {award.institution}
                </Text>
                {award.description && (
                  <Text style={tw("text-xs leading-relaxed text-slate-700")}>
                    {parseHtmlToText(award.description)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Publications Section */}
        {profile.publications && profile.publications.length > 0 && (
          <View style={tw("mb-lg")}>
            <Text style={tw("text-sm font-bold text-slate-900 mb-sm")}>
              PUBLICATIONS
            </Text>

            {profile.publications.map((pub, index) => (
              <View key={index} style={tw("mb-xs")}>
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-xs font-semibold text-slate-900")}>
                    {pub.title}
                  </Text>
                  <Text style={tw("text-xs text-slate-600")}>
                    {formatDate(pub.date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects Section */}
        {profile.projects && profile.projects.length > 0 && (
          <View style={tw("mb-lg")}>
            <Text style={tw("text-sm font-bold text-slate-900 mb-sm")}>
              PROJECTS
            </Text>

            {profile.projects.map((proj, index) => (
              <View key={index} style={tw("mb-md")}>
                <View style={tw("flex flex-row justify-between mb-xs")}>
                  <Text style={tw("text-xs font-semibold text-slate-900")}>
                    {proj.name}
                  </Text>
                  <Text style={tw("text-xs text-slate-600")}>
                    {formatDate(proj.startedAt)}
                  </Text>
                </View>

                {proj.skills && proj.skills.length > 0 && (
                  <Text style={tw("text-xs text-slate-600 mb-xs")}>
                    Skills: {proj.skills.join(", ")}
                  </Text>
                )}

                {proj.description && (
                  <View style={tw("ml-md")}>
                    {parseHtmlToLines(proj.description).map(
                      (line, idx) =>
                        line.trim() && (
                          <View key={idx} style={tw("flex flex-row mb-xs")}>
                            <Text style={tw("text-xs text-slate-600 mr-sm")}>
                              •
                            </Text>
                            <Text
                              style={tw(
                                "text-xs leading-relaxed text-slate-700 flex-1"
                              )}
                            >
                              {line.trim()}
                            </Text>
                          </View>
                        )
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
