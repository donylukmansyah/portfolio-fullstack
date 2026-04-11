"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function GithubRedirectCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="w-full h-fit max-w-sm overflow-hidden shadow-lg transition-all duration-300 ease-in-out transform hover:scale-102 mt-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="mb-6">
          <Github
            className={`w-16 h-16 transition-colors duration-300 ease-out ${
              isHovered ? "text-foreground" : "text-muted-foreground"
            }`}
          />
        </div>
        <h2 className="font-heading text-xl tracking-tight lg:text-3xl duration-300">
          Explore My GitHub
        </h2>
        <p className="mt-2 mb-10 font-heading text-lg text-muted-foreground">
          Check out my repositories, open source projects, and contributions.
        </p>
      </CardContent>
      <CardFooter className="px-8 pb-8 pt-0">
        <Link
          href={siteConfig.links.github}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full bg-transparent border-2 transition-all duration-300 py-6"
          )}
        >
          <span className="mr-2">Visit GitHub Profile</span>
          <ExternalLink className="w-5 h-5" />
        </Link>
      </CardFooter>
      <div
        className={`h-1 bg-gradient-to-r from-muted-foreground to-muted-foreground transition-all duration-300 ease-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </Card>
  );
}
