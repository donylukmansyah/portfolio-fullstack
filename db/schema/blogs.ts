import type { JSONContent } from "@tiptap/core";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const blogStatusEnum = pgEnum("blog_status", ["draft", "published"]);

export const blogs = pgTable(
  "blogs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").unique().notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
    coverImageUrl: text("cover_image_url"),
    coverImagePublicId: text("cover_image_public_id"),
    status: blogStatusEnum("status").default("draft").notNull(),
    contentJson: jsonb("content_json").$type<JSONContent>().notNull(),
    contentHtml: text("content_html").notNull(),
    contentText: text("content_text").notNull(),
    readingTime: integer("reading_time").default(1).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    isFeatured: boolean("is_featured").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    statusPublishedAtIdx: index("blogs_status_published_at_idx").on(
      table.status,
      table.publishedAt
    ),
    featuredIdx: index("blogs_featured_idx").on(table.isFeatured),
  })
);
