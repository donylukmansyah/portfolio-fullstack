import { z } from "zod";
import {
  isBlogContentDocument,
  normalizeBlogSlug,
} from "./blog-editor-config";

const optionalMediaField = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/") ||
      /^https?:\/\//.test(value),
    "Must be a valid URL or root-relative path"
  )
  .optional()
  .or(z.literal(""));

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

/* ─── Blog ────────────────────────────────────────────────── */
export const blogSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .transform(normalizeBlogSlug)
    .refine(
      (value) => /^[a-z0-9-]+$/.test(value),
      "Slug must be lowercase with hyphens only"
    ),
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(160, "Title must be under 160 characters"),
  excerpt: z
    .string()
    .trim()
    .min(20, "Excerpt must be at least 20 characters")
    .max(320, "Excerpt must be under 320 characters"),
  tags: z
    .array(z.string().trim().min(1).max(50))
    .max(12, "Keep tags to 12 or fewer")
    .transform((tags) => Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)))),
  coverImageUrl: optionalMediaField,
  coverImagePublicId: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
  contentJson: z.custom(
    (value) => isBlogContentDocument(value),
    "Blog content is required"
  ),
  seoTitle: z
    .string()
    .trim()
    .max(160, "SEO title must be under 160 characters")
    .optional()
    .or(z.literal("")),
  seoDescription: z
    .string()
    .trim()
    .max(320, "SEO description must be under 320 characters")
    .optional()
    .or(z.literal("")),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});
export type BlogInput = z.infer<typeof blogSchema>;
