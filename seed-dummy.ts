import { db } from "./db/index";
import { projects } from "./db/schema/projects";
import { experiences } from "./db/schema/experiences";
import { skills } from "./db/schema/skills";
import { socialLinks } from "./db/schema/misc";

async function main() {
  console.log("Seeding dummy data...");

  // 1. Insert Projects
  try {
    await db.insert(projects).values([
      {
        slug: "nextjs-portfolio-cms",
        companyName: "Personal",
        type: "Personal",
        category: ["Web", "Fullstack"],
        shortDescription: "A dynamic portfolio CMS built with Next.js 15, Drizzle ORM, and Supabase.",
        websiteLink: "https://demo-portfolio.com",
        githubLink: "https://github.com/example/portfolio-cms",
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Drizzle"],
        startDate: "2024-01-01",
        endDate: "2024-03-01",
        descriptionDetails: { paragraphs: ["Engineered a dynamic portfolio replacing static data with a Postgres database.", "Integrated Better Auth for secure admin section."], bullets: ["CRUD functionality", "Image uploads to Cloudinary"] },
        pagesInfo: { title: "Portfolio CMS Dashboard", description: "Admin panel UI preview", imgArr: [] },
        isFeatured: true,
      },
      {
        slug: "ai-content-generator",
        companyName: "Startup Inc",
        type: "Professional",
        category: ["AI", "SaaS"],
        shortDescription: "An AI-powered content generation tool for marketers.",
        websiteLink: "https://ai-content-gen.example.com",
        techStack: ["React", "Express", "OpenAI API", "PostgreSQL"],
        startDate: "2023-06-01",
        endDate: "2023-11-01",
        descriptionDetails: { paragraphs: ["Built the core AI integration pipeline.", "Optimized generation speed and latency."], bullets: ["OpenAI integration", "Stripe billing"] },
        pagesInfo: { title: "App Screenshot", description: "Main generation interface", imgArr: [] },
        isFeatured: false,
      },
      {
        slug: "rust-cli-tool",
        companyName: "Open Source",
        type: "Personal",
        category: ["CLI"],
        shortDescription: "A lightning-fast command line utility for developers.",
        githubLink: "https://github.com/example/rust-cli",
        techStack: ["Rust", "Clap"],
        startDate: "2025-01-01",
        endDate: "2025-02-01",
        descriptionDetails: { paragraphs: ["Developed a CLI tool to automate repetitive workflow tasks."], bullets: ["Lightning fast", "Type-safe operations"] },
        pagesInfo: { title: "Terminal View", description: "Action logs", imgArr: [] },
        isFeatured: true,
      }
    ]).onConflictDoNothing();
    console.log("✅ Projects inserted.");
  } catch (e) {
    console.error("❌ Error inserting projects:", e);
  }

  // 2. Insert Experiences
  try {
    await db.insert(experiences).values([
      {
        slug: "applied-ai-engineer",
        position: "Applied AI Engineer",
        company: "TechNova",
        location: "San Francisco, CA",
        startDate: "2022-06-01",
        endDate: null,
        isCurrent: true,
        description: ["Leading AI integrations for enterprise clients.", "Architecting scalable data pipelines for machine learning models."],
        achievements: ["Reduced model latency by 40%", "Deployed 3 major NLP systems into production"],
        skills: ["Python", "TensorFlow", "FastAPI", "AWS"],
        companyUrl: "https://technova.example.com",
      },
      {
        slug: "fullstack-developer",
        position: "Fullstack Developer",
        company: "WebSolutions Co",
        location: "Remote",
        startDate: "2020-03-01",
        endDate: "2022-05-01",
        isCurrent: false,
        description: ["Developed custom web applications for B2B clients.", "Transitioned legacy systems to React/Node.js stacks."],
        achievements: ["Delivered 10+ projects ahead of deadline", "Mentored junior developers"],
        skills: ["React", "Node.js", "MongoDB", "TypeScript"],
        companyUrl: "https://websolutions.example.com",
      },
      {
        slug: "software-engineering-intern",
        position: "Software Engineering Intern",
        company: "Global Tech",
        location: "New York, NY",
        startDate: "2019-06-01",
        endDate: "2019-09-01",
        isCurrent: false,
        description: ["Assisted in building internal dashboards.", "Wrote unit and integration tests."],
        achievements: ["Increased test coverage by 20%."],
        skills: ["JavaScript", "Vue.js", "Jest"],
      }
    ]).onConflictDoNothing();
    console.log("✅ Experiences inserted.");
  } catch (e) {
    console.error("❌ Error inserting experiences:", e);
  }

  // 3. Insert Skills
  try {
    await db.insert(skills).values([
      {
        name: "React & Next.js",
        description: "Building scalable front-end and full-stack web applications.",
        rating: 5,
        iconKey: "react",
        isFeatured: true,
      },
      {
        name: "TypeScript",
        description: "Type-safe JavaScript development.",
        rating: 5,
        iconKey: "typescript",
        isFeatured: true,
      },
      {
        name: "PostgreSQL & Drizzle",
        description: "Database design and type-safe ORM querying.",
        rating: 4,
        iconKey: "database",
        isFeatured: false,
      }
    ]).onConflictDoNothing();
    console.log("✅ Skills inserted.");
  } catch (e) {
    console.error("❌ Error inserting skills:", e);
  }

  // 4. Insert Social Links
  try {
    await db.insert(socialLinks).values([
      {
        name: "GitHub",
        username: "developer_profile",
        iconKey: "github",
        link: "https://github.com/",
      },
      {
        name: "LinkedIn",
        username: "developer_profile",
        iconKey: "linkedin",
        link: "https://linkedin.com/in/",
      },
      {
        name: "Twitter",
        username: "dev_tweets",
        iconKey: "twitter",
        link: "https://twitter.com/",
      }
    ]).onConflictDoNothing();
    console.log("✅ Social Links inserted.");
  } catch (e) {
    console.error("❌ Error inserting socialLinks:", e);
  }

  process.exit(0);
}

main();
