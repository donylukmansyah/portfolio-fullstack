import { creativeProjects } from "./creative-projects";
import { productProjects } from "./product-projects";
import { professionalProjects } from "./professional-projects";

export const seedProjects = [
  ...productProjects,
  ...creativeProjects,
  ...professionalProjects,
];
