import { Badge } from "@/components/ui/badge";
import {
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  AwardIcon,
  BookOpenIcon,
  LanguagesIcon,
  ExternalLinkIcon,
  Code2Icon,
} from "lucide-react";
import {
  ProfileType,
  WorkExperienceType,
  EducationType,
  CertificationType,
  AwardOrHonorType,
  PublicationType,
  LanguageType,
  ProjectType,
} from "@/types/profile.types";
import { formatMonth } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

interface ProfileDisplayProps {
  profile: ProfileType;
}

function HeaderSection({ profile }: { profile: ProfileType }) {
  return (
    <div className="space-y-4">
      <div>
        <h1>{profile?.name || "N/A"}</h1>
        <p className="text-lg text-muted-foreground">
          {profile?.headline || "Professional"}
        </p>
      </div>

      <div
        className="text-sm leading-relaxed text-muted-foreground prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            profile?.description || "No description provided"
          ),
        }}
      />

      <div className="flex flex-wrap gap-3 pt-2">
        {profile?.email && (
          <Link
            href={`mailto:${profile?.email}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/20 px-3 py-1.5 text-xs hover:bg-muted/40 transition-colors"
          >
            <MailIcon className="size-4" />
            <span>{profile?.email}</span>
          </Link>
        )}

        {profile?.mobile && (
          <Link
            href={`tel:${profile?.mobile}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/20 px-3 py-1.5 text-xs hover:bg-muted/40 transition-colors"
          >
            <PhoneIcon className="size-4" />
            <span>{profile?.mobile}</span>
          </Link>
        )}

        {profile?.location && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/20 px-3 py-1.5 text-xs">
            <MapPinIcon className="size-4" />
            <span>{profile?.location}</span>
          </div>
        )}

        {profile?.socials &&
          profile.socials.length > 0 &&
          profile.socials.map((social, index) => (
            <Link
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/20 px-3 py-1.5 text-xs hover:bg-muted/40 transition-colors"
              title={social.name}
            >
              <ExternalLinkIcon className="size-4" />
              <span>{social.name}</span>
            </Link>
          ))}
      </div>
    </div>
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
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <BriefcaseIcon className="h-4 w-4" />
        <h3>Work Experience</h3>
      </div>
      <div className="space-y-2">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-muted/20 p-3 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h6>{exp.name}</h6>
                <p className="text-xs text-muted-foreground">{exp.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
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
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                <MapPinIcon className="h-3 w-3" />
                <span>{exp.location}</span>
              </div>
            )}

            {exp.description && (
              <div
                className="text-sm leading-relaxed text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(exp.description),
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ educations }: { educations: EducationType[] }) {
  if (!educations || educations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <GraduationCapIcon className="h-4 w-4" />
        <h3>Education</h3>
      </div>
      <div className="space-y-2">
        {educations.map((edu, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-muted/20 p-3 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h6>{edu.degree}</h6>
                <p className="text-xs text-muted-foreground">
                  {edu.institution}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
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
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                <MapPinIcon className="h-3 w-3" />
                <span>{edu.location}</span>
              </div>
            )}

            {edu.name && (
              <p className="text-xs text-muted-foreground">
                Field: <span className="text-foreground">{edu.name}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
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
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <AwardIcon className="h-4 w-4" />
        <h3>Certifications</h3>
      </div>
      <div className="space-y-2">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h6>{cert.name}</h6>
                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                  {cert.startDate && (
                    <span>{formatMonth(new Date(cert.startDate))}</span>
                  )}
                  {cert.credentialId && <span>• ID: {cert.credentialId}</span>}
                </div>
                {cert.url && (
                  <Link
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-block mt-1"
                  >
                    View Credential →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AwardsSection({ awards }: { awards: AwardOrHonorType[] }) {
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <AwardIcon className="h-4 w-4" />
        <h3>Awards & Honors</h3>
      </div>
      <div className="space-y-2">
        {awards.map((award, index) => (
          <div
            key={index}
            className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h6>{award.name}</h6>
                <p className="text-xs text-muted-foreground">
                  {award.institution}
                </p>
                {award.date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatMonth(new Date(award.date))}
                  </p>
                )}
                {award.description && (
                  <div
                    className="text-sm leading-relaxed text-muted-foreground prose prose-sm max-w-none mt-2"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(award.description),
                    }}
                  />
                )}
                {award.url && (
                  <Link
                    href={award.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-block mt-2"
                  >
                    View Award →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
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
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <BookOpenIcon className="h-4 w-4" />
        <h3>Publications</h3>
      </div>
      <div className="space-y-2">
        {publications.map((pub, index) => (
          <div
            key={index}
            className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h6>{pub.title}</h6>
                {pub.date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatMonth(new Date(pub.date))}
                  </p>
                )}
                {pub.url && (
                  <Link
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-block mt-1"
                  >
                    View Publication →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LanguagesSection({ languages }: { languages: LanguageType[] }) {
  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <LanguagesIcon className="h-4 w-4" />
        <h3>Languages</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-muted/20 p-3 hover:bg-muted/40 transition-colors"
          >
            <h6>{lang.name}</h6>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Badge variant="outline" className="text-xs">
                {lang.proficiency}
              </Badge>
              {lang.level && (
                <Badge variant="secondary" className="text-xs">
                  {lang.level}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ projects }: { projects: ProjectType[] }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Code2Icon className="h-4 w-4" />
        <h3>Projects</h3>
      </div>
      <div className="space-y-2">
        {projects.map((project, index) => (
          <div
            className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80 space-y-2"
            key={index}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h5>{project.name}</h5>
                {project.shortDescription && (
                  <p className="text-xs text-muted-foreground">
                    {project.shortDescription}
                  </p>
                )}
              </div>
            </div>
            {project.description && (
              <div
                className="text-sm leading-relaxed text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(project.description),
                }}
              />
            )}
            {project.technologies?.length ? (
              <div className="flex flex-wrap gap-1">
                {project.technologies?.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            ) : null}
            {project.role?.length ? (
              <div className="flex flex-wrap gap-1">
                {project.role?.map((r) => (
                  <Badge key={r} variant="outline" className="text-xs">
                    {r}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="flex items-center gap-2 pt-2">
              {project.repositoryUrl && (
                <Link
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary flex gap-1 items-center hover:underline"
                >
                  <ExternalLinkIcon className="h-3 w-3" />
                  <span>Repository Link</span>
                </Link>
              )}
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary flex gap-1 items-center hover:underline"
                >
                  <ExternalLinkIcon className="h-3 w-3" />{" "}
                  <span>Live Link</span>
                </Link>
              )}
            </div>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                {formatMonth(project.startedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProfileDisplay({ profile }: ProfileDisplayProps) {
  return (
    <div className="flex flex-col gap-8 px-4 mx-auto container py-8">
      <HeaderSection profile={profile} />
      <WorkExperienceSection experiences={profile?.workExperiences || []} />
      <EducationSection educations={profile?.educations || []} />
      <CertificationsSection certifications={profile?.certifications || []} />
      <AwardsSection awards={profile?.awardOrHonors || []} />
      <PublicationsSection publications={profile?.publications || []} />
      <LanguagesSection languages={profile?.languages || []} />
      <ProjectsSection projects={profile?.projects || []} />
    </div>
  );
}
