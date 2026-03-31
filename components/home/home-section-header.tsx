import { AnimatedText } from "@/components/common/animated-text";

interface HomeSectionHeaderProps {
  title: string;
  description: string;
}

export function HomeSectionHeader({
  title,
  description,
}: HomeSectionHeaderProps) {
  return (
    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
      <AnimatedText
        as="h2"
        className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
      >
        {title}
      </AnimatedText>
      <AnimatedText
        as="p"
        delay={0.2}
        className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
      >
        {description}
      </AnimatedText>
    </div>
  );
}
