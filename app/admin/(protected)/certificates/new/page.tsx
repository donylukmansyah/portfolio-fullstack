import type { Metadata } from "next";
import { CertificateForm } from "@/components/admin/certificate-form";

export const metadata: Metadata = { title: "Add Certificate" };

export default function NewCertificatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Certificate</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tambahkan sertifikat baru ke portfolio.
        </p>
      </div>
      <CertificateForm />
    </div>
  );
}
