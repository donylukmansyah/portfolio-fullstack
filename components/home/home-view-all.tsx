import Link from "next/link";

import { AnimatedText } from "@/components/common/animated-text";
import { Icons } from "@/components/common/icons";
import { Button } from "@/components/ui/button";

interface HomeViewAllProps {
  href: string;
}

export function HomeViewAll({ href }: HomeViewAllProps) {
  return (
    <AnimatedText delay={0.4} className="flex justify-center">
      <Link href={href}>
        <Button variant="outline" className="rounded-xl">
          <Icons.chevronDown className="mr-2 h-4 w-4" /> View All
        </Button>
      </Link>
    </AnimatedText>
  );
}
