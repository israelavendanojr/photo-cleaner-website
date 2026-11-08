import type { ComponentType } from "react";

import { Card } from "@/components/ui/card";
import { LockIcon, UndoIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type TrustPoint = {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
};

const points: TrustPoint[] = [
  {
    icon: LockIcon,
    title: "Everything stays on your iPhone.",
    body: "Photos are sorted on-device. Nothing is uploaded, and there's no account to make.",
  },
  {
    icon: UndoIcon,
    title: "Nothing is deleted until you confirm it.",
    body: "Deleted photos stay in Recently Deleted for 30 days.",
  },
];

export function TrustCard({ className }: { className?: string }) {
  return (
    <Card className={cn("max-w-lead", className)}>
      <ul className="flex flex-col gap-4">
        {points.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-start gap-4">
            <Icon size={22} className="mt-px shrink-0 text-ink" />
            <div className="flex flex-col gap-1">
              <p className="text-title font-semibold text-ink">{title}</p>
              <p className="text-body text-ink-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
