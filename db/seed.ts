import { db } from "./index";
import {
  projects,
  experiences,
  skills,
  contributions,
  socialLinks,
  siteSettings,
} from "./schema";
import { Projects } from "../config/projects";
import { experiences as staticExperiences } from "../config/experience";
import { skillsUnsorted } from "../config/skills";
import { contributionsUnsorted } from "../config/contributions";
import { SocialLinks } from "../config/socials";
import { siteConfig } from "../config/site";

async function main() {
  console.log("Starting database seeding...");

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // 1. Projects
  console.log("Seeding projects...");
  for (const project of Projects) {
    await db.insert(projects).values({
      slug: project.id, // Falling back to ID since slug is not in the interface natively
      companyName: project.companyName,
      type: project.type,
      category: project.category,
      shortDescription: project.shortDescription,
      websiteLink: project.websiteLink || "",
      githubLink: project.githubLink || "",
      techStack: project.techStack,
      startDate: formatDate(project.startDate),
      endDate: formatDate(project.endDate),
      companyLogoImg: typeof project.companyLogoImg === 'string' ? project.companyLogoImg : project.companyLogoImg?.src || "",
      descriptionDetails: project.descriptionDetails as any, 
      pagesInfo: project.pagesInfoArr as any, // Mapped from pagesInfoArr
      isFeatured: false, // Not in ProjectInterface natively, default to false
    }).onConflictDoNothing(); // Prevent duplicates on re-run
  }

  // 2. Experiences
  console.log("Seeding experiences...");
  for (const exp of staticExperiences) {
    await db.insert(experiences).values({
      slug: exp.company.toLowerCase().replace(/\s+/g, '-'), // Basic slug generation
      position: exp.position,
      company: exp.company,
      location: exp.location,
      startDate: formatDate(exp.startDate),
      endDate: exp.endDate === "Present" ? null : formatDate(exp.endDate),
      isCurrent: exp.endDate === "Present",
      description: exp.description,
      achievements: exp.achievements,
      skills: exp.skills,
      companyUrl: exp.companyUrl,
      // Handle static imports vs string URLs
      logo: typeof exp.logo === 'string' ? exp.logo : ((exp.logo as any)?.src || ""),
    }).onConflictDoNothing();
  }

  // 3. Skills
  console.log("Seeding skills...");
  for (const skill of skillsUnsorted) {
    await db.insert(skills).values({
      name: skill.name,
      description: skill.description,
      rating: skill.rating,
      iconKey: "default", // Assuming icon is a React component reference, we fallback to default string
      isFeatured: false,
    }).onConflictDoNothing();
  }

  // 4. Contributions
  console.log("Seeding contributions...");
  for (const contrib of contributionsUnsorted) {
    await db.insert(contributions).values({
      repo: contrib.repo,
      description: contrib.contibutionDescription, // Typo in original interface
      repoOwner: contrib.repoOwner,
      link: contrib.link,
    }).onConflictDoNothing();
  }

  // 5. Social Links
  console.log("Seeding social links...");
  for (const social of SocialLinks) {
    await db.insert(socialLinks).values({
      name: social.name,
      username: social.username,
      iconKey: social.icon,
      link: social.link,
    }).onConflictDoNothing();
  }

  // 6. Site Settings (Flat Key-Value)
  console.log("Seeding site settings...");
  const settingsEntries = [
    { key: "site_name", value: siteConfig.name },
    { key: "site_description", value: siteConfig.description },
    { key: "site_url", value: siteConfig.url },
    { key: "og_image", value: siteConfig.ogImage },
    { key: "author_name", value: siteConfig.authorName },
    { key: "resume_link", value: process.env.NEXT_PUBLIC_RESUME_LINK || "" }, // Or static if defined
  ];

  for (const setting of settingsEntries) {
    await db.insert(siteSettings).values({
      key: setting.key,
      value: setting.value,
    }).onConflictDoNothing();
  }

  console.log("Database seeding completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
