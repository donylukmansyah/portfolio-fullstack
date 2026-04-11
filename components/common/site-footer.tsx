
import * as React from "react";

import { getSocialLinks } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { SiteFooterClient } from "./site-footer-client";

export async function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const links = await getSocialLinks();

  return (
    <footer className={cn(className)}>
      <SiteFooterClient links={links} />
    </footer>
  );
}
