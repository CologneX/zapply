"use client";

import { ClientCreateResumeType } from "@/types/resume.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatMonth } from "@/lib/utils";

interface ProfilePreviewProps {
  profile: ClientCreateResumeType;
}

export function ProfilePreview({ profile }: ProfilePreviewProps) {
  return (
    <Card className="bg-card">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Profile Preview</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6 max-h-[600px] overflow-y-auto">
        {/* Basic Info */}
        <section>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{profile.name || "Your Name"}</h3>
            {profile.headline && (
              <p className="text-sm text-muted-foreground">
                {profile.headline}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {profile.email && <span>📧 {profile.email}</span>}
              {profile.mobile && <span>📱 {profile.mobile}</span>}
              {profile.location && <span>📍 {profile.location}</span>}
            </div>
          </div>
        </section>

        {profile.description && (
          <>
            <Separator />
            <section>
              <h4 className="text-sm font-semibold mb-2">About</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {profile.description}
              </p>
            </section>
          </>
        )}

        {/* Work Experience */}
        {profile.workExperiences && profile.workExperiences.length > 0 && (
          <>
            <Separator />
            <section>
              <h4 className="text-sm font-semibold mb-3">Work Experience</h4>
              <div className="space-y-3">
                {profile.workExperiences.slice(0, 2).map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{exp.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.company}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatMonth(exp.startDate)} -{" "}
                        {exp.isCurrent
                          ? "Present"
                          : exp.endDate
                          ? formatMonth(exp.endDate)
                          : "N/A"}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
                {profile.workExperiences.length > 2 && (
                  <p className="text-xs text-muted-foreground italic">
                    +{profile.workExperiences.length - 2} more experience(s)
                  </p>
                )}
              </div>
            </section>
          </>
        )}

        {/* Education */}
        {profile.educations && profile.educations.length > 0 && (
          <>
            <Separator />
            <section>
              <h4 className="text-sm font-semibold mb-3">Education</h4>
              <div className="space-y-3">
                {profile.educations.slice(0, 2).map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{edu.degree}</p>
                        <p className="text-xs text-muted-foreground">
                          {edu.institution}
                          {edu.location && ` • ${edu.location}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatMonth(edu.startDate)} -{" "}
                        {edu.isCurrent
                          ? "Present"
                          : edu.endDate
                          ? formatMonth(edu.endDate)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
                {profile.educations.length > 2 && (
                  <p className="text-xs text-muted-foreground italic">
                    +{profile.educations.length - 2} more education(s)
                  </p>
                )}
              </div>
            </section>
          </>
        )}

        {/* Certifications */}
        {profile.certifications && profile.certifications.length > 0 && (
          <>
            <Separator />
            <section>
              <h4 className="text-sm font-semibold mb-2">Certifications</h4>
              <div className="space-y-1">
                {profile.certifications.slice(0, 2).map((cert, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-muted-foreground">{cert.issuer}</p>
                  </div>
                ))}
                {profile.certifications.length > 2 && (
                  <p className="text-xs text-muted-foreground italic">
                    +{profile.certifications.length - 2} more certification(s)
                  </p>
                )}
              </div>
            </section>
          </>
        )}

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <>
            <Separator />
            <section>
              <h4 className="text-sm font-semibold mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {lang.name} ({lang.proficiency})
                  </Badge>
                ))}
              </div>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}
