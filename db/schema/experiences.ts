import { pgTable, uuid, text, date, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  position: text("position").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // Nullable for "Present"
  isCurrent: boolean("is_current").default(false),
  description: text("description").array().notNull(),
  achievements: text("achievements").array().notNull(),
  skills: text("skills").array().notNull(),
  companyUrl: text("company_url"),
  logo: text("logo"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
