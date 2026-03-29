import Rating from "@/components/skills/rating";
import { Icons } from "@/components/common/icons";

// DB-backed skill type (from Drizzle schema)
interface SkillData {
  id: string;
  name: string;
  description: string;
  rating: number;
  iconKey: string;
  isFeatured: boolean | null;
}

interface SkillsCardProps {
  skills: SkillData[];
}

// Map iconKey strings to actual Icon components
const iconMap: Record<string, any> = {
  nextjs: Icons.nextjs,
  react: Icons.react,
  graphql: Icons.graphql,
  nestjs: Icons.nestjs,
  express: Icons.express,
  nodejs: Icons.nodejs,
  mongodb: Icons.mongodb,
  typescript: Icons.typescript,
  javascript: Icons.javascript,
  html5: Icons.html5,
  css3: Icons.css3,
  angular: Icons.angular,
  redux: Icons.redux,
  socketio: Icons.socketio,
  mui: Icons.mui,
  tailwindcss: Icons.tailwindcss,
  amazonaws: Icons.amazonaws,
  bootstrap: Icons.bootstrap,
  mysql: Icons.mysql,
  netlify: Icons.netlify,
};

export default function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => {
        const SkillIcon = iconMap[skill.iconKey];
        return (
          <div
            key={skill.id}
            className="relative overflow-hidden rounded-lg border bg-background p-2"
          >
            <div className="flex h-[230px] flex-col justify-between rounded-md p-6 sm:h-[230px]">
              {SkillIcon ? <SkillIcon size={50} /> : <div className="h-[50px] w-[50px]" />}
              <div className="space-y-2">
                <h3 className="font-bold">{skill.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {skill.description}
                </p>
                <Rating stars={skill.rating} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
