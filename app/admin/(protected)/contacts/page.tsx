import type { Metadata } from "next";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ContactsClient } from "./contacts-client";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const messages = await db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt));

  return <ContactsClient initialData={messages} />;
}
