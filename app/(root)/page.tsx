import { Metadata } from "next";
import Script from "next/script";

import BlogCard from "@/components/blogs/blog-card";
import { AnimatedSection } from "@/components/common/animated-section";
import { ClientPageWrapper } from "@/components/common/client-page-wrapper";
import CertificateCard from "@/components/certificates/certificate-card";
import ExperienceCard from "@/components/experience/experience-card";
import { HomeHero } from "@/components/home/home-hero";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { HomeViewAll } from "@/components/home/home-view-all";
import ProjectCard from "@/components/projects/project-card";
import SkillsCard from "@/components/skills/skills-card";
import { pagesConfig } from "@/config/pages";
import { siteConfig } from "@/config/site";
import { buildHomeStructuredData, resolveHomeHero } from "@/lib/home-page";
import {
  getFeaturedProjects,
  getExperiences,
  getFeaturedCertificates,
  getFeaturedSkills,
  getActiveHero,
} from "@/lib/queries";
import { getFeaturedBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: `${pagesConfig.home.metadata.title}`,
  description:
    "Dony L - Portfolio website. Explore my projects, experience, and contributions.",
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function IndexPage() {
  const [
    featuredProjects,
    allExperiences,
    featuredCertificates,
    featuredSkills,
    heroData,
    featuredBlogs,
  ] = await Promise.all([
    getFeaturedProjects(),
    getExperiences(),
    getFeaturedCertificates(),
    getFeaturedSkills(),
    getActiveHero(),
    getFeaturedBlogs(),
  ]);

  const hero = resolveHomeHero(heroData);
  const { personSchema, softwareSchema } = buildHomeStructuredData(
    hero,
    siteConfig
  );

  return (
    <ClientPageWrapper>
      <Script
        id="schema-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id="schema-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <HomeHero hero={hero} />
      <AnimatedSection
        direction="up"
        className="container space-y-6 bg-muted py-10 my-14"
        id="projects"
      >
        <HomeSectionHeader
          title={pagesConfig.projects.title}
          description={pagesConfig.projects.description}
        />
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full items-stretch">
            {featuredProjects.map((project, index) => (
              <AnimatedSection
                key={project.id}
                delay={0.1 * (index + 1)}
                direction="up"
                className="h-full w-full min-w-0"
              >
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </div>
        </div>
        <HomeViewAll href="/projects" />
      </AnimatedSection>
      <AnimatedSection
        direction="up"
        className="container space-y-6 py-10 my-14"
        id="experience"
      >
        <HomeSectionHeader
          title={pagesConfig.experience.title}
          description={pagesConfig.experience.description}
        />
        <div className="mx-auto grid justify-center gap-4 md:w-full lg:grid-cols-3">
          {allExperiences.slice(0, 3).map((experience, index) => (
            <AnimatedSection
              key={experience.id}
              delay={0.1 * (index + 1)}
              direction="up"
            >
              <ExperienceCard experience={experience} />
            </AnimatedSection>
          ))}
        </div>
        <HomeViewAll href="/experience" />
      </AnimatedSection>
      <AnimatedSection
        direction="up"
        className="container space-y-6 bg-muted py-10 my-14"
        id="certificates"
      >
        <HomeSectionHeader
          title={pagesConfig.certificates.title}
          description={pagesConfig.certificates.description}
        />
        <CertificateCard certificates={featuredCertificates} />
        <HomeViewAll href="/certificates" />
      </AnimatedSection>
      <AnimatedSection
        direction="up"
        className="container space-y-6 py-10 my-14"
        id="blogs"
      >
        <HomeSectionHeader
          title={pagesConfig.blogs.title}
          description={pagesConfig.blogs.description}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full items-stretch">
          {featuredBlogs.map((blog, index) => (
            <AnimatedSection
              key={blog.slug}
              delay={0.1 * (index + 1)}
              direction="up"
              className="h-full w-full min-w-0"
            >
              <BlogCard blog={blog} />
            </AnimatedSection>
          ))}
        </div>
        <HomeViewAll href="/blogs" />
      </AnimatedSection>
      <AnimatedSection
        direction="up"
        className="container space-y-6 bg-muted py-10 my-14"
        id="skills"
      >
        <HomeSectionHeader
          title={pagesConfig.skills.title}
          description={pagesConfig.skills.description}
        />
        <SkillsCard skills={featuredSkills} />
        <HomeViewAll href="/skills" />
      </AnimatedSection>
    </ClientPageWrapper>
  );
}
