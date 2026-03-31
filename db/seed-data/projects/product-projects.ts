import { SeedProject } from "../types";

export const productProjects: SeedProject[] = [
  {
    id: "portfolio-template",
    companyName: "Portfolio Website (130+ GitHub stars)",
    type: "Personal",
    category: ["Web Dev", "Frontend", "UI/UX"],
    shortDescription:
      "Open-source Next.js portfolio template recognized and forked by developers worldwide, optimized for SEO/AEO and performance.",
    websiteLink: "https://nbarkiya.xyz",
    githubLink: "https://github.com/namanbarkiya/minimal-next-portfolio",
    techStack: [
      "Next.js",
      "React",
      "Typescript",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel",
    ],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-12-01"),
    companyLogoImg: "/projects/portfolio/logo.png",
    isFeatured: true,
    pagesInfoArr: [
      {
        title: "Landing & Sections",
        description:
          "A clean, minimal landing page with sections for skills, projects, contributions, and experience.",
        imgArr: ["/profile-img.jpg"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "I created an open-source Next.js portfolio template to help developers ship a modern, responsive portfolio quickly.",
        "The project focuses heavily on performance, clean typography, and strong SEO/AEO foundations, and it has been adopted and forked by developers globally.",
      ],
      bullets: [
        "Created an open-source Next.js portfolio template recognized and forked by developers worldwide.",
        "Ranked #1 on ChatGPT search for “best Next.js portfolio template GitHub” through AEO/GEO optimization.",
        "Maintained a fast, responsive UI with a minimal, themeable design system.",
      ],
    },
  },
  {
    id: "convot",
    companyName: "Convot",
    type: "Personal",
    category: ["Full Stack", "Backend", "Web Dev"],
    shortDescription:
      "Production-ready AI chatbot platform that crawls, indexes, and embeds knowledge from PDFs/URLs/text to deliver source-grounded answers via a one-line widget.",
    techStack: ["Next.js", "React", "Node.js", "Typescript", "Python"],
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-10-01"),
    companyLogoImg: "/projects/convot/logo.png",
    isFeatured: true,
    pagesInfoArr: [
      {
        title: "Ingestion & Retrieval",
        description:
          "Designed ingestion and retrieval pipelines supporting multiple content sources with secure tenant isolation.",
        imgArr: ["/logo.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Convot is a production-ready AI chatbot platform designed to be embedded on any website with a single line widget.",
        "It supports crawling and indexing knowledge from PDFs, URLs, and plain text, and it returns context-aware, source-grounded answers with integrated analytics.",
      ],
      bullets: [
        "Built a production-ready AI chatbot platform with integrated analytics and a one-line embed widget.",
        "Designed ingestion and retrieval pipelines to support multiple sources (PDFs, URLs, text) with tenant isolation.",
        "Focused on reliability, security, and traceable answers by grounding responses in retrieved sources.",
      ],
    },
  },
  {
    id: "niya-saas-template",
    companyName: "Niya SaaS Template (30+ GitHub stars)",
    type: "Personal",
    category: ["Full Stack", "Web Dev", "UI/UX"],
    shortDescription:
      "Production-ready Next.js 15 template for developers and AI startups. Includes authentication, state management, beautiful UI components, and everything needed to build scalable SaaS applications.",
    websiteLink: "https://niya.nbarkiya.xyz",
    githubLink: "https://github.com/namanbarkiya/niya-saas-template",
    techStack: ["Next.js", "React", "Typescript", "Supabase", "Tailwind CSS"],
    startDate: new Date("2024-08-01"),
    endDate: new Date("2025-01-01"),
    companyLogoImg: "/projects/niya/logo.png",
    isFeatured: true,
    pagesInfoArr: [
      {
        title: "Landing Page",
        description:
          "Modern landing page showcasing the template features, tech stack, and pricing options.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Authentication System",
        description:
          "Complete authentication system with Supabase, protected routes, and role-based access control.",
        imgArr: ["/logo.png"],
      },
      {
        title: "Dashboard & Components",
        description:
          "Beautiful UI components with Magic UI, Radix primitives, and comprehensive dashboard templates.",
        imgArr: ["/logo.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "Niya is a production-ready Next.js 15 template designed for developers and AI startups. Built with modern best practices, it includes everything needed to build scalable SaaS applications.",
        "The template features a complete authentication system with Supabase, beautiful UI components with Magic UI and Radix primitives, state management with Zustand and React Query, and full TypeScript support with Zod validation.",
        "It's optimized for performance, includes SEO-friendly metadata, and provides a solid foundation for rapid prototyping and production deployment.",
      ],
      bullets: [
        "Created a production-ready Next.js 15 template with complete authentication system and protected routes.",
        "Integrated Supabase for database, authentication, and real-time features with full TypeScript support.",
        "Built comprehensive UI component library with Magic UI, Radix primitives, and Tailwind CSS styling.",
        "Implemented state management with Zustand for client state and React Query for server state management.",
        "Designed for developers and AI startups with all essential features to start building SaaS products.",
        "Achieved 30+ GitHub stars and recognition as a comprehensive starter template for modern web applications.",
      ],
    },
  },
  {
    id: "the-super-focus",
    companyName: "TheSuperFocus",
    type: "Personal",
    category: ["Full Stack", "Web Dev", "UI/UX"],
    shortDescription:
      "Pomodoro-inspired productivity web app with real-time sessions and recurring payments.",
    techStack: [
      "Next.js",
      "React",
      "Node.js",
      "Socket.io",
      "Typescript",
      "MongoDB",
    ],
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-12-01"),
    companyLogoImg: "/logo.png",
    pagesInfoArr: [
      {
        title: "Realtime Focus Sessions",
        description:
          "Built real-time focus sessions using sockets to help people stay accountable and productive.",
        imgArr: ["/logo.png"],
      },
    ],
    descriptionDetails: {
      paragraphs: [
        "TheSuperFocus is a productivity web app inspired by the Pomodoro technique, built to help users stay focused and complete deep-work sessions.",
        "It includes real-time session support and a paid tier with recurring billing.",
      ],
      bullets: [
        "Built a Pomodoro-inspired productivity web app using real-time sockets.",
        "Integrated Razorpay for recurring payments, securing 10+ premium users.",
      ],
    },
  },
];
