import { z } from "zod";

/* ─── Contact ─────────────────────────────────────────────── */
export const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  social: z.string().url("Invalid URL").optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactSchema>;

/* ─── Project ─────────────────────────────────────────────── */
export const projectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  companyName: z.string().min(1, "Company name is required"),
  type: z.enum(["Personal", "Professional"]),
  category: z.array(z.string()).min(1, "At least one category required"),
  shortDescription: z.string().min(10).max(500),
  websiteLink: z.string().url().optional().or(z.literal("")),
  githubLink: z.string().url().optional().or(z.literal("")),
  techStack: z.array(z.string()).min(1),
  startDate: z.string().date(),
  endDate: z.string().date(),
  companyLogoImg: z.string().optional().or(z.literal("")),
  descriptionDetails: z.object({
    paragraphs: z.array(z.string()),
    bullets: z.array(z.string()),
  }),
  pagesInfo: z.object({
    title: z.string(),
    description: z.string(),
    imgArr: z.array(z.string()),
  }),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});
export type ProjectInput = z.infer<typeof projectSchema>;

/* ─── Experience ──────────────────────────────────────────── */
export const experienceSchema = z.object({
  slug: z.string().min(1),
  position: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  startDate: z.string().date(),
  endDate: z.string().date().nullable().optional(),
  isCurrent: z.boolean().default(false),
  description: z.array(z.string()),
  achievements: z.array(z.string()),
  skills: z.array(z.string()),
  companyUrl: z.string().url().optional().or(z.literal("")),
  logo: z.string().optional().or(z.literal("")),
  sortOrder: z.number().int().default(0),
});
export type ExperienceInput = z.infer<typeof experienceSchema>;

/* ─── Skill ───────────────────────────────────────────────── */
export const skillSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  iconKey: z.string().min(1),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});
export type SkillInput = z.infer<typeof skillSchema>;

/* ─── Contribution ────────────────────────────────────────── */
export const contributionSchema = z.object({
  repo: z.string().min(1),
  description: z.string().min(1),
  repoOwner: z.string().min(1),
  link: z.string().url(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});
export type ContributionInput = z.infer<typeof contributionSchema>;

/* ─── Social Link ─────────────────────────────────────────── */
export const socialLinkSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  iconKey: z.string().min(1),
  link: z.string().url(),
  sortOrder: z.number().int().default(0),
});
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

/* ─── Site Settings ───────────────────────────────────────── */
export const siteSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});
export type SiteSettingInput = z.infer<typeof siteSettingSchema>;

/* ─── Hero Content ────────────────────────────────────────── */
export const heroContentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be under 1000 characters"),
  image: z.string().optional().or(z.literal("")),
  resume: z.string().optional().or(z.literal("")),
  isActive: z.boolean().default(false),
});
export type HeroContentInput = z.infer<typeof heroContentSchema>;
