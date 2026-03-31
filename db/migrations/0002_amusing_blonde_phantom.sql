CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"cover_image_url" text,
	"cover_image_public_id" text,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"content_json" jsonb NOT NULL,
	"content_html" text NOT NULL,
	"content_text" text NOT NULL,
	"reading_time" integer DEFAULT 1 NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" text,
	"seo_description" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "hero_content" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "hero_content" ADD COLUMN "resume" text;--> statement-breakpoint
CREATE INDEX "blogs_status_published_at_idx" ON "blogs" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "blogs_featured_idx" ON "blogs" USING btree ("is_featured");