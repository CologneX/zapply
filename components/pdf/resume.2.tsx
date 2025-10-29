import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { ClientCreateProfileType } from "@/types/profile.types";
import { parseHtmlToText, parseHtmlToLines } from "@/lib/html-to-pdf";
import { formatMonth } from "@/lib/utils";

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

export default function ResumePDF2({
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
    return isCurrent ? "Present" : formatMonth(d);
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
      subject={`Resume for ${jobTitle}${
        companyName ? ` at ${companyName}` : ""
      }`}
      author={profile.name}
      keywords={`resume, ${jobTitle}, ${profile.name}`}
    >
      <Page size="A4" style={tw("p-16 bg-white text-black font-serif")}>
        {/* Header - Name */}
        <View style={tw("mb-4 text-center")}>
          <Text style={tw("text-xl font-bold uppercase tracking-wide")}>
            {profile.name}
          </Text>
        </View>

        {/* Contact Information - Centered */}
        <View style={tw("mb-4 text-center")}>
          <View style={tw("flex flex-row justify-center gap-2 text-xs")}>
            {profile.email && <Text>{profile.email}</Text>}
            {profile.mobile && profile.email && <Text>|</Text>}
            {profile.mobile && <Text>{profile.mobile}</Text>}
            {profile.location && (profile.mobile || profile.email) && (
              <Text>|</Text>
            )}
            {profile.location && <Text>{profile.location}</Text>}
          </View>
          {profile.socials && profile.socials.length > 0 && (
            <View style={tw("flex flex-row justify-center gap-2 text-xs mt-1")}>
              {profile.socials.map((social, idx) => (
                <View key={idx} style={tw("flex flex-row gap-2")}>
                  {idx > 0 && <Text>|</Text>}
                  <Text>{social.url}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Horizontal line separator */}
        <View style={tw("w-full h-px bg-black mb-4")} />

        {/* Headline/Professional Title */}
        {profile.headline && (
          <View style={tw("mb-4 text-center")}>
            <Text style={tw("text-sm font-bold")}>{profile.headline}</Text>
          </View>
        )}

        {/* Professional Summary */}
        {profile.description && (
          <View style={tw("mb-4")}>
            <Text
              style={tw(
                "text-xs font-bold uppercase mb-2 border-b-2 border-black pb-1"
              )}
            >
              Professional Summary
            </Text>
            <Text style={tw("text-xs leading-relaxed text-justify")}>
              {parseHtmlToText(profile.description)}
            </Text>
          </View>
        )}

        {/* Work Experience Section */}
        {profile.workExperiences && profile.workExperiences.length > 0 && (
          <View style={tw("mb-4")}>
            <Text
              style={tw(
                "text-xs font-bold uppercase mb-2 border-b-2 border-black pb-1"
              )}
            >
              Professional Experience
            </Text>

            {profile.workExperiences.map((exp, index) => (
              <View key={index} style={tw("mb-3")}>
                {/* Job Title - Bold */}
                <Text style={tw("text-xs font-bold")}>{exp.name}</Text>

                {/* Company, Location, and Dates */}
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-xs")}>
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </Text>
                  <Text style={tw("text-xs")}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </Text>
                </View>

                {/* Job Type */}
                {exp.type && (
                  <Text style={tw("text-xs italic mb-1")}>{exp.type}</Text>
                )}

                {/* Description as bullet points */}
                {exp.description && (
                  <View style={tw("mt-1")}>
                    {parseHtmlToLines(exp.description).map(
                      (line, idx) =>
                        line.trim() && (
                          <View key={idx} style={tw("flex flex-row")}>
                            <Text style={tw("text-xs ml-2 mr-1")}>•</Text>
                            <Text style={tw("text-xs leading-relaxed flex-1")}>
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
          <View style={tw("mb-4")}>
            <Text
              style={tw(
                "text-xs font-bold uppercase mb-2 border-b-2 border-black pb-1"
              )}
            >
              Education
            </Text>

            {profile.educations.map((edu, index) => (
              <View key={index} style={tw("mb-2")}>
                {/* Degree and Field */}
                <Text style={tw("text-xs font-bold")}>
                  {edu.degree} in {edu.name}
                </Text>

                {/* Institution, Location, and Dates */}
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-xs")}>
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </Text>
                  <Text style={tw("text-xs")}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects Section */}
        {profile.projects && profile.projects.length > 0 && (
          <View style={tw("mb-4")}>
            <Text
              style={tw(
                "text-xs font-bold uppercase mb-2 border-b-2 border-black pb-1"
              )}
            >
              Projects
            </Text>

            {profile.projects.map((proj, index) => (
              <View key={index} style={tw("mb-3")}>
                {/* Project Name and Date */}
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-xs font-bold")}>{proj.name}</Text>
                  <Text style={tw("text-xs")}>
                    {formatDate(proj.startedAt)}
                  </Text>
                </View>

                {/* Skills/Technologies */}
                {proj.skills && proj.skills.length > 0 && (
                  <Text style={tw("text-xs italic mb-1")}>
                    Technologies: {proj.skills.join(", ")}
                  </Text>
                )}

                {/* URLs */}
                {(proj.repositoryUrl || proj.liveUrl) && (
                  <Text style={tw("text-xs mb-1")}>
                    {proj.repositoryUrl && `Repository: ${proj.repositoryUrl}`}
                    {proj.repositoryUrl && proj.liveUrl && " | "}
                    {proj.liveUrl && `Live: ${proj.liveUrl}`}
                  </Text>
                )}

                {/* Description */}
                {proj.description && (
                  <View style={tw("mt-1")}>
                    {parseHtmlToLines(proj.description).map(
                      (line, idx) =>
                        line.trim() && (
                          <View key={idx} style={tw("flex flex-row")}>
                            <Text style={tw("text-xs ml-2 mr-1")}>•</Text>
                            <Text style={tw("text-xs leading-relaxed flex-1")}>
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

        {/* Certifications Section */}
        {profile.certifications && profile.certifications.length > 0 && (
          <View style={tw("mb-4")}>
            <Text
              style={tw(
                "text-xs font-bold uppercase mb-2 border-b-2 border-black pb-1"
              )}
            >
              Certifications
            </Text>

            {profile.certifications.map((cert, index) => (
              <View key={index} style={tw("mb-2")}>
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-xs font-bold")}>{cert.name}</Text>
                  <Text style={tw("text-xs")}>
                    {formatDate(cert.startDate)}
                  </Text>
                </View>
                <Text style={tw("text-xs")}>
                  {cert.issuer}
                  {cert.credentialId &&
                    ` - Credential ID: ${cert.credentialId}`}
                </Text>
                {cert.url && <Text style={tw("text-xs")}>{cert.url}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Awards and Honors Section */}
        {profile.awardOrHonors && profile.awardOrHonors.length > 0 && (
          <View style={tw("mb-4")}>
            <Text
              style={tw(
                "text-xs font-bold uppercase mb-2 border-b-2 border-black pb-1"
              )}
            >
              Awards & Honors
            </Text>

            {profile.awardOrHonors.map((award, index) => (
              <View key={index} style={tw("mb-2")}>
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-xs font-bold")}>{award.name}</Text>
                  <Text style={tw("text-xs")}>{formatDate(award.date)}</Text>
                </View>
                <Text style={tw("text-xs")}>{award.institution}</Text>
                {award.description && (
                  <Text style={tw("text-xs leading-relaxed mt-1")}>
                    {parseHtmlToText(award.description)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Publications Section */}
        {profile.publications && profile.publications.length > 0 && (
          <View style={tw("mb-4")}>
            <Text
              style={tw(
                "text-xs font-bold uppercase mb-2 border-b-2 border-black pb-1"
              )}
            >
              Publications
            </Text>

            {profile.publications.map((pub, index) => (
              <View key={index} style={tw("mb-2")}>
                <View style={tw("flex flex-row justify-between")}>
                  <Text style={tw("text-xs font-bold")}>{pub.title}</Text>
                  <Text style={tw("text-xs")}>{formatDate(pub.date)}</Text>
                </View>
                {pub.url && <Text style={tw("text-xs")}>{pub.url}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Languages Section */}
        {profile.languages && profile.languages.length > 0 && (
          <View style={tw("mb-4")}>
            <Text
              style={tw(
                "text-xs font-bold uppercase mb-2 border-b-2 border-black pb-1"
              )}
            >
              Languages
            </Text>
            <View style={tw("flex flex-row flex-wrap gap-x-4")}>
              {profile.languages.map((lang, index) => (
                <Text key={index} style={tw("text-xs")}>
                  {lang.name}: {lang.proficiency}
                  {lang.level && ` (${lang.level})`}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
