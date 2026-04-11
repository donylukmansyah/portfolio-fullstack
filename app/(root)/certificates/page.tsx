import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import CertificateCard from "@/components/certificates/certificate-card";
import { pagesConfig } from "@/config/pages";
import { getCertificates } from "@/lib/queries";

export const metadata: Metadata = {
  title: pagesConfig.certificates.metadata.title,
  description: pagesConfig.certificates.metadata.description,
};

export default async function CertificatesPage() {
  const allCertificates = await getCertificates();

  return (
    <PageContainer
      title={pagesConfig.certificates.title}
      description={pagesConfig.certificates.description}
    >
      <CertificateCard certificates={allCertificates} />
    </PageContainer>
  );
}
