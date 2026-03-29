import { pgTable, uuid, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description").notNull(),
  rating: integer("rating").notNull(), // 1-5
  iconKey: text("icon_key").notNull(),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
