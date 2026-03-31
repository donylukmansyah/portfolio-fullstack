import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { blogs } from "@/db/schema";

import { prepareStoredBlogContent } from "./blog-content";
import { blogSchema, type BlogInput } from "./validations";

type BlogRecord = typeof blogs.$inferSelect;

export const BLOG_SLUG_IN_USE_ERROR = {
  formErrors: ["Slug is already in use"],
  fieldErrors: { slug: ["Slug is already in use"] },
} as const;

export function parseBlogInput(payload: unknown) {
  return blogSchema.safeParse(payload);
}

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function resolvePublishedAt(
  status: BlogInput["status"],
  currentPublishedAt: Date | null
) {
  if (status !== "published") {
    return currentPublishedAt;
  }

  return currentPublishedAt ?? new Date();
}

function buildBlogValues(input: BlogInput, currentBlog?: BlogRecord) {
  const storedContent = prepareStoredBlogContent(input.contentJson);

  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    tags: input.tags,
    coverImageUrl: normalizeOptionalText(input.coverImageUrl),
    coverImagePublicId: normalizeOptionalText(input.coverImagePublicId),
    status: input.status,
    seoTitle: normalizeOptionalText(input.seoTitle),
    seoDescription: normalizeOptionalText(input.seoDescription),
    isFeatured: input.isFeatured,
    sortOrder: input.sortOrder,
    publishedAt: resolvePublishedAt(
      input.status,
      currentBlog?.publishedAt ?? null
    ),
    ...storedContent,
  };
}

function revalidateBlogPaths(...slugs: Array<string | null | undefined>) {
  revalidatePath("/");
  revalidatePath("/blogs");

  for (const slug of slugs) {
    if (slug) {
      revalidatePath(`/blogs/${slug}`);
    }
  }

  revalidateTag("blogs", "max");
}

async function findBlogById(id: string) {
  const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  return blog ?? null;
}

async function assertUniqueSlug(slug: string, currentId?: string) {
  const [existing] = await db
    .select({ id: blogs.id })
    .from(blogs)
    .where(eq(blogs.slug, slug))
    .limit(1);

  if (existing && existing.id !== currentId) {
    throw new Error("BLOG_SLUG_CONFLICT");
  }
}

export async function createBlog(input: BlogInput) {
  await assertUniqueSlug(input.slug);

  const [created] = await db
    .insert(blogs)
    .values(buildBlogValues(input))
    .returning();

  revalidateBlogPaths(created.slug);

  return created;
}

export async function updateBlog(id: string, input: BlogInput) {
  const currentBlog = await findBlogById(id);

  if (!currentBlog) {
    return null;
  }

  await assertUniqueSlug(input.slug, id);

  const [updated] = await db
    .update(blogs)
    .set({
      ...buildBlogValues(input, currentBlog),
      updatedAt: new Date(),
    })
    .where(eq(blogs.id, id))
    .returning();

  revalidateBlogPaths(currentBlog.slug, updated.slug);

  return updated;
}

export async function deleteBlog(id: string) {
  const existing = await findBlogById(id);

  if (!existing) {
    return null;
  }

  await db.delete(blogs).where(eq(blogs.id, id));

  revalidateBlogPaths(existing.slug);

  return existing;
}
