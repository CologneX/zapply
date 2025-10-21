import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  AwardIcon,
  BookOpenIcon,
  LanguagesIcon,
  LinkIcon,
  ExternalLinkIcon,
} from "lucide-react";
import {
  ProfileType,
  WorkExperienceType,
  EducationType,
  CertificationType,
  AwardOrHonorType,
  PublicationType,
  LanguageType,
  SocialType,
} from "@/types/profile.types";
import { formatMonth } from "@/lib/utils";

interface ProfileDisplayProps {
  profile: ProfileType;
}

function HeaderSection({ profile }: { profile: ProfileType }) {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{profile.name || "N/A"}</h2>
            <p className="text-xl text-muted-foreground">
              {profile.headline || "Professional"}
            </p>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            {profile.description || "No description provided"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.email && (
            <div className="flex items-center gap-2">
              <MailIcon className="h-5 w-5 text-muted-foreground" />
              <a
                href={`mailto:${profile.email}`}
                className="text-sm hover:underline"
              >
                {profile.email}
              </a>
            </div>
          )}

          {profile.mobile && (
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-muted-foreground" />
              <a
                href={`tel:${profile.mobile}`}
                className="text-sm hover:underline"
              >
                {profile.mobile}
              </a>
            </div>
          )}

          {profile.location && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WorkExperienceSection({
  experiences,
}: {
  experiences: WorkExperienceType[];
}) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-5 w-5" />
          <CardTitle>Work Experience</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="border-l-2 border-muted pl-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-lg">{exp.name}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
                {exp.type && (
                  <Badge variant="secondary" className="whitespace-nowrap">
                    {exp.type}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {exp.startDate && (
                  <>
                    <span>{formatMonth(new Date(exp.startDate))}</span>
                    {exp.isCurrent ? (
                      <span>— Present</span>
                    ) : exp.endDate ? (
                      <>
                        <span>—</span>
                        <span>{formatMonth(new Date(exp.endDate))}</span>
                      </>
                    ) : null}
                  </>
                )}
              </div>

              {exp.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{exp.location}</span>
                </div>
              )}

              {exp.description && (
                <p className="text-sm leading-relaxed">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EducationSection({ educations }: { educations: EducationType[] }) {
  if (!educations || educations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCapIcon className="h-5 w-5" />
          <CardTitle>Education</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {educations.map((edu, index) => (
            <div key={index} className="border-l-2 border-muted pl-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-lg">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {edu.startDate && (
                  <>
                    <span>{formatMonth(new Date(edu.startDate))}</span>
                    {edu.isCurrent ? (
                      <span>— Present</span>
                    ) : edu.endDate ? (
                      <>
                        <span>—</span>
                        <span>{formatMonth(new Date(edu.endDate))}</span>
                      </>
                    ) : null}
                  </>
                )}
              </div>

              {edu.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{edu.location}</span>
                </div>
              )}

              {edu.name && (
                <p className="text-sm text-muted-foreground">
                  Field: <span className="text-foreground">{edu.name}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CertificationsSection({
  certifications,
}: {
  certifications: CertificationType[];
}) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AwardIcon className="h-5 w-5" />
          <CardTitle>Certifications</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                {cert.startDate && (
                  <span>{formatMonth(new Date(cert.startDate))}</span>
                )}
              </div>

              {cert.credentialId && (
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {cert.credentialId}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AwardsSection({ awards }: { awards: AwardOrHonorType[] }) {
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AwardIcon className="h-5 w-5" />
          <CardTitle>Awards & Honors</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {awards.map((award, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold">{award.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {award.institution}
                  </p>
                </div>
                {award.url && (
                  <a
                    href={award.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                )}
              </div>

              {award.date && (
                <p className="text-sm text-muted-foreground mt-2">
                  {formatMonth(new Date(award.date))}
                </p>
              )}

              {award.description && (
                <p className="text-sm mt-2">{award.description}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PublicationsSection({
  publications,
}: {
  publications: PublicationType[];
}) {
  if (!publications || publications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5" />
          <CardTitle>Publications</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold">{pub.title}</h3>
                </div>
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                )}
              </div>

              {pub.date && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formatMonth(new Date(pub.date))}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LanguagesSection({ languages }: { languages: LanguageType[] }) {
  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <LanguagesIcon className="h-5 w-5" />
          <CardTitle>Languages</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((lang, index) => (
            <div key={index} className="space-y-1">
              <h3 className="font-semibold">{lang.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{lang.proficiency}</Badge>
                {lang.level && <Badge variant="secondary">{lang.level}</Badge>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SocialsSection({ socials }: { socials: SocialType[] }) {
  if (!socials || socials.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          <CardTitle>Social Links</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              <span className="text-sm hover:underline">{social.name}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileDisplay({ profile }: ProfileDisplayProps) {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <HeaderSection profile={profile} />
      <WorkExperienceSection experiences={profile.workExperiences || []} />
      <EducationSection educations={profile.educations || []} />
      <CertificationsSection certifications={profile.certifications || []} />
      <AwardsSection awards={profile.awardOrHonors || []} />
      <PublicationsSection publications={profile.publications || []} />
      <LanguagesSection languages={profile.languages || []} />
      <SocialsSection socials={profile.socials || []} />
    </div>
  );
}
