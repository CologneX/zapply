import { BaseTimestamps, ObjectIdtoStringSchema, DateToStringSchema } from "./helper.types";
import { z } from "zod";
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
    startDate: DateToStringSchema,
    endDate: DateToStringSchema.optional(),
    isCurrent: z.boolean().optional(),
});

export const CreateWorkExperienceSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "Job title too short — at least 2 characters, please."),
    company: z.string().min(2, "Who employed you? Company name needs 2+ characters."),
    location: z.string().optional(),
    type: z.enum(["Full-time", "Part-time", "Freelance", "Internship", "Volunteer", "Contract", "Other"]).optional(),
    description: z.string().optional(),
    startDate: DateToStringSchema,
    endDate: DateToStringSchema.optional(),
    isCurrent: z.boolean().optional(),
});

export const ClientCreateWorkExperienceSchema = z.object({
    name: z.string().min(2, "Give the job a proper title (2+ chars) — be proud of it."),
    company: z.string().min(2, "Name the company (2+ chars) — make it real or mythic)."),
    location: z.string().optional(),
    type: z.enum(["Full-time", "Part-time", "Freelance", "Internship", "Volunteer", "Contract", "Other"]).optional(),
    description: z.string().optional(),
    startDate: z.date(),
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
    startDate: DateToStringSchema,
    endDate: DateToStringSchema.optional(),
    isCurrent: z.boolean().optional(),
});

export const CreateEducationSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "What's your area of study? (2+ characters will do.)"),
    institution: z.string().min(2, "Institution name please — at least 2 characters."),
    location: z.string().optional(),
    degree: z.string().min(2, "Degree title too tiny — use 2+ characters."),
    startDate: DateToStringSchema,
    endDate: DateToStringSchema.optional(),
    isCurrent: z.boolean().optional(),
});

export const ClientCreateEducationSchema = z.object({
    name: z.string().min(2, "Field of study needs a name (2+ chars) — show off your specialty."),
    institution: z.string().min(2, "Where did you study? Institution name needs 2+ characters."),
    location: z.string().optional(),
    degree: z.string().min(2, "Degree title please (2+ chars) — diplomas like to be named."),
    startDate: z.date(),
    endDate: z.date().optional(),
    isCurrent: z.boolean().optional(),
});


// Certification Schema
export const CertificationSchema = z.object({
    _id: ObjectIdtoStringSchema,
    name: z.string().min(2, "Certification name needs at least 2 characters — wear it proudly!"),
    issuer: z.string().min(2, "Who's the issuer? (2+ chars) — we love credible sources."),
    startDate: DateToStringSchema,
    endDate: DateToStringSchema.optional(),
    credentialId: z.string().optional(),
    url: z.string().optional(),
});

export const CreateCertificationSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "Certification name too short — give it 2+ characters."),
    issuer: z.string().min(2, "Issuer name needed (2+ chars)."),
    startDate: DateToStringSchema,
    endDate: DateToStringSchema.optional(),
    credentialId: z.string().optional(),
    url: z.string().optional(),
});

export const ClientCreateCertificationSchema = z.object({
    name: z.string().min(2, "What's the certification called? (2+ chars)"),
    issuer: z.string().min(2, "Who's the issuer? (2+ chars)"),
    startDate: z.date(),
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
    date: DateToStringSchema,
    url: z.string().optional(),
});

export const CreateAwardOrHonorSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    name: z.string().min(2, "What's the award called? (2+ chars) — humble brag incoming."),
    institution: z.string().min(2, "Issuer name please (2+ chars)."),
    description: z.string().optional(),
    date: DateToStringSchema,
    url: z.string().optional(),
});

export const ClientCreateAwardOrHonorSchema = z.object({
    name: z.string().min(2, "Give your award a name (2+ chars) — shine on."),
    institution: z.string().min(2, "Who gave it to you? (2+ chars)."),
    description: z.string().optional(),
    date: z.date(),
    url: z.string().optional(),
});


// Publication Schema
export const PublicationSchema = z.object({
    _id: ObjectIdtoStringSchema,
    title: z.string().min(2, "Title too short — make your publication proud (2+ chars)."),
    // authors: z.array(z.string().min(2)),
    date: DateToStringSchema,
    url: z.string().optional(),
});

export const CreatePublicationSchema = z.object({
    _id: z.custom<ObjectId>().default(() => new ObjectId()).optional(),
    title: z.string().min(2, "Give it a proper title (2+ chars) — don't be shy."),
    // authors: z.array(z.string().min(2)),
    date: DateToStringSchema,
    url: z.string().optional(),
});

export const ClientCreatePublicationSchema = z.object({
    title: z.string().min(2, "Title please (2+ chars) — make it catchy or classy)."),
    // authors: z.array(z.string().min(2)),
    date: z.date(),
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
    // user_id: ObjectIdtoStringSchema,
    name: z.string().min(1, "Project needs a name — even secret labs have titles."),
    description: z.string().min(1, "Describe your project so mere mortals can understand it."),
    shortDescription: z.string().min(1, "Short description is required — give us the elevator pitch!"),
    technologies: z.array(z.string()).optional(),
    role: z.array(z.string()).optional(),
    repositoryUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    startedAt: z.date(),
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
    startedAt: z.date()
})

export const ClientCreateProjectSchema = z.object({
    name: z.string().min(1, "What's this project called? (1+ char is enough to start)"),
    description: z.string().min(1, "Add a description so humans and bots both understand it."),
    shortDescription: z.string().min(1, "Short description needed — pitch it in one line!"),
    technologies: z.array(z.string()).optional(),
    role: z.array(z.string()).optional(),
    repositoryUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    startedAt: z.date(),
})

export const ProfileSchema = z.object({
    // user_id: ObjectIdtoStringSchema,
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
    projects: z.array(ProjectSchema).optional(),
}).extend(BaseTimestamps.shape);

export const CreateProfileSchema = z.object({
    name: z.string(),
    email: z.email(),
    mobile: z.e164(),
    description: z.string(),
    headline: z.string(),
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
export type ClientCreateProjectType = z.infer<typeof ClientCreateProjectSchema>;
export type ClientCreateProfileType = z.infer<typeof ClientCreateProfileSchema>;

// ...existing schemas...

// Add a transformation schema that converts server types to client types
export const ProfileToClientCreateProfileSchema = ProfileSchema.transform((profile) => ({
    name: profile.name,
    email: profile.email,
    mobile: profile.mobile,
    description: profile.description,
    headline: profile.headline,
    location: profile.location,
    socials: profile.socials?.map((social) => ({
        name: social.name,
        url: social.url,
    })),
    workExperiences: profile.workExperiences?.map((exp) => ({
        name: exp.name,
        company: exp.company,
        location: exp.location,
        type: exp.type,
        description: exp.description,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
        isCurrent: exp.isCurrent,
    })),
    educations: profile.educations?.map((edu) => ({
        name: edu.name,
        institution: edu.institution,
        location: edu.location,
        degree: edu.degree,
        startDate: new Date(edu.startDate),
        endDate: edu.endDate ? new Date(edu.endDate) : undefined,
        isCurrent: edu.isCurrent,
    })),
    certifications: profile.certifications?.map((cert) => ({
        name: cert.name,
        issuer: cert.issuer,
        credentialId: cert.credentialId,
        url: cert.url,
        startDate: new Date(cert.startDate),
        endDate: cert.endDate ? new Date(cert.endDate) : undefined,
    })),
    awardOrHonors: profile.awardOrHonors?.map((award) => ({
        name: award.name,
        institution: award.institution,
        description: award.description,
        date: new Date(award.date),
        url: award.url,
    })),
    publications: profile.publications?.map((pub) => ({
        title: pub.title,
        date: new Date(pub.date),
        url: pub.url,
    })),
    languages: profile.languages?.map((lang) => ({
        name: lang.name,
        proficiency: lang.proficiency,
        level: lang.level,
    })),
    projects: profile.projects?.map((proj) => ({
        name: proj.name,
        description: proj.description,
        shortDescription: proj.shortDescription,
        technologies: proj.technologies,
        role: proj.role,
        repositoryUrl: proj.repositoryUrl,
        liveUrl: proj.liveUrl,
        startedAt: new Date(proj.startedAt),
    })),
})) as unknown as z.ZodType<ClientCreateProfileType>;