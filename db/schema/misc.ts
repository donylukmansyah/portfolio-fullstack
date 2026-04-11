import { pgTable, uuid, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const certificates = pgTable("certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  issuer: text("issuer").notNull(),
  imageUrl: text("image_url"),
  imagePublicId: text("image_public_id"),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const socialLinks = pgTable("social_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  iconKey: text("icon_key").notNull(),
  link: text("link").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  social: text("social"),
  ipAddress: text("ip_address"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").unique().notNull(), // site_name, resume_link, og_image
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const heroContent = pgTable("hero_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  resume: text("resume"),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
