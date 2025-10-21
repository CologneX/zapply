"use client";

import { AppForm, AppFormField } from "@/components/common/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  PenIcon,
  CheckIcon,
  XIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  AwardIcon,
  BookOpenIcon,
  LanguagesIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
  PenOffIcon,
  CodeIcon,
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
import { Label } from "@/components/ui/label";
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
  isEditing: (s: string) => boolean;
  FieldButtons: (s: string) => React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex flex-row gap-2 items-center">
              {isEditing("name") ? (
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <AppFormField>
                      <Input
                        placeholder="Full Name"
                        {...field}
                        className="text-2xl font-bold"
                      />
                    </AppFormField>
                  )}
                />
              ) : (
                <h2>{form.getValues("name")}</h2>
              )}
              {FieldButtons("name")}
            </div>

            <div className="space-y-2">
              {!isEditing("headline") ? (
                <div className="flex items-center gap-3">
                  <p className="text-xl text-muted-foreground">
                    {form.getValues("headline") || "Your Professional Headline"}
                  </p>
                  {FieldButtons("headline")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FormField
                    name="headline"
                    control={form.control}
                    render={({ field }) => (
                      <AppFormField>
                        <Input
                          placeholder="e.g., Senior Software Engineer | Full-Stack Developer"
                          {...field}
                          className="text-lg"
                        />
                      </AppFormField>
                    )}
                  />
                  {FieldButtons("headline")}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {!isEditing("email") ? (
              <div className="flex items-center gap-2">
                <MailIcon className="size-4 text-muted-foreground" />
                <span>{form.getValues("email") || "email@example.com"}</span>
                {FieldButtons("email")}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MailIcon className="size-4 text-muted-foreground" />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <AppFormField className="flex-1">
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </AppFormField>
                  )}
                />
                {FieldButtons("email")}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {!isEditing("mobile") ? (
              <div className="flex items-center gap-2">
                <PhoneIcon className="size-4 text-muted-foreground" />
                <span>{form.getValues("mobile") || "+1234567890"}</span>
                {FieldButtons("mobile")}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PhoneIcon className="size-4 text-muted-foreground" />
                <FormField
                  name="mobile"
                  control={form.control}
                  render={({ field }) => (
                    <AppFormField className="flex-1">
                      <Input type="tel" placeholder="+1234567890" {...field} />
                    </AppFormField>
                  )}
                />
                {FieldButtons("mobile")}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {!isEditing("location") ? (
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-4 text-muted-foreground" />
                <span>{form.getValues("location") || "City, Country"}</span>
                {FieldButtons("location")}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-4 text-muted-foreground" />
                <FormField
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <AppFormField className="flex-1">
                      <Input placeholder="City, Country" {...field} />
                    </AppFormField>
                  )}
                />
                {FieldButtons("location")}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {!isEditing("description") ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h5>About</h5>
                {FieldButtons("description")}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {form.getValues("description") ||
                  "Tell us about yourself, your experience, and what you're passionate about..."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">About</h3>
                {FieldButtons("description")}
              </div>
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <AppFormField>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      {...field}
                      rows={6}
                    />
                  </AppFormField>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WorkExperienceSection({
  form,
  setFieldMode,
  isEditing,
  handleCancel,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  isEditing: (s: string) => boolean;
  handleCancel: (removeCallback?: () => void) => void;
  FieldButtons: (s: string, removeCallback?: () => void) => React.ReactNode;
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="size-5" />
            <CardTitle>Work Experience</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              appendWork(getNewWorkExperience());
              setFieldMode(`workExperiences.${workFields.length}`, "create");
            }}
          >
            <PlusIcon />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {workFields?.length ? (
            <AnimatePresence>
              {workFields.map((exp, index: number) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-l-2 border-primary pl-4 space-y-2"
                >
                  {!isEditing(`workExperiences.${index}`) ? (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {form.getValues(`workExperiences.${index}.name`)}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues(`workExperiences.${index}.company`)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {form.getValues(
                              `workExperiences.${index}.location`
                            )}{" "}
                            • {form.getValues(`workExperiences.${index}.type`)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
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
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {FieldButtons(`workExperiences.${index}`)}
                          {RemoveFieldButton(() => removeWork(index))}
                        </div>
                      </div>
                      {form.getValues(
                        `workExperiences.${index}.description`
                      ) && (
                        // <p className="text-sm text-muted-foreground">
                        //   {form.getValues(
                        //     `workExperiences.${index}.description`
                        //   )}
                        // </p>
                        <div
                          className="prose prose-sm max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              form.getValues(
                                `workExperiences.${index}.description`
                              )
                            ),
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Edit Work Experience</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancel(() => removeWork(index))
                            }
                          >
                            <PenOffIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          name={`workExperiences.${index}.name`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Job Title" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`workExperiences.${index}.company`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Company" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`workExperiences.${index}.location`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Location" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`workExperiences.${index}.type`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Employment Type" />
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
                        <FormField
                          name={`workExperiences.${index}.startDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
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
                            <AppFormField>
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
                        <FormField
                          name={`workExperiences.${index}.isCurrent`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <div className="flex items-center gap-3">
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
                                <Label>Currently working here</Label>
                              </div>
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`workExperiences.${index}.description`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No work experience added yet. Click &quot;Add Experience&quot; to
              get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EducationSection({
  form,
  isEditing,
  setFieldMode,
  handleCancel,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateProfileType>;
  isEditing: (s: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  handleCancel: (removeCallback?: () => void) => void;
  FieldButtons: (s: string, removeCallback?: () => void) => React.ReactNode;
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCapIcon className="size-5" />
            <CardTitle>Education</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              appendEducation(getNewEducation());
              setFieldMode(`educations.${educationFields.length}`, "create");
            }}
          >
            <PlusIcon /> Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {educationFields?.length ? (
            <AnimatePresence>
              {educationFields.map((edu, index: number) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-l-2 border-primary pl-4 space-y-2"
                >
                  {!isEditing(`educations.${index}`) ? (
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {form.getValues(`educations.${index}.degree`)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {form.getValues(`educations.${index}.institution`)}
                        </p>
                        {form.getValues(`educations.${index}.location`) && (
                          <p className="text-xs text-muted-foreground">
                            {form.getValues(`educations.${index}.location`)}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatMonth(
                            form.getValues(`educations.${index}.startDate`)
                          )}{" "}
                          -{" "}
                          {form.getValues(`educations.${index}.isCurrent`)
                            ? "Present"
                            : formatMonth(
                                form.getValues(`educations.${index}.endDate`)
                              )}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {FieldButtons(`educations.${index}`)}
                        {RemoveFieldButton(() => removeEducation(index))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Edit Education</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancel(() => removeEducation(index))
                            }
                          >
                            <PenOffIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          name={`educations.${index}.degree`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Degree" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`educations.${index}.institution`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Institution" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`educations.${index}.location`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Location" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`educations.${index}.name`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Field of Study" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`educations.${index}.startDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
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
                            <AppFormField>
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
                        <FormField
                          name={`educations.${index}.isCurrent`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <div className="flex items-center gap-3">
                                <Switch
                                  checked={field.value ?? false}
                                  onCheckedChange={field.onChange}
                                />
                                <Label>Currently studying</Label>
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No education added yet. Click &quot;Add Education&quot; to get
              started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CertificationsSection({
  form,
  isEditing,
  setFieldMode,
  handleCancel,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateProfileType>;
  isEditing: (s: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  handleCancel: (removeCallback?: () => void) => void;
  FieldButtons: (s: string, removeCallback?: () => void) => React.ReactNode;
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AwardIcon className="size-5" />
            <CardTitle>Certifications</CardTitle>
          </div>
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
          >
            <PlusIcon /> Add Certification
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certificationFields?.length ? (
            <AnimatePresence>
              {certificationFields.map((cert, index: number) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b pb-4 last:border-0 space-y-2"
                >
                  {!isEditing(`certifications.${index}`) ? (
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          {form.getValues(`certifications.${index}.name`)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {form.getValues(`certifications.${index}.issuer`)}
                        </p>
                        {form.getValues(
                          `certifications.${index}.credentialId`
                        ) && (
                          <p className="text-xs text-muted-foreground">
                            ID:{" "}
                            {form.getValues(
                              `certifications.${index}.credentialId`
                            )}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatMonth(
                            form.getValues(`certifications.${index}.startDate`)
                          )}
                          {form.getValues(`certifications.${index}.endDate`) &&
                            ` - ${formatMonth(
                              form.getValues(`certifications.${index}.endDate`)
                            )}`}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {FieldButtons(`certifications.${index}`)}
                        {RemoveFieldButton(() => removeCertification(index))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Edit Certification</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancel(() => removeCertification(index))
                            }
                          >
                            <PenOffIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          name={`certifications.${index}.name`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input
                                placeholder="Certification Name"
                                {...field}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`certifications.${index}.issuer`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input
                                placeholder="Issuing Organization"
                                {...field}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`certifications.${index}.startDate`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
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
                            <AppFormField>
                              <MonthPicker
                                selectedMonth={field.value}
                                onMonthSelect={field.onChange}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`certifications.${index}.credentialId`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Credential ID" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`certifications.${index}.url`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Credential URL" {...field} />
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No certifications added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AwardsSection({
  form,
  isEditing,
  setFieldMode,
  handleCancel,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateProfileType>;
  isEditing: (s: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  handleCancel: (removeCallback?: () => void) => void;
  FieldButtons: (s: string, removeCallback?: () => void) => React.ReactNode;
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AwardIcon className="size-5" />
            <CardTitle>Awards & Honors</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              appendAward(getNewAward());
              setFieldMode(`awardOrHonors.${awardsFields.length}`, "create");
            }}
          >
            <PlusIcon /> Add Award
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {awardsFields?.length ? (
            <AnimatePresence>
              {awardsFields.map((award, index: number) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b pb-4 last:border-0 space-y-2"
                >
                  {!isEditing(`awardOrHonors.${index}`) ? (
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          {form.getValues(`awardOrHonors.${index}.name`)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
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
                          <p className="text-sm text-muted-foreground mt-1">
                            {form.getValues(
                              `awardOrHonors.${index}.description`
                            )}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {FieldButtons(`awardOrHonors.${index}`)}
                        {RemoveFieldButton(() => removeAward(index))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Edit Award</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancel(() => removeAward(index))
                            }
                          >
                            <PenOffIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          name={`awardOrHonors.${index}.name`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Award Name" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`awardOrHonors.${index}.institution`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input
                                placeholder="Issuing Organization"
                                {...field}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`awardOrHonors.${index}.description`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Textarea
                                placeholder="Description"
                                {...field}
                                rows={3}
                                className="glass"
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`awardOrHonors.${index}.date`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
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
                            <AppFormField>
                              <Input
                                placeholder="URL"
                                {...field}
                                className="glass"
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No awards or honors added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PublicationsSection({
  form,
  isEditing,
  setFieldMode,
  handleCancel,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateProfileType>;
  isEditing: (s: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  handleCancel: (removeCallback?: () => void) => void;
  FieldButtons: (s: string, removeCallback?: () => void) => React.ReactNode;
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="size-5" />
            <CardTitle>Publications</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              appendPublication(getNewPublication());
              setFieldMode(
                `publications.${publicationFields.length}`,
                "create"
              );
            }}
          >
            <PlusIcon /> Add Publication
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {publicationFields?.length ? (
            <AnimatePresence>
              {publicationFields.map((pub, index: number) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b pb-4 last:border-0 space-y-2"
                >
                  {!isEditing(`publications.${index}`) ? (
                    <div className="flex items-start justify-between">
                      <div className="pl-2">
                        <p className="font-medium text-sm">
                          {form.getValues(`publications.${index}.title`)}
                        </p>
                        {form.getValues(`publications.${index}.date`) && (
                          <p className="text-xs text-muted-foreground">
                            {formatMonth(
                              form.getValues(`publications.${index}.date`)
                            )}
                          </p>
                        )}
                        {form.getValues(`publications.${index}.url`) && (
                          <a
                            href={form.getValues(`publications.${index}.url`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            {form.getValues(`publications.${index}.url`)}
                          </a>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {FieldButtons(`publications.${index}`)}
                        {RemoveFieldButton(() => removePublication(index))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Edit Publication</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancel(() => removePublication(index))
                            }
                          >
                            <PenOffIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          name={`publications.${index}.title`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input
                                placeholder="Publication Title"
                                {...field}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`publications.${index}.date`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
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
                            <AppFormField>
                              <Input placeholder="URL" {...field} />
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No publications added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LanguagesSection({
  form,
  isEditing,
  setFieldMode,
  handleCancel,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateProfileType>;
  isEditing: (s: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  handleCancel: (removeCallback?: () => void) => void;
  FieldButtons: (s: string, removeCallback?: () => void) => React.ReactNode;
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LanguagesIcon className="size-5" />
            <CardTitle>Languages</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              appendLanguage(getNewLanguage());
              setFieldMode(`languages.${languageFields.length}`, "create");
            }}
          >
            <PlusIcon /> Add Language
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {languageFields?.length ? (
            <AnimatePresence>
              {languageFields.map((lang, index: number) => (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b pb-4 last:border-0"
                >
                  {!isEditing(`languages.${index}`) ? (
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        {form.getValues(`languages.${index}.name`)} -{" "}
                        {form.getValues(`languages.${index}.proficiency`)}
                        {form.getValues(`languages.${index}.level`) &&
                          ` (${form.getValues(`languages.${index}.level`)})`}
                      </Badge>
                      <div className="flex gap-1">
                        {FieldButtons(`languages.${index}`)}
                        {RemoveFieldButton(() => removeLanguage(index))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Edit Language</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancel(() => removeLanguage(index))
                            }
                          >
                            <PenOffIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          name={`languages.${index}.name`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Language Name" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`languages.${index}.proficiency`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full glass">
                                  <SelectValue placeholder="Proficiency" />
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
                            <AppFormField>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value ?? undefined}
                              >
                                <SelectTrigger className="w-full glass">
                                  <SelectValue placeholder="CEFR Level (optional)" />
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No languages added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsSection({
  form,
  isEditing,
  setFieldMode,
  handleCancel,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateProfileType>;
  isEditing: (s: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  handleCancel: (removeCallback?: () => void) => void;
  FieldButtons: (s: string, removeCallback?: () => void) => React.ReactNode;
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CodeIcon className="size-5" />
            <CardTitle>Projects</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              appendProject(getNewProject());
              setFieldMode(`projects.${projectFields.length}`, "create");
            }}
          >
            <PlusIcon /> Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projectFields?.length ? (
            <AnimatePresence>
              {projectFields.map((project, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-l-2 border-primary pl-4 space-y-2"
                >
                  {!isEditing(`projects.${index}`) ? (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {form.getValues(`projects.${index}.name`)}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues(
                              `projects.${index}.shortDescription`
                            )}
                          </p>
                          {form.getValues(`projects.${index}.technologies`)
                            ?.length ? (
                            <div className="flex flex-wrap gap-1 mt-2">
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
                            <div className="flex flex-wrap gap-1 mt-1">
                              {form
                                .getValues(`projects.${index}.role`)
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
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatMonth(
                              form.getValues(`projects.${index}.startedAt`)
                            )}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {FieldButtons(`projects.${index}`)}
                          {RemoveFieldButton(() => removeProject(index))}
                        </div>
                      </div>
                      {form.getValues(`projects.${index}.description`) && (
                        <div
                          className="prose prose-sm max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              form.getValues(`projects.${index}.description`) ||
                                ""
                            ),
                          }}
                        />
                      )}
                      <div className="flex gap-2">
                        {form.getValues(`projects.${index}.repositoryUrl`) && (
                          <a
                            href={form.getValues(
                              `projects.${index}.repositoryUrl`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Repository
                          </a>
                        )}
                        {form.getValues(`projects.${index}.liveUrl`) && (
                          <a
                            href={form.getValues(`projects.${index}.liveUrl`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Edit Project</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancel(() => removeProject(index))
                            }
                          >
                            <PenOffIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          name={`projects.${index}.name`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="Project Name" {...field} />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`projects.${index}.shortDescription`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input
                                placeholder="Short Description (1 line)"
                                {...field}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`projects.${index}.description`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
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
                          render={({
                            field: { value, onChange, ...field },
                          }) => (
                            <AppFormField>
                              <Input
                                placeholder="Technologies (comma-separated)"
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
                          render={({
                            field: { value, onChange, ...field },
                          }) => (
                            <AppFormField>
                              <Input
                                placeholder="Roles (comma-separated)"
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
                            <AppFormField>
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
                            <AppFormField>
                              <Input
                                placeholder="Repository URL (optional)"
                                {...field}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`projects.${index}.liveUrl`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input
                                placeholder="Live Demo URL (optional)"
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No projects added yet. Click &quot;Add Project&quot; to get
              started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SocialsSection({
  form,
  isEditing,
  setFieldMode,
  handleCancel,
  FieldButtons,
  RemoveFieldButton,
}: {
  form: UseFormReturn<ClientCreateProfileType>;
  isEditing: (s: string) => boolean;
  setFieldMode: (fieldName: string, mode: "create" | "edit") => void;
  handleCancel: (removeCallback?: () => void) => void;
  FieldButtons: (s: string, removeCallback?: () => void) => React.ReactNode;
  RemoveFieldButton: (fn: () => void) => React.ReactNode;
}) {
  const {
    fields: socialsFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({ control: form.control, name: "socials" });
  const getNewSocial = (): ClientCreateSocialType => ({ name: "", url: "" });
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkIcon className="size-5" />
            <CardTitle>Social Links</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              appendSocial(getNewSocial());
              setFieldMode(`socials.${socialsFields.length}`, "create");
            }}
          >
            <PlusIcon /> Add Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {socialsFields?.length ? (
            <AnimatePresence>
              {socialsFields.map((social, index: number) => (
                <motion.div
                  key={social.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 hover:bg-accent rounded-md space-y-2"
                >
                  {!isEditing(`socials.${index}`) ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="size-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">
                            {form.getValues(`socials.${index}.name`)}
                          </p>
                          <a
                            href={form.getValues(`socials.${index}.url`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            {form.getValues(`socials.${index}.url`)}
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {FieldButtons(`socials.${index}`)}
                        {RemoveFieldButton(() => removeSocial(index))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Edit Social Link</h4>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <CheckIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancel(() => removeSocial(index))
                            }
                          >
                            <PenOffIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <FormField
                          name={`socials.${index}.name`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input
                                placeholder="Platform Name (e.g., LinkedIn, GitHub)"
                                {...field}
                              />
                            </AppFormField>
                          )}
                        />
                        <FormField
                          name={`socials.${index}.url`}
                          control={form.control}
                          render={({ field }) => (
                            <AppFormField>
                              <Input placeholder="URL" {...field} />
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No social links added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfileForm() {
  const { data: profile, CreateProfile } = useProfileQuery();

  // Transform and parse in one step
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

  // small helpers
  const FieldButtons = (fieldName: string, removeCallback?: () => void) => (
    <div className="flex gap-1">
      {!isEditing(fieldName) ? (
        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={() => setEditingField(fieldName)}
        >
          <PenIcon className="h-4 w-4" />
        </Button>
      ) : (
        <>
          <Button
            variant="ghost"
            type="button"
            size="sm"
            onClick={() => form.handleSubmit(handleSave)()}
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            type="button"
            size="sm"
            onClick={() => handleCancel(removeCallback)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );

  const RemoveFieldButton = (onClick: () => void) => (
    <Button
      variant="ghost"
      className="text-destructive hover:text-destructive hover:bg-destructive/20"
      type="button"
      size="sm"
      onClick={() => {
        openDialog({
          title: "Confirm Deletion",
          description:
            "Are you sure you want to delete this item? This action cannot be undone.",
          footer: (
            <Button
              type="button"
              variant="destructive"
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
    >
      <TrashIcon className="h-4 w-4" />
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
      <WorkExperienceSection
        form={form}
        setFieldMode={setFieldMode}
        isEditing={isEditing}
        handleCancel={handleCancel}
        FieldButtons={FieldButtons}
        RemoveFieldButton={RemoveFieldButton}
      />
      <EducationSection
        form={form}
        isEditing={isEditing}
        setFieldMode={setFieldMode}
        handleCancel={handleCancel}
        FieldButtons={FieldButtons}
        RemoveFieldButton={RemoveFieldButton}
      />
      <CertificationsSection
        form={form}
        isEditing={isEditing}
        setFieldMode={setFieldMode}
        handleCancel={handleCancel}
        FieldButtons={FieldButtons}
        RemoveFieldButton={RemoveFieldButton}
      />
      <AwardsSection
        form={form}
        isEditing={isEditing}
        setFieldMode={setFieldMode}
        handleCancel={handleCancel}
        FieldButtons={FieldButtons}
        RemoveFieldButton={RemoveFieldButton}
      />
      <PublicationsSection
        form={form}
        isEditing={isEditing}
        setFieldMode={setFieldMode}
        handleCancel={handleCancel}
        FieldButtons={FieldButtons}
        RemoveFieldButton={RemoveFieldButton}
      />
      <LanguagesSection
        form={form}
        isEditing={isEditing}
        setFieldMode={setFieldMode}
        handleCancel={handleCancel}
        FieldButtons={FieldButtons}
        RemoveFieldButton={RemoveFieldButton}
      />
      <ProjectsSection
        form={form}
        isEditing={isEditing}
        setFieldMode={setFieldMode}
        handleCancel={handleCancel}
        FieldButtons={FieldButtons}
        RemoveFieldButton={RemoveFieldButton}
      />
      <SocialsSection
        form={form}
        isEditing={isEditing}
        setFieldMode={setFieldMode}
        handleCancel={handleCancel}
        FieldButtons={FieldButtons}
        RemoveFieldButton={RemoveFieldButton}
      />
    </AppForm>
  );
}
