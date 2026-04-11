import type { Metadata } from "next";
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { desc } from "drizzle-orm";
import { CertificatesClient } from "./certificates-client";

export const metadata: Metadata = { title: "Certificates" };
export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const data = await db
    .select()
    .from(certificates)
    .orderBy(desc(certificates.sortOrder), desc(certificates.createdAt));

  return <CertificatesClient initialData={data} />;
}
