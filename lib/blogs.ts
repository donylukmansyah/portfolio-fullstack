import type { JSONContent } from "@tiptap/core";

import type { AdminBlogFormData } from "./blog-form";
import { EMPTY_BLOG_CONTENT } from "./blog-editor-config";
import {
  getBlogById as getBlogByIdQuery,
  getFeaturedBlogs as getFeaturedBlogsQuery,
  getPublishedBlogBySlug,
  getPublishedBlogs,
} from "./queries";

export interface BlogFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  coverImage?: string;
  readingTime?: number;
  featured?: boolean;
  updatedAt?: string;
}

export interface BlogMeta extends BlogFrontmatter {
  id: string;
  slug: string;
}

export interface BlogPost extends BlogMeta {
  contentHtml: string;
}

type PublishedBlogRecord = Awaited<ReturnType<typeof getPublishedBlogs>>[number];
type AdminBlogRecord = NonNullable<Awaited<ReturnType<typeof getBlogByIdQuery>>>;

function getBlogPrimaryDate(blog: {
  publishedAt: Date | null;
  createdAt: Date;
}) {
  return blog.publishedAt ?? blog.createdAt;
}

export function mapBlogMeta(blog: PublishedBlogRecord): BlogMeta {
  const publishedAt = getBlogPrimaryDate(blog);

  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    date: new Date(publishedAt).toISOString(),
    description: blog.excerpt,
    tags: blog.tags,
    coverImage: blog.coverImageUrl || undefined,
    readingTime: blog.readingTime,
    featured: blog.isFeatured,
    updatedAt: new Date(blog.updatedAt).toISOString(),
  };
}

export function mapBlogPost(
  blog: NonNullable<Awaited<ReturnType<typeof getPublishedBlogBySlug>>>
): BlogPost {
  return {
    ...mapBlogMeta(blog),
    contentHtml: blog.contentHtml,
  };
}

export function mapAdminBlogFormData(blog: AdminBlogRecord): AdminBlogFormData {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    tags: blog.tags,
    coverImageUrl: blog.coverImageUrl || "",
    coverImagePublicId: blog.coverImagePublicId || "",
    status: blog.status,
    contentJson: (blog.contentJson as JSONContent) || EMPTY_BLOG_CONTENT,
    seoTitle: blog.seoTitle || "",
    seoDescription: blog.seoDescription || "",
    isFeatured: blog.isFeatured,
    sortOrder: blog.sortOrder,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    readingTime: blog.readingTime,
  };
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getPublishedBlogs();
  return posts.map((post) => post.slug);
}

export async function getAllBlogsMeta(): Promise<BlogMeta[]> {
  const posts = await getPublishedBlogs();
  return posts.map(mapBlogMeta);
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const post = await getPublishedBlogBySlug(slug);

  if (!post) {
    throw new Error("Blog post not found");
  }

  return mapBlogPost(post);
}

export async function getFeaturedBlogs(): Promise<BlogMeta[]> {
  const posts = await getFeaturedBlogsQuery();
  return posts.map(mapBlogMeta);
}

export async function getAdminBlogFormData(id: string) {
  const blog = await getBlogByIdQuery(id);
  return blog ? mapAdminBlogFormData(blog) : null;
}
