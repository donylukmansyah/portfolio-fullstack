export interface HomeHeroData {
  name: string;
  title: string;
  description: string;
  image: string | null;
  resume: string;
}

interface HomeHeroSource {
  name: string;
  title: string;
  description: string;
  image: string | null;
  resume: string | null;
}

export const DEFAULT_HERO: HomeHeroData = {
  name: "Dony L",
  title: "Software Engineer",
  description:
    "Software engineer building modern web applications and scalable software systems.",
  image: null,
  resume: "/resume",
};

export function resolveHomeHero(heroData: HomeHeroSource | null): HomeHeroData {
  if (!heroData) {
    return DEFAULT_HERO;
  }

  return {
    name: heroData.name || DEFAULT_HERO.name,
    title: heroData.title || DEFAULT_HERO.title,
    description: heroData.description || DEFAULT_HERO.description,
    image: heroData.image,
    resume: heroData.resume || DEFAULT_HERO.resume,
  };
}

export function buildHomeStructuredData(
  hero: HomeHeroData,
  site: {
    url: string;
    ogImage: string;
    links: {
      github: string;
      twitter: string;
    };
  }
) {
  return {
    personSchema: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: hero.name,
      url: site.url,
      image: site.ogImage,
      jobTitle: hero.title,
      sameAs: [site.links.github, site.links.twitter],
    },
    softwareSchema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Next.js Portfolio Template",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Person",
        name: hero.name,
        url: site.url,
      },
    },
  };
}
