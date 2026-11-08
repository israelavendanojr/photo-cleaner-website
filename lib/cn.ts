import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about our custom tokens so e.g. `text-lead` vs `text-ink`
// and `border-control` (width) vs `border-line` (color) aren't treated as conflicts.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "border-w": [{ border: ["control"] }],
      "font-size": [
        {
          text: [
            "display",
            "wordmark",
            "stat",
            "photo-title",
            "lead",
            "control",
            "title",
            "body",
            "caption",
            "micro",
            "prose-h1",
            "prose-h2",
            "prose",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
