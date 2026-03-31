import "dotenv/config";

import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { eq } from "drizzle-orm";
import { generateJSON } from "@tiptap/html/server";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import { db } from "../db";
import { blogs } from "../db/schema";
import {
  blogContentExtensions,
  normalizeBlogSlug,
} from "../lib/blog-editor-config";
import {
  prepareStoredBlogContent,
} from "../lib/blog-content";

const BLOGS_DIR = path.join(process.cwd(), "content/blogs");

interface LegacyFrontmatter {
  title?: string;
  date?: string;
  description?: string;
  tags?: string[];
  coverImage?: string;
  featured?: boolean;
}

async function markdownToHtml(markdown: string) {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return processed.toString();
}

async function main() {
  if (!fs.existsSync(BLOGS_DIR)) {
    console.log("No content/blogs directory found. Nothing to import.");
    return;
  }

  const files = fs.readdirSync(BLOGS_DIR).filter((file) => file.endsWith(".md"));

  if (files.length === 0) {
    console.log("No markdown blog files found. Nothing to import.");
    return;
  }

  for (const fileName of files) {
    const filePath = path.join(BLOGS_DIR, fileName);
    const slug = normalizeBlogSlug(fileName.replace(/\.md$/, ""));
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = data as LegacyFrontmatter;

    const html = await markdownToHtml(content);
    const contentJson = generateJSON(html, blogContentExtensions);
    const storedContent = prepareStoredBlogContent(contentJson);
    const publishedAt = frontmatter.date ? new Date(frontmatter.date) : new Date();
    const excerpt =
      frontmatter.description ||
      storedContent.contentText.slice(0, 240).trim() ||
      "Imported from the legacy Markdown blog collection.";

    const values = {
      slug,
      title: frontmatter.title || slug,
      excerpt,
      tags: frontmatter.tags || [],
      coverImageUrl: frontmatter.coverImage || null,
      coverImagePublicId: null,
      status: "published" as const,
      seoTitle: frontmatter.title || slug,
      seoDescription: excerpt,
      isFeatured: Boolean(frontmatter.featured),
      sortOrder: 0,
      publishedAt,
      updatedAt: publishedAt,
      ...storedContent,
    };

    const [existing] = await db
      .select({ id: blogs.id })
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1);

    if (existing) {
      await db.update(blogs).set(values).where(eq(blogs.id, existing.id));
      console.log(`Updated ${slug}`);
    } else {
      await db.insert(blogs).values(values);
      console.log(`Imported ${slug}`);
    }
  }

  console.log(`Imported ${files.length} blog file(s).`);
}

main().catch((error) => {
  console.error("Blog import failed:", error);
  process.exit(1);
});
