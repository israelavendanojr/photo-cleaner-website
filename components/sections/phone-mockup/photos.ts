import type { StaticImageData } from "next/image";

import coast from "@/public/mockup/coast.png";
import sunset from "@/public/mockup/sunset.png";

export type MockPhoto = {
  id: string;
  title: string;
  place: string;
  sizeMB: number;
  /** A real image, or a code-drawn scene from photo-art.tsx. */
  image: StaticImageData | "dusk" | "meadow";
};

/** Cards cycled by the mockup, front first. Add or swap entries freely. */
export const mockPhotos: MockPhoto[] = [
  { id: "sunset", title: "Saturday, August 16", place: "Santa Cruz", sizeMB: 3.4, image: sunset },
  { id: "coast", title: "Sunday, August 17", place: "Capitola", sizeMB: 2.8, image: coast },
  { id: "dusk", title: "Friday, July 4", place: "Big Sur", sizeMB: 4.1, image: "dusk" },
  { id: "meadow", title: "Monday, June 9", place: "Carmel Valley", sizeMB: 2.2, image: "meadow" },
];

/** Starting value of the "MB to clear" counter. */
export const STARTING_MB = 184;
