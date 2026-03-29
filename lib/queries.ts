import { db } from "@/db";
import { projects, experiences, skills, contributions, socialLinks, siteSettings, heroContent } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

/* ─── Projects ─────────────────────────────────────────────── */
export const getProjects = unstable_cache(
  async () => {
    return db.select().from(projects).orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  },
  ["all-projects"],
  { tags: ["projects"], revalidate: 3600 }
);

export const getFeaturedProjects = unstable_cache(
  async () => {
    return db.select().from(projects).where(eq(projects.isFeatured, true)).orderBy(asc(projects.sortOrder));
  },
  ["featured-projects"],
  { tags: ["projects"], revalidate: 3600 }
);

export const getProjectBySlug = unstable_cache(
  async (slug: string) => {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
    return project ?? null;
  },
  ["project-by-slug"],
  { tags: ["projects"], revalidate: 3600 }
);

/* ─── Experiences ──────────────────────────────────────────── */
export const getExperiences = unstable_cache(
  async () => {
    return db.select().from(experiences).orderBy(asc(experiences.sortOrder), desc(experiences.startDate));
  },
  ["all-experiences"],
  { tags: ["experiences"], revalidate: 3600 }
);

export const getExperienceBySlug = unstable_cache(
  async (slug: string) => {
    const [exp] = await db.select().from(experiences).where(eq(experiences.slug, slug));
    return exp ?? null;
  },
  ["experience-by-slug"],
  { tags: ["experiences"], revalidate: 3600 }
);

/* ─── Skills ───────────────────────────────────────────────── */
export const getSkills = unstable_cache(
  async () => {
    return db.select().from(skills).orderBy(desc(skills.rating), asc(skills.sortOrder));
  },
  ["all-skills"],
  { tags: ["skills"], revalidate: 3600 }
);

export const getFeaturedSkills = unstable_cache(
  async () => {
    return db.select().from(skills).where(eq(skills.isFeatured, true)).orderBy(desc(skills.rating));
  },
  ["featured-skills"],
  { tags: ["skills"], revalidate: 3600 }
);

/* ─── Contributions ────────────────────────────────────────── */
export const getContributions = unstable_cache(
  async () => {
    return db.select().from(contributions).orderBy(asc(contributions.sortOrder), desc(contributions.createdAt));
  },
  ["all-contributions"],
  { tags: ["contributions"], revalidate: 3600 }
);

export const getFeaturedContributions = unstable_cache(
  async () => {
    return db.select().from(contributions).where(eq(contributions.isFeatured, true)).orderBy(asc(contributions.sortOrder));
  },
  ["featured-contributions"],
  { tags: ["contributions"], revalidate: 3600 }
);

/* ─── Social Links ─────────────────────────────────────────── */
export const getSocialLinks = unstable_cache(
  async () => {
    return db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder));
  },
  ["social-links"],
  { tags: ["social-links"], revalidate: 3600 }
);

/* ─── Site Settings ────────────────────────────────────────── */
export const getSiteSettings = unstable_cache(
  async () => {
    const rows = await db.select().from(siteSettings);
    return rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);
  },
  ["site-settings"],
  { tags: ["site-settings"], revalidate: 3600 }
);

/* ─── Hero Content ─────────────────────────────────────────── */
export const getActiveHero = unstable_cache(
  async () => {
    const [hero] = await db
      .select()
      .from(heroContent)
      .where(eq(heroContent.isActive, true))
      .limit(1);
    return hero ?? null;
  },
  ["active-hero"],
  { tags: ["hero-content"], revalidate: 3600 }
);

