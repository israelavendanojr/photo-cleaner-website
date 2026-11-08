import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { PhoneMockup } from "@/components/sections/phone-mockup";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function WaitlistPage() {
  return (
    <main className="mx-auto flex w-full max-w-page flex-1 flex-wrap items-center justify-between gap-hero px-gutter pt-hero-top pb-hero-bottom">
      <Hero />
      <Reveal
        order={4}
        variant="rise-scale"
        className="mx-auto flex min-w-0 shrink basis-96 justify-center"
      >
        <PhoneMockup />
      </Reveal>
    </main>
  );
}
