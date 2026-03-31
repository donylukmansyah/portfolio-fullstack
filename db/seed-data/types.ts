export type SeedSkillName =
  | "Next.js"
  | "React"
  | "GraphQL"
  | "Nest.js"
  | "express.js"
  | "Node.js"
  | "MongoDB"
  | "Typescript"
  | "Javascript"
  | "HTML 5"
  | "CSS 3"
  | "React Native"
  | "Angular"
  | "Redux"
  | "Socket.io"
  | "Material UI"
  | "Tailwind CSS"
  | "AWS"
  | "Bootstrap"
  | "Google Auth"
  | "MySQL"
  | "Java"
  | "Databricks"
  | "Python"
  | "Docker"
  | "Kubernetes"
  | "PostgreSQL"
  | "Redis"
  | "Git"
  | "CI/CD"
  | "Jenkins"
  | "FastAPI"
  | "Django"
  | "Vue.js"
  | "Sass"
  | "Firebase"
  | "Azure"
  | "Google Cloud"
  | "Figma"
  | "Webpack"
  | "Jest"
  | "Cypress"
  | "Storybook"
  | "Prisma"
  | "Supabase"
  | "Vercel"
  | "Netlify"
  | "Three.js"
  | "WebGL"
  | "TensorFlow"
  | "PyTorch"
  | "Spring Boot"
  | "Laravel"
  | "PHP"
  | "Flutter"
  | "Dart"
  | "Flask"
  | "SQL"
  | "NoSQL"
  | "Framer Motion";

export type SeedProjectCategory =
  | "Full Stack"
  | "Frontend"
  | "Backend"
  | "UI/UX"
  | "Web Dev"
  | "Mobile Dev"
  | "3D Modeling";

export type SeedProjectType = "Personal" | "Professional";

export interface SeedProjectPageInfo {
  title: string;
  imgArr: string[];
  description?: string;
}

export interface SeedProjectDescription {
  paragraphs: string[];
  bullets: string[];
}

export interface SeedProject {
  id: string;
  type: SeedProjectType;
  companyName: string;
  category: SeedProjectCategory[];
  shortDescription: string;
  websiteLink?: string;
  githubLink?: string;
  techStack: SeedSkillName[];
  startDate: Date;
  endDate: Date;
  companyLogoImg: string;
  descriptionDetails: SeedProjectDescription;
  pagesInfoArr: SeedProjectPageInfo[];
  isFeatured?: boolean;
}

export interface SeedExperience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | "Present";
  description: string[];
  achievements: string[];
  skills: SeedSkillName[];
  companyUrl?: string;
  logo?: string;
}

export interface SeedSkill {
  name: string;
  description: string;
  rating: number;
  iconKey: string;
  isFeatured?: boolean;
}

export interface SeedContribution {
  repo: string;
  description: string;
  repoOwner: string;
  link: string;
  isFeatured?: boolean;
}

export interface SeedSocialLink {
  name: string;
  username: string;
  iconKey: string;
  link: string;
}
