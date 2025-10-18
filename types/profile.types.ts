import { z } from "zod";
import { BaseTimestamps, ObjectIdtoStringSchema } from "./helper.types";
import { ObjectId } from "bson";

// Social Schema
export const SocialSchema = z.object({
    _id: ObjectIdtoStringSchema,
    name: z.string().min(2, "Give this link a name (at least 2 characters) — even pirates need labels!"),
    url: z.string().min(1, "Please paste a URL so the internet knows where to look!"),
});

export const CreateSocialSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "Name it! At least 2 characters — make it snappy."),
    url: z.string().min(1, "URL missing — our crystal ball can't find it without a link."),
});

export const ClientCreateSocialSchema = z.object({
    name: z.string().min(2, "What's this called? (2+ characters please)"),
    url: z.string().min(1, "Drop the URL here so folks can click — don't leave it hanging!"),
});

// Work Experience Schema
export const WorkExperienceSchema = z.object({
    _id: ObjectIdtoStringSchema,
    name: z.string().min(2, "Job title too short — give it some flair (2+ chars)."),
    company: z.string().min(2, "Company name, please. Real or legendary (2+ chars)."),
    location: z.string().optional(),
    type: z.enum(["Full-time", "Part-time", "Freelance", "Internship", "Volunteer", "Contract", "Other"]).optional(),
    description: z.string().optional(),
    startDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Pick a start date — time travel is not supported yet!" }),
    endDate: z.date().optional(),
    isCurrent: z.boolean().optional(),
});

export const CreateWorkExperienceSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "Job title too short — at least 2 characters, please."),
    company: z.string().min(2, "Who employed you? Company name needs 2+ characters."),
    location: z.string().optional(),
    type: z.enum(["Full-time", "Part-time", "Freelance", "Internship", "Volunteer", "Contract", "Other"]).optional(),
    description: z.string().optional(),
    startDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Start date is required — the calendar insists!" }),
    endDate: z.date().optional(),
    isCurrent: z.boolean().optional(),
});

export const ClientCreateWorkExperienceSchema = z.object({
    name: z.string().min(2, "Give the job a proper title (2+ chars) — be proud of it."),
    company: z.string().min(2, "Name the company (2+ chars) — make it real or mythic)."),
    location: z.string().optional(),
    type: z.enum(["Full-time", "Part-time", "Freelance", "Internship", "Volunteer", "Contract", "Other"]).optional(),
    description: z.string().optional(),
    startDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Start date needed — history needs a timestamp!" }),
    endDate: z.date().optional(),
    isCurrent: z.boolean().optional(),
});

// Education Schema
export const EducationSchema = z.object({
    _id: ObjectIdtoStringSchema,
    name: z.string().min(2, "Field of study too short — at least 2 characters, smarty pants."),
    institution: z.string().min(2, "School/Institution needs a name (2+ chars) — diplomas prefer labels."),
    location: z.string().optional(),
    degree: z.string().min(2, "Degree must have a title (e.g., BSc, MSc) — 2+ chars."),
    startDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "When did this scholarly adventure begin? Pick a start date." }),
    endDate: z.date().optional(),
    isCurrent: z.boolean().optional(),
});

export const CreateEducationSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "What's your area of study? (2+ characters will do.)"),
    institution: z.string().min(2, "Institution name please — at least 2 characters."),
    location: z.string().optional(),
    degree: z.string().min(2, "Degree title too tiny — use 2+ characters."),
    startDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Start date required — your academic timeline awaits!" }),
    endDate: z.date().optional(),
    isCurrent: z.boolean().optional(),
});

export const ClientCreateEducationSchema = z.object({
    name: z.string().min(2, "Field of study needs a name (2+ chars) — show off your specialty."),
    institution: z.string().min(2, "Where did you study? Institution name needs 2+ characters."),
    location: z.string().optional(),
    degree: z.string().min(2, "Degree title please (2+ chars) — diplomas like to be named."),
    startDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Please choose a start date — commencement music not included." }),
    endDate: z.date().optional(),
    isCurrent: z.boolean().optional(),
});


// Certification Schema
export const CertificationSchema = z.object({
    _id: ObjectIdtoStringSchema,
    name: z.string().min(2, "Certification name needs at least 2 characters — wear it proudly!"),
    issuer: z.string().min(2, "Who's the issuer? (2+ chars) — we love credible sources."),
    startDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "When did you earn it? Pick a date so we can celebrate." }),
    endDate: z.date().optional(),
    credentialId: z.string().optional(),
    url: z.string().optional(),
});

export const CreateCertificationSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "Certification name too short — give it 2+ characters."),
    issuer: z.string().min(2, "Issuer name needed (2+ chars)."),
    startDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Please add the date you received this certificate." }),
    endDate: z.date().optional(),
    credentialId: z.string().optional(),
    url: z.string().optional(),
});

export const ClientCreateCertificationSchema = z.object({
    name: z.string().min(2, "What's the certification called? (2+ chars)"),
    issuer: z.string().min(2, "Who's the issuer? (2+ chars)"),
    startDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "When did you earn this? Add a date." }),
    endDate: z.date().optional(),
    credentialId: z.string().optional(),
    url: z.string().optional(),
});

// Award or Honor Schema
export const AwardOrHonorSchema = z.object({
    _id: ObjectIdtoStringSchema,
    name: z.string().min(2, "Award name needs at least 2 characters — brag a little!"),
    institution: z.string().min(2, "Who awarded it? Institution name needs 2+ chars."),
    description: z.string().optional(),
    date: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Pick the date of glory — when did this happen?" }),
    url: z.string().optional(),
});

export const CreateAwardOrHonorSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "What's the award called? (2+ chars) — humble brag incoming."),
    institution: z.string().min(2, "Issuer name please (2+ chars)."),
    description: z.string().optional(),
    date: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Please add the date this award was received." }),
    url: z.string().optional(),
});

export const ClientCreateAwardOrHonorSchema = z.object({
    name: z.string().min(2, "Give your award a name (2+ chars) — shine on."),
    institution: z.string().min(2, "Who gave it to you? (2+ chars)."),
    description: z.string().optional(),
    date: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "When did this happen? Add a date." }),
    url: z.string().optional(),
});


// Publication Schema
export const PublicationSchema = z.object({
    _id: ObjectIdtoStringSchema,
    title: z.string().min(2, "Title too short — make your publication proud (2+ chars)."),
    // authors: z.array(z.string().min(2)),
    date: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Pick the publication date so we can cite you properly." }),
    url: z.string().optional(),
});

export const CreatePublicationSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    title: z.string().min(2, "Give it a proper title (2+ chars) — don't be shy."),
    // authors: z.array(z.string().min(2)),
    date: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "When was this published? Add a date." }),
    url: z.string().optional(),
});

export const ClientCreatePublicationSchema = z.object({
    title: z.string().min(2, "Title please (2+ chars) — make it catchy or classy)."),
    // authors: z.array(z.string().min(2)),
    date: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Add a publication date so the bibliography is happy." }),
    url: z.string().optional(),
});


// Language Schema
export const LanguageSchema = z.object({
    _id: ObjectIdtoStringSchema,
    name: z.string().min(2, "Language name needs at least 2 characters — hola, bonjour!"),
    proficiency: z.enum([
        "Beginner",
        "Intermediate",
        "Advanced",
        "Fluent",
        "Native",
    ]),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).nullable().optional(),
    url: z.string().optional(),
});


export const CreateLanguageSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "Name the language (2+ chars) — olá, привет, こんにちは!)."),
    proficiency: z.enum([
        "Beginner",
        "Intermediate",
        "Advanced",
        "Fluent",
        "Native",
    ]),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).nullable().optional(),
    url: z.string().optional(),
});

export const ClientCreateLanguageSchema = z.object({
    name: z.string().min(2, "Language name please (2+ chars) — impress us with polyglot vibes."),
    proficiency: z.enum([
        "Beginner",
        "Intermediate",
        "Advanced",
        "Fluent",
        "Native",
    ]),
    level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).nullable().optional(),
    url: z.string().optional(),
});

export const ProjectSchema = z.object({
    _id: ObjectIdtoStringSchema,
    user_id: ObjectIdtoStringSchema,
    name: z.string().min(1, "Project needs a name — even secret labs have titles."),
    description: z.string().min(1, "Describe your project so mere mortals can understand it."),
    shortDescription: z.string().min(1, "Short description is required — give us the elevator pitch!"),
    technologies: z.array(z.string()).optional(),
    role: z.array(z.string()).optional(),
    repositoryUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    startedAt: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "When did this project start? Add a date so we can timeline it." }),
})

export const CreateProjectSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(1, "Project name please — even tiny experiments deserve a name."),
    description: z.string().min(1, "Tell us about your project — 1 character won't do it, though!"),
    shortDescription: z.string().min(1, "Short description please — keep it snappy."),
    technologies: z.array(z.string()).optional(),
    role: z.array(z.string()).optional(),
    repositoryUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    startedAt: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "Add a start date for the project — history loves dates." }),
})

export const ClientCreateProjectSchema = z.object({
    name: z.string().min(1, "What's this project called? (1+ char is enough to start)"),
    description: z.string().min(1, "Add a description so humans and bots both understand it."),
    shortDescription: z.string().min(1, "Short description needed — pitch it in one line!"),
    technologies: z.array(z.string()).optional(),
    role: z.array(z.string()).optional(),
    repositoryUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    startedAt: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), { message: "When did you kick off this project? Add a date." }),
})

export const ProfileSchema = z.object({
    user_id: ObjectIdtoStringSchema,
    name: z.string().optional(),
    description: z.string().optional(),
    headline: z.string().optional(),
    email: z.email().optional(),
    location: z.string().optional(),
    mobile: z.e164().optional(),
    socials: z.array(SocialSchema).optional(),
    workExperiences: z.array(WorkExperienceSchema).optional(),
    educations: z.array(EducationSchema).optional(),
    roles: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    certifications: z.array(CertificationSchema).optional(),
    awardOrHonors: z.array(AwardOrHonorSchema).optional(),
    publications: z.array(PublicationSchema).optional(),
    languages: z.array(LanguageSchema).optional(),
}).extend(BaseTimestamps.shape);

export const CreateProfileSchema = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    mobile: z.e164().optional(),
    description: z.string().optional(),
    headline: z.string().optional(),
    location: z.string().optional(),
    socials: z.array(CreateSocialSchema).optional(),
    projects: z.array(CreateProjectSchema).optional(),
    workExperiences: z.array(CreateWorkExperienceSchema).optional(),
    educations: z.array(CreateEducationSchema).optional(),
    certifications: z.array(CreateCertificationSchema).optional(),
    awardOrHonors: z.array(CreateAwardOrHonorSchema).optional(),
    publications: z.array(CreatePublicationSchema).optional(),
    languages: z.array(CreateLanguageSchema).optional(),
}).extend(BaseTimestamps.shape);

export const ClientCreateProfileSchema = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    mobile: z.e164().optional(),
    description: z.string().optional(),
    headline: z.string().optional(),
    location: z.string().optional(),
    socials: z.array(ClientCreateSocialSchema).optional(),
    projects: z.array(ClientCreateProjectSchema).optional(),
    workExperiences: z.array(ClientCreateWorkExperienceSchema).optional(),
    educations: z.array(ClientCreateEducationSchema).optional(),
    certifications: z.array(ClientCreateCertificationSchema).optional(),
    awardOrHonors: z.array(ClientCreateAwardOrHonorSchema).optional(),
    publications: z.array(ClientCreatePublicationSchema).optional(),
    languages: z.array(ClientCreateLanguageSchema).optional(),
})

export type SocialType = z.infer<typeof SocialSchema>;
export type WorkExperienceType = z.infer<typeof WorkExperienceSchema>;
export type EducationType = z.infer<typeof EducationSchema>;
export type CertificationType = z.infer<typeof CertificationSchema>;
export type AwardOrHonorType = z.infer<typeof AwardOrHonorSchema>;
export type PublicationType = z.infer<typeof PublicationSchema>;
export type LanguageType = z.infer<typeof LanguageSchema>;
export type ProfileType = z.infer<typeof ProfileSchema>;
export type CreateProfileType = z.infer<typeof CreateProfileSchema>;
export type ProjectType = z.infer<typeof ProjectSchema>;
export type CreateProjectType = z.infer<typeof CreateProjectSchema>;

// client types
export type ClientCreateSocialType = z.infer<typeof ClientCreateSocialSchema>;
export type ClientCreateWorkExperienceType = z.infer<typeof ClientCreateWorkExperienceSchema>;
export type ClientCreateEducationType = z.infer<typeof ClientCreateEducationSchema>;
export type ClientCreateCertificationType = z.infer<typeof ClientCreateCertificationSchema>;
export type ClientCreateAwardOrHonorType = z.infer<typeof ClientCreateAwardOrHonorSchema>;
export type ClientCreatePublicationType = z.infer<typeof ClientCreatePublicationSchema>;
export type ClientCreateLanguageType = z.infer<typeof ClientCreateLanguageSchema>;
export type ClientCreateProfileType = z.infer<typeof ClientCreateProfileSchema>;    