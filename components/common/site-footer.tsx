import Link from "next/link";
import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import CustomTooltip from "@/components/ui/custom-tooltip";
import { Icons } from "@/components/common/icons";
import { getSocialLinks } from "@/lib/queries";
import { cn } from "@/lib/utils";

// Map iconKey strings to actual Icon components for social links
const socialIconMap: Record<string, any> = {
  gitHub: Icons.gitHub,
  github: Icons.gitHub,
  linkedin: Icons.linkedin,
  twitter: Icons.twitter,
  gmail: Icons.gmail,
};

export async function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const links = await getSocialLinks();

  return (
    <footer className={cn(className)}>
      <div className="container flex items-center justify-center gap-8 mt-10 py-10 md:h-24">
        {links.map((item) => {
          const SocialIcon = socialIconMap[item.iconKey];
          if (!SocialIcon) return null;
          return (
            <CustomTooltip icon={SocialIcon} text={item.username} key={item.id}>
              <Link
                href={item.link}
                target="_blank"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "h-10 w-10 p-2"
                )}
              >
                <SocialIcon className="h-5 w-5" />
              </Link>
            </CustomTooltip>
          );
        })}
      </div>
    </footer>
  );
}
