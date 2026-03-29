import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import ContributionCard from "@/components/contributions/contribution-card";
import { pagesConfig } from "@/config/pages";
import { getContributions } from "@/lib/queries";

export const metadata: Metadata = {
  title: pagesConfig.contributions.metadata.title,
  description: pagesConfig.contributions.metadata.description,
};

export default async function ContributionsPage() {
  const allContributions = await getContributions();

  return (
    <PageContainer
      title={pagesConfig.contributions.title}
      description={pagesConfig.contributions.description}
    >
      <ContributionCard contributions={allContributions} />
    </PageContainer>
  );
}
