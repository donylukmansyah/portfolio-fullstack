import type { Metadata } from "next";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = { title: "Site Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const data = await db.select().from(siteSettings);

  // Convert array of {key, value} to single object {"title": "...", "description": "..."}
  const settingsMap = data.reduce((acc, current) => {
    acc[current.key] = current.value;
    return acc;
  }, {} as Record<string, string>);

  return <SettingsClient initialData={settingsMap} />;
}
