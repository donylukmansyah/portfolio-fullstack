import type { Metadata } from "next";
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CertificateForm } from "@/components/admin/certificate-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit Certificate" };

interface EditCertificatePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCertificatePage({ params }: EditCertificatePageProps) {
  const { id } = await params;
  
  const [certificate] = await db.select().from(certificates).where(eq(certificates.id, id));
  
  if (!certificate) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Certificate</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Perbarui detail sertifikat.
        </p>
      </div>
      <CertificateForm initialData={certificate as any} />
    </div>
  );
}
