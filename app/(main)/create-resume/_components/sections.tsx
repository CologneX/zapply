"use client";

import { AppFormField } from "@/components/common/form";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DOMPurify from "isomorphic-dompurify";
import {
  ClientCreateWorkExperienceType,
  ClientCreateCertificationType,
  ClientCreateAwardOrHonorType,
  ClientCreatePublicationType,
  ClientCreateLanguageType,
  ClientCreateSocialType,
  ClientCreateProjectType,
} from "@/types/profile.types";
import React, { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { formatMonth } from "@/lib/utils";
import { SuggestionItemType } from "@/types/resume.types";
import {
  PenIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  ExternalLinkIcon,
  MoveDownIcon,
  InfoIcon,
} from "lucide-react";
import { FormField } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ClientCreateEducationType } from "@/types/profile.types";
import { closeDialog, openDialog } from "@/components/common/dialog";
import { motion, AnimatePresence } from "motion/react";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { MonthPicker } from "@/components/ui/month-picker";
import { ClientCreateResumeType } from "@/types/resume.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProgressRadial } from "@/components/ui/progress";
import { Popover } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function InfoSection({
  form,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
}) {
  return (
    <Card className="px-2 py-6 flex flex-col mb-4 max-h-36 sticky top-[calc(2rem+var(--header-height))] z-10">
      <section className="w-full grid"></section>
      <section className="flex flex-col md:flex-row gap-2 overflow-y-hidden">
        <div className="flex-1 flex-col">
          <div className="flex flex-col items-center">
            <ProgressRadial
              value={form.getValues("matchScore") || 0}
              size={120}
              startAngle={-180}
              endAngle={0}
              strokeWidth={10}
              indicatorClassName="text-primary"
              className="text-primary"
            >
              <div className="text-center">
                <div className="text-base font-bold">
                  {form.getValues("matchScore") || 0}%
                </div>
                <p className="text-sm text-muted-foreground font-semibold mt-4">
                  Match Score
                </p>
              </div>
            </ProgressRadial>
          </div>
        </div>
        <Separator orientation="vertical" className="md:block hidden" />
        <div className="flex-1 flex flex-col">
          <div className="space-y-2 flex flex-col overflow-hidden">
            <p className="text-sm text-muted-foreground">Keywords Matched</p>
            <div className="flex flex-wrap gap-1 overflow-auto">
              {form.getValues("keywordsMatched")?.length ? (
                form.getValues("keywordsMatched")?.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-1 py-0.5"
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No keywords matched.
                </p>
              )}
            </div>
          </div>
        </div>
        <Separator orientation="vertical" className="md:block hidden" />
        <div className="flex-1 flex flex-col">
          <div className="space-y-2 flex flex-col overflow-hidden">
            <p className="text-sm text-muted-foreground">Keywords Missing</p>
            <div className="flex flex-wrap gap-1 overflow-auto">
              {form.getValues("keywordsMissing")?.length ? (
                form.getValues("keywordsMissing")?.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-1 py-0.5"
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No keywords missing.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </Card>
  );
}

function HeaderSection({
  form,
  isEditing,
  FieldButtons,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
  isEditing: (fieldName: string) => boolean;
  FieldButtons: (fieldName: string) => React.ReactNode;
}) {
  const name = form.watch("profile.name");
  const headline = form.watch("profile.headline");
  const email = form.watch("profile.email");
  const mobile = form.watch("profile.mobile");
  const location = form.watch("profile.location");
  const description = form.watch("profile.description");
  const jobTitle = form.getValues("jobTitle");

  return (
    <div className="space-y-4">
      {/* General Information - Grouped */}
      {!isEditing("general") ? (
        <motion.div layout className="space-y-4">
          {/* Header with Name and Headline */}
          <div className="space-y-2 group relative">
            <div className="flex items-baseline justify-between">
              <div className="flex-1">
                <h1>{name || "Add your name"}</h1>
                <h4>{jobTitle}</h4>
                <p className="text-lg text-muted-foreground mt-1">
                  {headline || "Your professional headline"}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {FieldButtons("general")}
              </div>
            </div>
          </div>

          {/* Contact & Location Info - Compact Inline */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.div layout className="group relative flex-1 min-w-[150px]">
              <div className="rounded-lg border border-border bg-muted/30 p-3 transition-colors group-hover:bg-muted/60">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Email
                </p>
                <p className="text-sm truncate">{email || "—"}</p>
              </div>
            </motion.div>

            <motion.div layout className="group relative flex-1 min-w-[150px]">
              <div className="rounded-lg border border-border bg-muted/30 p-3 transition-colors group-hover:bg-muted/60">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Phone
                </p>
                <p className="text-sm truncate">{mobile || "—"}</p>
              </div>
            </motion.div>

            <motion.div layout className="group relative flex-1 min-w-[150px]">
              <div className="rounded-lg border border-border bg-muted/30 p-3 transition-colors group-hover:bg-muted/60">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Location
                </p>
                <p className="text-sm truncate">{location || "—"}</p>
              </div>
            </motion.div>
          </div>

          {/* About Section */}
          <motion.div
            layout
            className="group relative rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              About
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              {description ||
                "Tell us about yourself, your experience, and what you're passionate about..."}
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="rounded-lg border border-border bg-background p-4 space-y-3"
        >
          <div className="flex items-center justify-between mb-4">
            <h6>Edit General Information</h6>
            {FieldButtons("general")}
          </div>
          <div className="grid gap-3">
            <FormField
              name="profile.name"
              control={form.control}
              render={({ field }) => (
                <AppFormField label="Full Name">
                  <Input placeholder="Enter your full name" {...field} />
                </AppFormField>
              )}
            />
            <FormField
              name="profile.headline"
              control={form.control}
              render={({ field }) => (
                <AppFormField label="Professional Headline">
                  <Input
                    placeholder="e.g., Senior Software Engineer"
                    {...field}
                  />
                </AppFormField>
              )}
            />
            <FormField
              name="profile.email"
              control={form.control}
              render={({ field }) => (
                <AppFormField label="Email">
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </AppFormField>
              )}
            />
            <FormField
              name="profile.mobile"
              control={form.control}
              render={({ field }) => (
                <AppFormField label="Phone">
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...field}
                  />
                </AppFormField>
              )}
            />
            <FormField
              name="profile.location"
              control={form.control}
              render={({ field }) => (
                <AppFormField label="Location">
                  <Input placeholder="City, Country" {...field} />
                </AppFormField>
              )}
            />
            <FormField
              name="profile.description"
              control={form.control}
              render={({ field }) => (
                <AppFormField label="About">
                  <Textarea
                    placeholder="Tell us about yourself..."
                    {...field}
                    rows={4}
                  />
                </AppFormField>
              )}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function WorkExperienceSection({
  form,
  setFieldMode,
  isEditing,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  isEditing: (fieldName: string) => boolean;
  FieldButtons: (
    fieldName: string,
    removeCallback?: () => void
  ) => React.ReactNode;
  RemoveFieldButton: (onClick: () => void) => React.ReactNode;
}) {
  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control: form.control,
    name: "profile.workExperiences",
  });

  const getNewWorkExperience = (): ClientCreateWorkExperienceType => ({
    name: "",
    company: "",
    location: "",
    type: "Full-time",
    description: "",
    startDate: new Date(),
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3>Work Experience</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            appendWork(getNewWorkExperience());
            setFieldMode(`workExperiences.${workFields.length}`, "create");
          }}
          className="h-8 gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {workFields?.length ? (
          <AnimatePresence>
            {workFields.map((exp, index) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isEditing(`workExperiences.${index}`) ? (
                  <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h6>
                          {form.watch(`profile.workExperiences.${index}.name`)}
                        </h6>
                        <p className="text-xs text-muted-foreground">
                          {form.watch(
                            `profile.workExperiences.${index}.company`
                          )}{" "}
                          -{" "}
                          <span>
                            {form.watch(
                              `profile.workExperiences.${index}.type`
                            )}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`workExperiences.${index}`)}
                        {RemoveFieldButton(() => removeWork(index))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                      {form.watch(
                        `profile.workExperiences.${index}.startDate`
                      ) && (
                        <>
                          <span>
                            {formatMonth(
                              form.watch(
                                `profile.workExperiences.${index}.startDate`
                              )
                            )}
                          </span>
                          {form.watch(
                            `profile.workExperiences.${index}.isCurrent`
                          ) ? (
                            <span>— Present</span>
                          ) : form.watch(
                              `profile.workExperiences.${index}.endDate`
                            ) ? (
                            <>
                              <span>—</span>
                              <span>
                                {formatMonth(
                                  form.watch(
                                    `profile.workExperiences.${index}.endDate`
                                  )
                                )}
                              </span>
                            </>
                          ) : null}
                        </>
                      )}
                    </div>

                    {form.watch(
                      `profile.workExperiences.${index}.location`
                    ) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                        <MapPinIcon className="h-3 w-3" />
                        <span>
                          {form.watch(
                            `profile.workExperiences.${index}.location`
                          )}
                        </span>
                      </div>
                    )}

                    {form.watch(
                      `profile.workExperiences.${index}.description`
                    ) && (
                      <div
                        className="text-sm leading-relaxed text-muted-foreground prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            form.watch(
                              `profile.workExperiences.${index}.description`
                            ) || ""
                          ),
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h6>Edit Position</h6>
                      {FieldButtons(`workExperiences.${index}`, () =>
                        removeWork(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`profile.workExperiences.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Job Title">
                            <Input
                              placeholder="e.g., Senior Developer"
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.workExperiences.${index}.company`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Company">
                            <Input placeholder="Company name" {...field} />
                          </AppFormField>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          name={`profile.workExperiences.${index}.location`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="Location">
                              <Input placeholder="City, Country" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`profile.workExperiences.${index}.type`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="Type">
                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Full-time">
                                    Full-time
                                  </SelectItem>
                                  <SelectItem value="Part-time">
                                    Part-time
                                  </SelectItem>
                                  <SelectItem value="Freelance">
                                    Freelance
                                  </SelectItem>
                                  <SelectItem value="Internship">
                                    Internship
                                  </SelectItem>
                                  <SelectItem value="Volunteer">
                                    Volunteer
                                  </SelectItem>
                                  <SelectItem value="Contract">
                                    Contract
                                  </SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </AppFormField>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          name={`profile.workExperiences.${index}.startDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="Start Date">
                              <MonthPicker
                                selectedMonth={field.value}
                                onMonthSelect={field.onChange}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`profile.workExperiences.${index}.endDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="End Date">
                              <MonthPicker
                                disabled={form.watch(
                                  `profile.workExperiences.${index}.isCurrent`
                                )}
                                selectedMonth={field.value}
                                onMonthSelect={field.onChange}
                              />
                            </AppFormField>
                          )}
                        />
                      </div>
                      <FormField
                        name={`profile.workExperiences.${index}.isCurrent`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={field.value ?? false}
                                onCheckedChange={(value) => {
                                  field.onChange(value);
                                  if (value) {
                                    form.setValue(
                                      `profile.workExperiences.${index}.endDate`,
                                      undefined
                                    );
                                  }
                                }}
                              />
                              <label className="text-sm">
                                Currently working here
                              </label>
                            </div>
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.workExperiences.${index}.description`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Description">
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                            />
                          </AppFormField>
                        )}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No experience yet
          </div>
        )}
      </div>
    </div>
  );
}

function EducationSection({
  form,
  isEditing,
  setFieldMode,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
  isEditing: (fieldName: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  FieldButtons: (
    fieldName: string,
    removeCallback?: () => void
  ) => React.ReactNode;
  RemoveFieldButton: (fn: () => void) => React.ReactNode;
}) {
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control: form.control, name: "profile.educations" });
  const getNewEducation = (): ClientCreateEducationType => ({
    degree: "",
    institution: "",
    location: "",
    name: "",
    startDate: new Date(),
    endDate: undefined,
    isCurrent: false,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3>Education</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            appendEducation(getNewEducation());
            setFieldMode(`educations.${educationFields.length}`, "create");
          }}
          className="h-8 gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {educationFields?.length ? (
          <AnimatePresence>
            {educationFields.map((edu, index) => (
              <motion.div
                key={edu.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isEditing(`educations.${index}`) ? (
                  <div className="rounded-lg border border-border bg-muted/20 p-3 hover:bg-muted/40 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h6>
                          {form.watch(`profile.educations.${index}.degree`)}
                        </h6>
                        <p className="text-xs text-muted-foreground">
                          {form.watch(
                            `profile.educations.${index}.institution`
                          )}
                        </p>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`educations.${index}`)}
                        {RemoveFieldButton(() => removeEducation(index))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                      {form.watch(`profile.educations.${index}.startDate`) && (
                        <>
                          <span>
                            {formatMonth(
                              form.watch(
                                `profile.educations.${index}.startDate`
                              )
                            )}
                          </span>
                          {form.watch(
                            `profile.educations.${index}.isCurrent`
                          ) ? (
                            <span>— Present</span>
                          ) : form.watch(
                              `profile.educations.${index}.endDate`
                            ) ? (
                            <>
                              <span>—</span>
                              <span>
                                {formatMonth(
                                  form.watch(
                                    `profile.educations.${index}.endDate`
                                  )
                                )}
                              </span>
                            </>
                          ) : null}
                        </>
                      )}
                    </div>

                    {form.watch(`profile.educations.${index}.location`) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                        <MapPinIcon className="h-3 w-3" />
                        <span>
                          {form.watch(`profile.educations.${index}.location`)}
                        </span>
                      </div>
                    )}

                    {form.watch(`profile.educations.${index}.name`) && (
                      <p className="text-xs text-muted-foreground">
                        Field:{" "}
                        <span className="text-foreground">
                          {form.watch(`profile.educations.${index}.name`)}
                        </span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h6>Edit Education</h6>
                      {FieldButtons(`educations.${index}`, () =>
                        removeEducation(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`profile.educations.${index}.degree`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Degree">
                            <Input
                              placeholder="e.g., Bachelor of Science"
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.educations.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Field of Study">
                            <Input
                              placeholder="e.g., Computer Science"
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.educations.${index}.institution`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Institution">
                            <Input
                              placeholder="School/University name"
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.educations.${index}.location`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Location">
                            <Input placeholder="City, Country" {...field} />
                          </AppFormField>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          name={`profile.educations.${index}.startDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="Start Date">
                              <MonthPicker
                                selectedMonth={field.value}
                                onMonthSelect={field.onChange}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`profile.educations.${index}.endDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="End Date">
                              <MonthPicker
                                disabled={form.watch(
                                  `profile.educations.${index}.isCurrent`
                                )}
                                selectedMonth={field.value}
                                onMonthSelect={field.onChange}
                              />
                            </AppFormField>
                          )}
                        />
                      </div>
                      <FormField
                        name={`profile.educations.${index}.isCurrent`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                              />
                              <label className="text-sm">
                                Currently studying
                              </label>
                            </div>
                          </AppFormField>
                        )}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No education yet
          </div>
        )}
      </div>
    </div>
  );
}

function CertificationsSection({
  form,
  isEditing,
  setFieldMode,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
  isEditing: (fieldName: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  FieldButtons: (
    fieldName: string,
    removeCallback?: () => void
  ) => React.ReactNode;
  RemoveFieldButton: (fn: () => void) => React.ReactNode;
}) {
  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({ control: form.control, name: "profile.certifications" });
  const getNewCertification = (): ClientCreateCertificationType => ({
    name: "",
    issuer: "",
    credentialId: "",
    url: "",
    startDate: new Date(),
  });
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3>Certifications</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            appendCertification(getNewCertification());
            setFieldMode(
              `profile.certifications.${certificationFields.length}`,
              "create"
            );
          }}
          className="h-8 gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {certificationFields?.length ? (
          <AnimatePresence>
            {certificationFields.map((cert, index) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isEditing(`certifications.${index}`) ? (
                  <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h6>
                          {form.watch(`profile.certifications.${index}.name`)}
                        </h6>
                        <p className="text-xs text-muted-foreground">
                          {form.watch(`profile.certifications.${index}.issuer`)}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span>
                            {formatMonth(
                              form.watch(
                                `profile.certifications.${index}.startDate`
                              )
                            )}
                          </span>
                          {form.watch(
                            `profile.certifications.${index}.credentialId`
                          ) && (
                            <span>
                              • ID:{" "}
                              {form.watch(
                                `profile.certifications.${index}.credentialId`
                              )}
                            </span>
                          )}
                        </div>
                        {form.watch(`profile.certifications.${index}.url`) && (
                          <Link
                            href={
                              form.watch(
                                `profile.certifications.${index}.url`
                              ) || ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-block mt-1"
                          >
                            View Credential →
                          </Link>
                        )}
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`certifications.${index}`)}
                        {RemoveFieldButton(() => removeCertification(index))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h6>Edit Certification</h6>
                      {FieldButtons(`certifications.${index}`, () =>
                        removeCertification(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`profile.certifications.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Certification Name">
                            <Input
                              placeholder="Certification name"
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.certifications.${index}.issuer`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Issuer">
                            <Input
                              placeholder="Issuing organization"
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          name={`profile.certifications.${index}.startDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="Date Obtained">
                              <MonthPicker
                                selectedMonth={field.value}
                                onMonthSelect={field.onChange}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`profile.certifications.${index}.endDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="Expiration Date">
                              <MonthPicker
                                selectedMonth={field.value}
                                onMonthSelect={field.onChange}
                              />
                            </AppFormField>
                          )}
                        />
                      </div>
                      <FormField
                        name={`profile.certifications.${index}.credentialId`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Credential ID">
                            <Input
                              placeholder="Credential ID (optional)"
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.certifications.${index}.url`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Credential URL">
                            <Input placeholder="URL (optional)" {...field} />
                          </AppFormField>
                        )}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No certifications yet
          </div>
        )}
      </div>
    </div>
  );
}

function AwardsSection({
  form,
  isEditing,
  setFieldMode,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
  isEditing: (fieldName: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  FieldButtons: (
    fieldName: string,
    removeCallback?: () => void
  ) => React.ReactNode;
  RemoveFieldButton: (fn: () => void) => React.ReactNode;
}) {
  const {
    fields: awardsFields,
    append: appendAward,
    remove: removeAward,
  } = useFieldArray({ control: form.control, name: "profile.awardOrHonors" });

  const getNewAward = (): ClientCreateAwardOrHonorType => ({
    name: "",
    institution: "",
    date: new Date(),
    description: "",
    url: "",
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3>Awards & Honors</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            appendAward(getNewAward());
            setFieldMode(`awardOrHonors.${awardsFields.length}`, "create");
          }}
          className="h-8 gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {awardsFields?.length ? (
          <AnimatePresence>
            {awardsFields.map((award, index) => (
              <motion.div
                key={award.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isEditing(`awardOrHonors.${index}`) ? (
                  <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h6>
                          {form.watch(`profile.awardOrHonors.${index}.name`)}
                        </h6>
                        <p className="text-xs text-muted-foreground">
                          {form.watch(
                            `profile.awardOrHonors.${index}.institution`
                          )}
                        </p>
                        {form.watch(`profile.awardOrHonors.${index}.date`) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatMonth(
                              form.watch(`profile.awardOrHonors.${index}.date`)
                            )}
                          </p>
                        )}
                        {form.watch(
                          `profile.awardOrHonors.${index}.description`
                        ) && (
                          <div
                            className="text-sm leading-relaxed text-muted-foreground prose prose-sm max-w-none mt-2"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                form.watch(
                                  `profile.awardOrHonors.${index}.description`
                                ) || ""
                              ),
                            }}
                          />
                        )}
                        {form.watch(`profile.awardOrHonors.${index}.url`) && (
                          <Link
                            href={
                              form.watch(
                                `profile.awardOrHonors.${index}.url`
                              ) || ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-block mt-2"
                          >
                            View Award →
                          </Link>
                        )}
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`awardOrHonors.${index}`)}
                        {RemoveFieldButton(() => removeAward(index))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h6>Edit Award</h6>
                      {FieldButtons(`awardOrHonors.${index}`, () =>
                        removeAward(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`profile.awardOrHonors.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Award Name">
                            <Input placeholder="Award name" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.awardOrHonors.${index}.institution`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Issuing Organization">
                            <Input placeholder="Organization" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.awardOrHonors.${index}.description`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Description">
                            <Textarea
                              placeholder="Describe this award..."
                              {...field}
                              rows={3}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.awardOrHonors.${index}.date`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Date">
                            <MonthPicker
                              selectedMonth={field.value}
                              onMonthSelect={field.onChange}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.awardOrHonors.${index}.url`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="URL">
                            <Input placeholder="URL (optional)" {...field} />
                          </AppFormField>
                        )}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No awards yet
          </div>
        )}
      </div>
    </div>
  );
}

function PublicationsSection({
  form,
  isEditing,
  setFieldMode,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
  isEditing: (fieldName: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  FieldButtons: (
    fieldName: string,
    removeCallback?: () => void
  ) => React.ReactNode;
  RemoveFieldButton: (fn: () => void) => React.ReactNode;
}) {
  const {
    fields: publicationFields,
    append: appendPublication,
    remove: removePublication,
  } = useFieldArray({ control: form.control, name: "profile.publications" });
  const getNewPublication = (): ClientCreatePublicationType => ({
    title: "",
    date: new Date(),
    url: "",
  });
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3>Publications</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            appendPublication(getNewPublication());
            setFieldMode(`publications.${publicationFields.length}`, "create");
          }}
          className="h-8 gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {publicationFields?.length ? (
          <AnimatePresence>
            {publicationFields.map((pub, index) => (
              <motion.div
                key={pub.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isEditing(`publications.${index}`) ? (
                  <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h6>
                          {form.watch(`profile.publications.${index}.title`)}
                        </h6>
                        {form.watch(`profile.publications.${index}.date`) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatMonth(
                              form.watch(`profile.publications.${index}.date`)
                            )}
                          </p>
                        )}
                        {form.watch(`profile.publications.${index}.url`) && (
                          <Link
                            href={
                              form.watch(`profile.publications.${index}.url`) ||
                              ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-block mt-1"
                          >
                            View Publication →
                          </Link>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`publications.${index}`)}
                        {RemoveFieldButton(() => removePublication(index))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h6>Edit Publication</h6>
                      {FieldButtons(`publications.${index}`, () =>
                        removePublication(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`profile.publications.${index}.title`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Title">
                            <Input placeholder="Publication title" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.publications.${index}.date`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Publication Date">
                            <MonthPicker
                              selectedMonth={field.value}
                              onMonthSelect={field.onChange}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.publications.${index}.url`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="URL">
                            <Input placeholder="URL (optional)" {...field} />
                          </AppFormField>
                        )}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No publications yet
          </div>
        )}
      </div>
    </div>
  );
}

function LanguagesSection({
  form,
  isEditing,
  setFieldMode,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
  isEditing: (fieldName: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  FieldButtons: (
    fieldName: string,
    removeCallback?: () => void
  ) => React.ReactNode;
  RemoveFieldButton: (fn: () => void) => React.ReactNode;
}) {
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control: form.control, name: "profile.languages" });
  const getNewLanguage = (): ClientCreateLanguageType => ({
    name: "",
    proficiency: "Advanced",
    level: "A1",
  });
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3>Languages</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            appendLanguage(getNewLanguage());
            setFieldMode(`languages.${languageFields.length}`, "create");
          }}
          className="h-8 gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {languageFields?.length ? (
          <AnimatePresence>
            {languageFields.map((lang, index) => (
              <motion.div
                key={lang.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isEditing(`languages.${index}`) ? (
                  <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h6>{form.watch(`profile.languages.${index}.name`)}</h6>
                        <Badge variant="secondary" className="text-xs">
                          {form.watch(`profile.languages.${index}.proficiency`)}
                          {form.watch(`profile.languages.${index}.level`) &&
                            `profile. · ${form.watch(
                              `profile.languages.${index}.level`
                            )}`}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {FieldButtons(`languages.${index}`)}
                      {RemoveFieldButton(() => removeLanguage(index))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h6>Edit Language</h6>
                      {FieldButtons(`languages.${index}`, () =>
                        removeLanguage(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`profile.languages.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Language">
                            <Input placeholder="Language name" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.languages.${index}.proficiency`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Proficiency">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Beginner">
                                  Beginner
                                </SelectItem>
                                <SelectItem value="Intermediate">
                                  Intermediate
                                </SelectItem>
                                <SelectItem value="Advanced">
                                  Advanced
                                </SelectItem>
                                <SelectItem value="Fluent">Fluent</SelectItem>
                                <SelectItem value="Native">Native</SelectItem>
                              </SelectContent>
                            </Select>
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.languages.${index}.level`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="CEFR Level (optional)">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? undefined}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A1">A1</SelectItem>
                                <SelectItem value="A2">A2</SelectItem>
                                <SelectItem value="B1">B1</SelectItem>
                                <SelectItem value="B2">B2</SelectItem>
                                <SelectItem value="C1">C1</SelectItem>
                                <SelectItem value="C2">C2</SelectItem>
                              </SelectContent>
                            </Select>
                          </AppFormField>
                        )}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No languages yet
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsSection({
  form,
  isEditing,
  setFieldMode,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
  isEditing: (fieldName: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  FieldButtons: (
    fieldName: string,
    removeCallback?: () => void
  ) => React.ReactNode;
  RemoveFieldButton: (fn: () => void) => React.ReactNode;
}) {
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({ control: form.control, name: "profile.projects" });
  const getNewProject = (): ClientCreateProjectType => ({
    name: "",
    description: "",
    shortDescription: "",
    technologies: [],
    role: [],
    repositoryUrl: "",
    liveUrl: "",
    startedAt: new Date(),
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3>Projects</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            appendProject(getNewProject());
            setFieldMode(`projects.${projectFields.length}`, "create");
          }}
          className="h-8 gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {projectFields?.length ? (
          <AnimatePresence>
            {projectFields.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isEditing(`projects.${index}`) ? (
                  <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h5>{form.watch(`profile.projects.${index}.name`)}</h5>
                        {form.watch(
                          `profile.projects.${index}.shortDescription`
                        ) && (
                          <p className="text-xs text-muted-foreground">
                            {form.watch(
                              `profile.projects.${index}.shortDescription`
                            )}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`projects.${index}`)}
                        {RemoveFieldButton(() => removeProject(index))}
                      </div>
                    </div>
                    {form.watch(`profile.projects.${index}.description`) && (
                      <div
                        className="text-sm leading-relaxed text-muted-foreground prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            form.watch(
                              `profile.projects.${index}.description`
                            ) || ""
                          ),
                        }}
                      />
                    )}
                    {form.watch(`profile.projects.${index}.technologies`)
                      ?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {form
                          .watch(`profile.projects.${index}.technologies`)
                          ?.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                      </div>
                    ) : null}
                    {form.watch(`profile.projects.${index}.role`)?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {form
                          .watch(`profile.projects.${index}.role`)
                          ?.map((r) => (
                            <Badge
                              key={r}
                              variant="outline"
                              className="text-xs"
                            >
                              {r}
                            </Badge>
                          ))}
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2 pt-2">
                      {form.watch(
                        `profile.projects.${index}.repositoryUrl`
                      ) && (
                        <Link
                          href={
                            form.watch(
                              `profile.projects.${index}.repositoryUrl`
                            ) || ""
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary flex gap-1 items-center hover:underline"
                        >
                          <ExternalLinkIcon className="h-3 w-3" />
                          <span>Repository Link</span>
                        </Link>
                      )}
                      {form.watch(`profile.projects.${index}.liveUrl`) && (
                        <Link
                          href={
                            form.watch(`profile.projects.${index}.liveUrl`) ||
                            ""
                          }
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
                        {formatMonth(
                          form.watch(`profile.projects.${index}.startedAt`)
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h6>Edit Project</h6>
                      {FieldButtons(`projects.${index}`, () =>
                        removeProject(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`profile.projects.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Project Name">
                            <Input placeholder="Project name" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.projects.${index}.shortDescription`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Short Description">
                            <Input placeholder="One-line summary" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.projects.${index}.description`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Full Description">
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.projects.${index}.technologies`}
                        control={form.control}
                        render={({ field: { value, onChange, ...field } }) => (
                          <AppFormField label="Technologies">
                            <Input
                              placeholder="React, TypeScript, Node.js (comma-separated)"
                              defaultValue={value?.join(", ") || ""}
                              onChange={(e) => {
                                const techs = e.target.value
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter((t) => t.length > 0);
                                onChange(techs);
                              }}
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.projects.${index}.role`}
                        control={form.control}
                        render={({ field: { value, onChange, ...field } }) => (
                          <AppFormField label="Roles">
                            <Input
                              placeholder="Frontend, Backend (comma-separated)"
                              defaultValue={value?.join(", ") || ""}
                              onChange={(e) => {
                                const roles = e.target.value
                                  .split(",")
                                  .map((r) => r.trim())
                                  .filter((r) => r.length > 0);
                                onChange(roles);
                              }}
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.projects.${index}.startedAt`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Started">
                            <MonthPicker
                              selectedMonth={field.value}
                              onMonthSelect={field.onChange}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.projects.${index}.repositoryUrl`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Repository URL">
                            <Input
                              placeholder="GitHub link (optional)"
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.projects.${index}.liveUrl`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Live Demo URL">
                            <Input
                              placeholder="Live site link (optional)"
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No projects yet
          </div>
        )}
      </div>
    </div>
  );
}

function SocialsSection({
  form,
  isEditing,
  setFieldMode,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
  isEditing: (fieldName: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  FieldButtons: (
    fieldName: string,
    removeCallback?: () => void
  ) => React.ReactNode;
  RemoveFieldButton: (fn: () => void) => React.ReactNode;
}) {
  const {
    fields: socialsFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({ control: form.control, name: "profile.socials" });
  const getNewSocial = (): ClientCreateSocialType => ({ name: "", url: "" });
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3>Social Links</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            appendSocial(getNewSocial());
            setFieldMode(`socials.${socialsFields.length}`, "create");
          }}
          className="h-8 gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {socialsFields?.length ? (
          <AnimatePresence>
            {socialsFields.map((social, index) => (
              <motion.div
                key={social.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isEditing(`socials.${index}`) ? (
                  <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h6>{form.watch(`profile.socials.${index}.name`)}</h6>
                        <Link
                          href={
                            form.watch(`profile.socials.${index}.url`) || ""
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline truncate block"
                        >
                          {form.watch(`profile.socials.${index}.url`)}
                        </Link>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`socials.${index}`)}
                        {RemoveFieldButton(() => removeSocial(index))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h6>Edit Social Link</h6>
                      <div className="flex gap-1">
                        {FieldButtons(`socials.${index}`)}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`profile.socials.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Platform">
                            <Input
                              placeholder="LinkedIn, GitHub, etc."
                              {...field}
                            />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`profile.socials.${index}.url`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="URL">
                            <Input placeholder="https://..." {...field} />
                          </AppFormField>
                        )}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No social links yet
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResumeProfileSections({
  form,
}: {
  form: UseFormReturn<ClientCreateResumeType>;
}) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [creatingFields, setCreatingFields] = useState<Set<string>>(new Set());

  const isEditing = (fieldName: string) => editingField === fieldName;
  const isCreating = (fieldName: string) => creatingFields.has(fieldName);

  const handleCancel = (removeCallback?: () => void) => {
    if (editingField && isCreating(editingField)) {
      if (removeCallback) {
        removeCallback();
      }
      const newCreating = new Set(creatingFields);
      newCreating.delete(editingField);
      setCreatingFields(newCreating);
    }
    setEditingField(null);
  };

  const handleSave = async () => {
    try {
      setEditingField(null);
      setCreatingFields(new Set());
    } catch (err) {
      console.error(err);
    }
  };

  const setFieldMode = (fieldName: string, mode: "create" | "edit") => {
    setEditingField(fieldName);
    if (mode === "create") {
      setCreatingFields((prev) => new Set([...prev, fieldName]));
    } else {
      setCreatingFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  };

  const FieldButtons = (
    fieldName: string,
    removeCallback?: () => void
  ): React.ReactNode => (
    <div className="flex gap-1">
      {!isEditing(fieldName) ? (
        <Button
          variant="ghost"
          type="button"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setEditingField(fieldName)}
          title="Edit"
        >
          <PenIcon className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <>
          <Button
            variant="ghost"
            type="button"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleSave}
            title="Save"
          >
            <CheckIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            type="button"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => handleCancel(removeCallback)}
            title="Cancel"
          >
            <XIcon className="h-3.5 w-3.5" />
          </Button>
        </>
      )}
    </div>
  );

  const RemoveFieldButton = (onClick: () => void) => (
    <Button
      variant="ghost"
      className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
      type="button"
      size="sm"
      onClick={() => {
        openDialog({
          title: "Delete Item",
          description: "Are you sure? This cannot be undone.",
          footer: (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={async () => {
                onClick();
                await form.handleSubmit(handleSave)();
                closeDialog();
              }}
            >
              Delete
            </Button>
          ),
        });
      }}
      title="Delete"
    >
      <TrashIcon className="h-3.5 w-3.5" />
    </Button>
  );

  const {
    fields: appliedSuggestionFields,
    append: appendAppliedSuggestion,
    remove: removeAppliedSuggestion,
  } = useFieldArray({
    control: form.control,
    name: "appliedSuggestions",
  });
  const { fields: suggestionFields } = useFieldArray({
    control: form.control,
    name: "suggestions",
  });

  /**
   * Normalizes array field values that may come as strings from AI suggestions
   * Converts strings to arrays for fields like technologies, role, skills, etc.
   */
  const normalizeArrayField = (fieldPath: string, value: any): any => {
    // Array fields that should always be arrays
    const arrayFields = [
      "technologies",
      "role",
      "skills",
      "proficiencies",
      "languages",
    ];

    const isArrayField = arrayFields.some((field) => fieldPath.endsWith(field));

    if (!isArrayField) {
      return value;
    }

    // If it's already an array, return as-is
    if (Array.isArray(value)) {
      return value;
    }

    // If it's a string, split by comma and trim
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    // Default to empty array if not a string or array
    return [];
  };

  /**
   * Applies a single suggestion by tracking it in appliedSuggestions
   * and updating the form field with the suggested value
   */
  const applySuggestion = (suggestion: SuggestionItemType): void => {
    // Check if already applied
    const alreadyApplied = appliedSuggestionFields.some(
      (applied) => applied.fieldPath === suggestion.fieldPath
    );

    // Only add if not already applied
    if (!alreadyApplied) {
      // Normalize the suggested value for array fields
      const normalizedValue = normalizeArrayField(
        suggestion.fieldPath,
        suggestion.suggestedValue
      );

      // Update the form field with the suggested value
      form.setValue(
        `profile.${suggestion.fieldPath}` as any,
        normalizedValue
      );

      // Track this suggestion as applied
      appendAppliedSuggestion({
        id: suggestion.id,
        originalValue: suggestion.originalValue,
        fieldPath: suggestion.fieldPath,
        suggestedValue: suggestion.suggestedValue,
        explanation: suggestion.explanation,
      });
    }
  };

  /**
   * Undoes a single suggestion by reverting the form field to original value
   * and removing it from appliedSuggestions
   */
  const undoSuggestion = (suggestion: SuggestionItemType): void => {
    // Find the index of this suggestion in applied suggestions by fieldPath
    const appliedIndex = appliedSuggestionFields.findIndex(
      (applied) => applied.fieldPath === suggestion.fieldPath
    );

    // Revert the form field to original value if it exists
    if (
      appliedIndex !== -1 &&
      suggestion.originalValue !== null &&
      suggestion.originalValue !== undefined
    ) {
      // Normalize the original value for array fields
      const normalizedOriginal = normalizeArrayField(
        suggestion.fieldPath,
        suggestion.originalValue
      );

      form.setValue(
        `profile.${suggestion.fieldPath}` as any,
        normalizedOriginal
      );
    }

    // Remove from applied suggestions
    if (appliedIndex !== -1) {
      removeAppliedSuggestion(appliedIndex);
    }
  };

  /**
   * Applies all suggestions at once
   */
  const applyAllSuggestions = (): void => {
    suggestionFields.forEach((suggestion) => {
      const isAlreadyApplied = appliedSuggestionFields.some(
        (applied) => applied.fieldPath === suggestion.fieldPath
      );

      if (!isAlreadyApplied) {
        applySuggestion(suggestion);
      }
    });
  };

  /**
   * Undoes all applied suggestions by reverting all form fields to original values
   * and clearing the appliedSuggestions array
   */
  const undoAllSuggestions = (): void => {
    // Revert all form values in reverse order
    for (let i = appliedSuggestionFields.length - 1; i >= 0; i--) {
      const applied = appliedSuggestionFields[i];
      
      // Revert the form field to original value if it exists
      if (
        applied.originalValue !== null &&
        applied.originalValue !== undefined
      ) {
        // Normalize the original value for array fields
        const normalizedOriginal = normalizeArrayField(
          applied.fieldPath,
          applied.originalValue
        );

        form.setValue(
          `profile.${applied.fieldPath}` as any,
          normalizedOriginal
        );
      }

      // Remove from applied suggestions
      removeAppliedSuggestion(i);
    }
  };

  return (
    <>
      <InfoSection form={form} />
      <div className="flex flex-row gap-4">
        <Card className="flex-1 h-[calc(100dvh-22rem-var(--header-height))] sticky top-[calc(12rem+var(--header-height))] z-10">
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
            <CardDescription>
              Job Title: {form.watch("jobTitle") || "N/A"} at{" "}
              {form.watch("companyName") || "N/A"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2" id="suggestion-card-content">
            {/* Suggestions Cards here with the apply and undo button */}
            {suggestionFields.length > 0 &&
              suggestionFields.map((suggestion) => {
                const isApplied = appliedSuggestionFields.some(
                  (applied) => applied.fieldPath === suggestion.fieldPath
                );
                return (
                  <Card key={suggestion.id}>
                    <CardContent className="flex flex-col gap-2">
                      {suggestion.explanation && (
                        <p
                          className="text-sm text-pretty prose prose-sm"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              suggestion.originalValue || ""
                            ),
                          }}
                        />
                      )}
                      <div className="mx-auto text-muted-foreground">
                        <MoveDownIcon />
                      </div>
                      <CardDescription
                        className="text-sm text-green-500 text-pretty prose prose-sm"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            suggestion.suggestedValue || ""
                          ),
                        }}
                      />
                    </CardContent>
                    <CardFooter className="gap-2 flex justify-between items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="link" className="mr-auto" type="button">
                            <InfoIcon />
                            Explanation
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-96 text-pretty prose prose-sm">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                suggestion.explanation || ""
                              ),
                            }}
                          />
                        </TooltipContent>
                      </Tooltip>
                      <div className="ml-auto space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          disabled={!isApplied}
                          onClick={() => undoSuggestion(suggestion)}
                        >
                          Undo
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          type="button"
                          disabled={isApplied}
                          onClick={() => applySuggestion(suggestion)}
                        >
                          Apply
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
          </CardContent>
          <CardFooter className="flex gap-1 items-center justify-between">
            <div className="space-x-1">
              <Button
                type="button"
                variant="destructive"
                onClick={undoAllSuggestions}
                disabled={appliedSuggestionFields.length === 0}
              >
                Undo All
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={applyAllSuggestions}
                disabled={
                  suggestionFields.length === appliedSuggestionFields.length
                }
              >
                Apply All
              </Button>
            </div>
            <Button>Save to Library</Button>
          </CardFooter>
        </Card>
        <Card className="p-4 space-y-6 flex-2">
          <HeaderSection
            form={form}
            isEditing={isEditing}
            FieldButtons={FieldButtons}
          />
          <SocialsSection
            form={form}
            isEditing={isEditing}
            setFieldMode={setFieldMode}
            FieldButtons={FieldButtons}
            RemoveFieldButton={RemoveFieldButton}
          />
          <WorkExperienceSection
            form={form}
            setFieldMode={setFieldMode}
            isEditing={isEditing}
            FieldButtons={FieldButtons}
            RemoveFieldButton={RemoveFieldButton}
          />
          <EducationSection
            form={form}
            isEditing={isEditing}
            setFieldMode={setFieldMode}
            FieldButtons={FieldButtons}
            RemoveFieldButton={RemoveFieldButton}
          />
          <CertificationsSection
            form={form}
            isEditing={isEditing}
            setFieldMode={setFieldMode}
            FieldButtons={FieldButtons}
            RemoveFieldButton={RemoveFieldButton}
          />
          <AwardsSection
            form={form}
            isEditing={isEditing}
            setFieldMode={setFieldMode}
            FieldButtons={FieldButtons}
            RemoveFieldButton={RemoveFieldButton}
          />
          <PublicationsSection
            form={form}
            isEditing={isEditing}
            setFieldMode={setFieldMode}
            FieldButtons={FieldButtons}
            RemoveFieldButton={RemoveFieldButton}
          />
          <LanguagesSection
            form={form}
            isEditing={isEditing}
            setFieldMode={setFieldMode}
            FieldButtons={FieldButtons}
            RemoveFieldButton={RemoveFieldButton}
          />
          <ProjectsSection
            form={form}
            isEditing={isEditing}
            setFieldMode={setFieldMode}
            FieldButtons={FieldButtons}
            RemoveFieldButton={RemoveFieldButton}
          />
        </Card>
      </div>
    </>
  );
}
