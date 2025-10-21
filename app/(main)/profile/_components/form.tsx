"use client";

import { AppForm, AppFormField } from "@/components/common/form";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DOMPurify from "isomorphic-dompurify";
import { useProfileQuery } from "@/hooks/query/use-profile";
import {
  ClientCreateProfileType,
  ClientCreateProfileSchema,
  ClientCreateWorkExperienceType,
  ClientCreateCertificationType,
  ClientCreateAwardOrHonorType,
  ClientCreatePublicationType,
  ClientCreateLanguageType,
  ClientCreateSocialType,
  ClientCreateProjectType,
  ProfileToClientCreateProfileSchema,
} from "@/types/profile.types";
import React, { useState } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatMonth } from "@/lib/utils";
import { PenIcon, CheckIcon, XIcon, PlusIcon, TrashIcon } from "lucide-react";
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

function HeaderSection({
  form,
  isEditing,
  FieldButtons,
}: {
  form: UseFormReturn<ClientCreateProfileType>;
  isEditing: (fieldName: string) => boolean;
  FieldButtons: (fieldName: string) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {/* Header with Name and Headline */}
      <div className="space-y-2">
        {!isEditing("name") ? (
          <motion.div
            layout
            className="flex items-baseline justify-between group"
          >
            <div className="flex-1">
              <h1>{form.getValues("name") || "Add your name"}</h1>
              <p className="text-lg text-muted-foreground mt-1">
                {form.getValues("headline") || "Your professional headline"}
              </p>
            </div>
            {FieldButtons("name")}
          </motion.div>
        ) : (
          <motion.div layout className="space-y-3">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <AppFormField label="Full Name">
                  <Input placeholder="Enter your full name" {...field} />
                </AppFormField>
              )}
            />
            <FormField
              name="headline"
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
            <div className="flex gap-2 justify-end">{FieldButtons("name")}</div>
          </motion.div>
        )}
      </div>

      {/* Contact & Location Info - Compact Inline */}
      <div className="flex flex-wrap items-center gap-3">
        {!isEditing("email") ? (
          <motion.div
            layout
            className="group relative flex-1 min-w-[150px]"
            onClick={() => false}
          >
            <div className="rounded-lg border border-border bg-muted/30 p-3 transition-colors group-hover:bg-muted/60">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Email
              </p>
              <p className="text-sm truncate">
                {form.getValues("email") || "—"}
              </p>
              <div className="absolute inset-0 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {FieldButtons("email")}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div layout>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <AppFormField>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </AppFormField>
              )}
            />
            {FieldButtons("email")}
          </motion.div>
        )}

        {!isEditing("mobile") ? (
          <motion.div layout className="group relative flex-1 min-w-[150px]">
            <div className="rounded-lg border border-border bg-muted/30 p-3 transition-colors group-hover:bg-muted/60">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Phone
              </p>
              <p className="text-sm truncate">
                {form.getValues("mobile") || "—"}
              </p>
              <div className="absolute inset-0 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {FieldButtons("mobile")}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div layout>
            <FormField
              name="mobile"
              control={form.control}
              render={({ field }) => (
                <AppFormField>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...field}
                  />
                </AppFormField>
              )}
            />
            {FieldButtons("mobile")}
          </motion.div>
        )}

        {!isEditing("location") ? (
          <motion.div layout className="group relative flex-1 min-w-[150px]">
            <div className="rounded-lg border border-border bg-muted/30 p-3 transition-colors group-hover:bg-muted/60">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Location
              </p>
              <p className="text-sm truncate">
                {form.getValues("location") || "—"}
              </p>
              <div className="absolute inset-0 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {FieldButtons("location")}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div layout>
            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <AppFormField>
                  <Input placeholder="City, Country" {...field} />
                </AppFormField>
              )}
            />
            {FieldButtons("location")}
          </motion.div>
        )}
      </div>

      {/* About Section */}
      {!isEditing("description") ? (
        <motion.div
          layout
          className="group relative rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              About
            </p>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {FieldButtons("description")}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {form.getValues("description") ||
              "Tell us about yourself, your experience, and what you're passionate about..."}
          </p>
        </motion.div>
      ) : (
        <motion.div layout className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              About
            </p>
          </div>
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <AppFormField>
                <Textarea
                  placeholder="Tell us about yourself..."
                  {...field}
                  rows={4}
                />
              </AppFormField>
            )}
          />
          <div className="flex gap-2 justify-end">
            {FieldButtons("description")}
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
  form: UseFormReturn<ClientCreateProfileType>;
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
  } = useFieldArray({ control: form.control, name: "workExperiences" });

  const getNewWorkExperience = (): ClientCreateWorkExperienceType => ({
    name: "",
    company: "",
    location: "",
    type: "Full-time",
    description: "",
    startDate: new Date(),
  });

  return (
    <div className="space-y-3">
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
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h5>
                            {form.getValues(`workExperiences.${index}.name`)}
                          </h5>
                          <span className="text-xs text-muted-foreground">
                            at{" "}
                            {form.getValues(`workExperiences.${index}.company`)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span>
                            {form.getValues(`workExperiences.${index}.type`)}
                          </span>
                          {form.getValues(
                            `workExperiences.${index}.location`
                          ) && (
                            <span>
                              •{" "}
                              {form.getValues(
                                `workExperiences.${index}.location`
                              )}
                            </span>
                          )}
                          <span>
                            •{" "}
                            {formatMonth(
                              form.getValues(
                                `workExperiences.${index}.startDate`
                              )
                            )}{" "}
                            -{" "}
                            {form.getValues(
                              `workExperiences.${index}.isCurrent`
                            )
                              ? "Present"
                              : formatMonth(
                                  form.getValues(
                                    `workExperiences.${index}.endDate`
                                  )
                                )}
                          </span>
                        </div>
                        {form.getValues(
                          `workExperiences.${index}.description`
                        ) && (
                          <div
                            className="mt-2 text-xs leading-relaxed text-muted-foreground prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                form.getValues(
                                  `workExperiences.${index}.description`
                                ) || ""
                              ),
                            }}
                          />
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`workExperiences.${index}`)}
                        {RemoveFieldButton(() => removeWork(index))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h6>Edit Position</h6>
                      {FieldButtons(`workExperiences.${index}`, () =>
                        removeWork(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`workExperiences.${index}.name`}
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
                        name={`workExperiences.${index}.company`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Company">
                            <Input placeholder="Company name" {...field} />
                          </AppFormField>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          name={`workExperiences.${index}.location`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="Location">
                              <Input placeholder="City, Country" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`workExperiences.${index}.type`}
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
                          name={`workExperiences.${index}.startDate`}
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
                          name={`workExperiences.${index}.endDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="End Date">
                              <MonthPicker
                                disabled={form.watch(
                                  `workExperiences.${index}.isCurrent`
                                )}
                                selectedMonth={field.value}
                                onMonthSelect={field.onChange}
                              />
                            </AppFormField>
                          )}
                        />
                      </div>
                      <FormField
                        name={`workExperiences.${index}.isCurrent`}
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
                                      `workExperiences.${index}.endDate`,
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
                        name={`workExperiences.${index}.description`}
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
  form: UseFormReturn<ClientCreateProfileType>;
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
  } = useFieldArray({ control: form.control, name: "educations" });
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
    <div className="space-y-3">
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
                  <div className="group relative rounded-lg border border-border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:border-border/80">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h5>
                            {form.getValues(`educations.${index}.degree`)}
                          </h5>
                          <span className="text-xs text-muted-foreground">
                            in {form.getValues(`educations.${index}.name`)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {form.getValues(`educations.${index}.institution`)}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                          {form.getValues(`educations.${index}.location`) && (
                            <span>
                              {form.getValues(`educations.${index}.location`)}
                            </span>
                          )}
                          <span>
                            •{" "}
                            {formatMonth(
                              form.getValues(`educations.${index}.startDate`)
                            )}{" "}
                            -{" "}
                            {form.getValues(`educations.${index}.isCurrent`)
                              ? "Present"
                              : formatMonth(
                                  form.getValues(`educations.${index}.endDate`)
                                )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`educations.${index}`)}
                        {RemoveFieldButton(() => removeEducation(index))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h6>Edit Education</h6>
                      {FieldButtons(`educations.${index}`, () =>
                        removeEducation(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`educations.${index}.degree`}
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
                        name={`educations.${index}.name`}
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
                        name={`educations.${index}.institution`}
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
                        name={`educations.${index}.location`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Location">
                            <Input placeholder="City, Country" {...field} />
                          </AppFormField>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          name={`educations.${index}.startDate`}
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
                          name={`educations.${index}.endDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField label="End Date">
                              <MonthPicker
                                disabled={form.watch(
                                  `educations.${index}.isCurrent`
                                )}
                                selectedMonth={field.value}
                                onMonthSelect={field.onChange}
                              />
                            </AppFormField>
                          )}
                        />
                      </div>
                      <FormField
                        name={`educations.${index}.isCurrent`}
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
  form: UseFormReturn<ClientCreateProfileType>;
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
  } = useFieldArray({ control: form.control, name: "certifications" });
  const getNewCertification = (): ClientCreateCertificationType => ({
    name: "",
    issuer: "",
    credentialId: "",
    url: "",
    startDate: new Date(),
  });
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3>Certifications</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            appendCertification(getNewCertification());
            setFieldMode(
              `certifications.${certificationFields.length}`,
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
                        <h5>
                          {form.getValues(`certifications.${index}.name`)}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {form.getValues(`certifications.${index}.issuer`)}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span>
                            {formatMonth(
                              form.getValues(
                                `certifications.${index}.startDate`
                              )
                            )}
                          </span>
                          {form.getValues(
                            `certifications.${index}.credentialId`
                          ) && (
                            <span>
                              • ID:{" "}
                              {form.getValues(
                                `certifications.${index}.credentialId`
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`certifications.${index}`)}
                        {RemoveFieldButton(() => removeCertification(index))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h6>Edit Certification</h6>
                      {FieldButtons(`certifications.${index}`, () =>
                        removeCertification(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`certifications.${index}.name`}
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
                        name={`certifications.${index}.issuer`}
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
                          name={`certifications.${index}.startDate`}
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
                          name={`certifications.${index}.endDate`}
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
                        name={`certifications.${index}.credentialId`}
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
                        name={`certifications.${index}.url`}
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
  form: UseFormReturn<ClientCreateProfileType>;
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
  } = useFieldArray({ control: form.control, name: "awardOrHonors" });

  const getNewAward = (): ClientCreateAwardOrHonorType => ({
    name: "",
    institution: "",
    date: new Date(),
    description: "",
    url: "",
  });

  return (
    <div className="space-y-3">
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
                        <h5>{form.getValues(`awardOrHonors.${index}.name`)}</h5>
                        <p className="text-xs text-muted-foreground">
                          {form.getValues(`awardOrHonors.${index}.institution`)}
                        </p>
                        {form.getValues(`awardOrHonors.${index}.date`) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatMonth(
                              form.getValues(`awardOrHonors.${index}.date`)
                            )}
                          </p>
                        )}
                        {form.getValues(
                          `awardOrHonors.${index}.description`
                        ) && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {form.getValues(
                              `awardOrHonors.${index}.description`
                            )}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`awardOrHonors.${index}`)}
                        {RemoveFieldButton(() => removeAward(index))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h6>Edit Award</h6>
                      {FieldButtons(`awardOrHonors.${index}`, () =>
                        removeAward(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`awardOrHonors.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Award Name">
                            <Input placeholder="Award name" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`awardOrHonors.${index}.institution`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Issuing Organization">
                            <Input placeholder="Organization" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`awardOrHonors.${index}.description`}
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
                        name={`awardOrHonors.${index}.date`}
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
                        name={`awardOrHonors.${index}.url`}
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
  form: UseFormReturn<ClientCreateProfileType>;
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
  } = useFieldArray({ control: form.control, name: "publications" });
  const getNewPublication = (): ClientCreatePublicationType => ({
    title: "",
    date: new Date(),
    url: "",
  });
  return (
    <div className="space-y-3">
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
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h6>{form.getValues(`publications.${index}.title`)}</h6>
                        {form.getValues(`publications.${index}.date`) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatMonth(
                              form.getValues(`publications.${index}.date`)
                            )}
                          </p>
                        )}
                        {form.getValues(`publications.${index}.url`) && (
                          <Link
                            href={
                              form.getValues(`publications.${index}.url`) || ""
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
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h6>Edit Publication</h6>
                      {FieldButtons(`publications.${index}`, () =>
                        removePublication(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`publications.${index}.title`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Title">
                            <Input placeholder="Publication title" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`publications.${index}.date`}
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
                        name={`publications.${index}.url`}
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
  form: UseFormReturn<ClientCreateProfileType>;
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
  } = useFieldArray({ control: form.control, name: "languages" });
  const getNewLanguage = (): ClientCreateLanguageType => ({
    name: "",
    proficiency: "Advanced",
    level: "A1",
  });
  return (
    <div className="space-y-3">
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
                        <h6>{form.getValues(`languages.${index}.name`)}</h6>
                        <Badge variant="secondary" className="text-xs">
                          {form.getValues(`languages.${index}.proficiency`)}
                          {form.getValues(`languages.${index}.level`) &&
                            ` · ${form.getValues(`languages.${index}.level`)}`}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {FieldButtons(`languages.${index}`)}
                      {RemoveFieldButton(() => removeLanguage(index))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h6>Edit Language</h6>
                      {FieldButtons(`languages.${index}`, () =>
                        removeLanguage(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`languages.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Language">
                            <Input placeholder="Language name" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`languages.${index}.proficiency`}
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
                        name={`languages.${index}.level`}
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
  form: UseFormReturn<ClientCreateProfileType>;
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
  } = useFieldArray({ control: form.control, name: "projects" });
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
    <div className="space-y-3">
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
                        <h5>{form.getValues(`projects.${index}.name`)}</h5>
                        <p className="text-xs text-muted-foreground">
                          {form.getValues(`projects.${index}.shortDescription`)}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`projects.${index}`)}
                        {RemoveFieldButton(() => removeProject(index))}
                      </div>
                    </div>
                    {form.getValues(`projects.${index}.technologies`)
                      ?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {form
                          .getValues(`projects.${index}.technologies`)
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
                    {form.getValues(`projects.${index}.role`)?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {form.getValues(`projects.${index}.role`)?.map((r) => (
                          <Badge key={r} variant="outline" className="text-xs">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatMonth(
                          form.getValues(`projects.${index}.startedAt`)
                        )}
                      </span>
                      <div className="flex gap-2">
                        {form.getValues(`projects.${index}.repositoryUrl`) && (
                          <Link
                            href={
                              form.getValues(
                                `projects.${index}.repositoryUrl`
                              ) || ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Code
                          </Link>
                        )}
                        {form.getValues(`projects.${index}.liveUrl`) && (
                          <Link
                            href={
                              form.getValues(`projects.${index}.liveUrl`) || ""
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Demo
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h6>Edit Project</h6>
                      {FieldButtons(`projects.${index}`, () =>
                        removeProject(index)
                      )}
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`projects.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Project Name">
                            <Input placeholder="Project name" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`projects.${index}.shortDescription`}
                        control={form.control}
                        render={({ field }) => (
                          <AppFormField label="Short Description">
                            <Input placeholder="One-line summary" {...field} />
                          </AppFormField>
                        )}
                      />
                      <FormField
                        name={`projects.${index}.description`}
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
                        name={`projects.${index}.technologies`}
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
                        name={`projects.${index}.role`}
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
                        name={`projects.${index}.startedAt`}
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
                        name={`projects.${index}.repositoryUrl`}
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
                        name={`projects.${index}.liveUrl`}
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
  form: UseFormReturn<ClientCreateProfileType>;
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
  } = useFieldArray({ control: form.control, name: "socials" });
  const getNewSocial = (): ClientCreateSocialType => ({ name: "", url: "" });
  return (
    <div className="space-y-3">
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
                        <h6>{form.getValues(`socials.${index}.name`)}</h6>
                        <Link
                          href={form.getValues(`socials.${index}.url`) || ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline truncate block"
                        >
                          {form.getValues(`socials.${index}.url`)}
                        </Link>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {FieldButtons(`socials.${index}`)}
                        {RemoveFieldButton(() => removeSocial(index))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h6>Edit Social Link</h6>
                      <div className="flex gap-1">
                        {FieldButtons(`socials.${index}`)}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        name={`socials.${index}.name`}
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
                        name={`socials.${index}.url`}
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

export default function ProfileForm() {
  const { data: profile, CreateProfile } = useProfileQuery();

  const defaultValues = profile
    ? ProfileToClientCreateProfileSchema.parse(profile)
    : undefined;

  const form = useForm<ClientCreateProfileType>({
    resolver: zodResolver(ClientCreateProfileSchema),
    defaultValues,
  });

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

  const handleSave = async (values: ClientCreateProfileType) => {
    try {
      await CreateProfile.mutateAsync(values);
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
            onClick={() => form.handleSubmit(handleSave)()}
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

  return (
    <AppForm
      form={form}
      onSubmit={form.handleSubmit(handleSave)}
      className="space-y-8"
    >
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
    </AppForm>
  );
}
