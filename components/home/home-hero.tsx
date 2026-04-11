import Image from "next/image";
import Link from "next/link";

import { AnimatedText } from "@/components/common/animated-text";
import { Icons } from "@/components/common/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import profileImg from "@/public/profile-img.jpg";

import type { HomeHeroData } from "@/lib/home-page";

interface HomeHeroProps {
  hero: HomeHeroData;
}

export function HomeHero({ hero }: HomeHeroProps) {
  return (
    <section className="mb-0 flex min-h-[calc(100dvh-5rem)] items-center space-y-6 pb-8 pt-6 md:min-h-screen md:py-20 md:pb-12 lg:py-32">
      <div className="container mt-4 flex max-w-[64rem] flex-col items-center gap-4 text-center md:-mt-20">
        <Image
          src={hero.image || profileImg}
          height={100}
          width={100}
          sizes="100vw"
          className="mb-0 h-auto w-[60%] max-w-[16rem] rounded-full border-8 border-primary bg-primary md:mb-2"
          alt={`${hero.name} - ${hero.title} Portfolio`}
          priority
        />
        <AnimatedText
          as="h1"
          delay={0.2}
          className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {hero.name}
        </AnimatedText>
        <AnimatedText
          as="h3"
          delay={0.4}
          className="font-heading text-base sm:text-xl md:text-xl lg:text-2xl"
        >
          {hero.title}
        </AnimatedText>
        <div className="mt-4 max-w-[42rem] text-center">
          <p className="text-sm leading-normal text-muted-foreground sm:text-base">
            {hero.description}
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:space-x-4">
          <AnimatedText delay={0.6}>
            <Link
              href={hero.resume}
              target="_blank"
              className={cn(buttonVariants({ size: "lg" }))}
              aria-label="View resume"
            >
              <Icons.post className="mr-2 h-4 w-4" /> Resume
            </Link>
          </AnimatedText>
          <AnimatedText delay={0.8}>
            <Link
              href="/contact"
              rel="noreferrer"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                })
              )}
              aria-label={`Contact ${hero.name}`}
            >
              <Icons.contact className="mr-2 h-4 w-4" /> Contact
            </Link>
          </AnimatedText>
        </div>
        <AnimatedText delay={1.2}>
          <Icons.chevronDown className="mt-10 h-6 w-6" />
        </AnimatedText>
      </div>
    </section>
  );
}
