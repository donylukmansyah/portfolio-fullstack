import { pgTable, uuid, text, date, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  companyName: text("company_name").notNull(),
  type: text("type").notNull(), // "Personal" | "Professional"
  category: text("category").array().notNull(),
  shortDescription: text("short_description").notNull(),
  websiteLink: text("website_link"),
  githubLink: text("github_link"),
  techStack: text("tech_stack").array().notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  companyLogoImg: text("company_logo_img"),
  descriptionDetails: jsonb("description_details").notNull(), // { paragraphs: string[], bullets: string[] }
  pagesInfo: jsonb("pages_info").notNull(), // { title: string, description: string, imgArr: string[] }
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
