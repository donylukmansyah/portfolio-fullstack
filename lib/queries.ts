import "server-only";

import { db } from "@/db";
import {
  blogs,
  contributions,
  experiences,
  heroContent,
  projects,
  siteSettings,
  skills,
  socialLinks,
} from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

function isMissingBlogsTableError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? error.code : undefined;
  const message = "message" in error ? String(error.message) : "";
  const cause =
    "cause" in error ? (error.cause as unknown) : undefined;

  return (
    code === "42P01" ||
    message.includes('relation "blogs" does not exist') ||
    isMissingBlogsTableError(cause)
  );
}

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

export const getProjectBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
      return project ?? null;
    },
    [`project-by-slug-${slug}`],
    { tags: ["projects"], revalidate: 3600 }
  )();
};

/* ─── Blogs ────────────────────────────────────────────────── */
export const getPublishedBlogs = unstable_cache(
  async () => {
    try {
      return await db
        .select()
        .from(blogs)
        .where(eq(blogs.status, "published"))
        .orderBy(
          desc(blogs.publishedAt),
          asc(blogs.sortOrder),
          desc(blogs.createdAt)
        );
    } catch (error) {
      if (isMissingBlogsTableError(error)) {
        return [];
      }

      throw error;
    }
  },
  ["published-blogs"],
  { tags: ["blogs"], revalidate: 3600 }
);

export const getFeaturedBlogs = unstable_cache(
  async () => {
    try {
      const featured = await db
        .select()
        .from(blogs)
        .where(and(eq(blogs.status, "published"), eq(blogs.isFeatured, true)))
        .orderBy(asc(blogs.sortOrder), desc(blogs.publishedAt))
        .limit(3);

      if (featured.length > 0) {
        return featured;
      }

      return await db
        .select()
        .from(blogs)
        .where(eq(blogs.status, "published"))
        .orderBy(desc(blogs.publishedAt), asc(blogs.sortOrder))
        .limit(3);
    } catch (error) {
      if (isMissingBlogsTableError(error)) {
        return [];
      }

      throw error;
    }
  },
  ["featured-blogs"],
  { tags: ["blogs"], revalidate: 3600 }
);

export const getPublishedBlogBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      try {
        const [blog] = await db
          .select()
          .from(blogs)
          .where(and(eq(blogs.slug, slug), eq(blogs.status, "published")))
          .limit(1);
        return blog ?? null;
      } catch (error) {
        if (isMissingBlogsTableError(error)) {
          return null;
        }

        throw error;
      }
    },
    [`published-blog-by-slug-${slug}`],
    { tags: ["blogs"], revalidate: 3600 }
  )();
};

export async function getAdminBlogs() {
  try {
    return await db
      .select()
      .from(blogs)
      .orderBy(desc(blogs.updatedAt), desc(blogs.createdAt));
  } catch (error) {
    if (isMissingBlogsTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getBlogById(id: string) {
  try {
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    return blog ?? null;
  } catch (error) {
    if (isMissingBlogsTableError(error)) {
      return null;
    }

    throw error;
  }
}

/* ─── Experiences ──────────────────────────────────────────── */
export const getExperiences = unstable_cache(
  async () => {
    return db.select().from(experiences).orderBy(asc(experiences.sortOrder), desc(experiences.startDate));
  },
  ["all-experiences"],
  { tags: ["experiences"], revalidate: 3600 }
);

export const getExperienceBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      const [exp] = await db.select().from(experiences).where(eq(experiences.slug, slug));
      return exp ?? null;
    },
    [`experience-by-slug-${slug}`],
    { tags: ["experiences"], revalidate: 3600 }
  )();
};

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
