import { Reveal } from "@/components/ui/reveal";

import { TrustCard } from "./trust-card";
import { WaitlistForm } from "./waitlist-form";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="flex max-w-copy grow basis-110 flex-col">
      <Reveal order={0} variant="settle">
        <h1 id="hero-title" className="font-serif text-display font-medium text-ink">
          Free up your storage.
        </h1>
      </Reveal>
      <Reveal order={1}>
        <p className="mt-6 max-w-lead text-lead text-ink-muted">
          Delete, trim, and compress the things taking too much room. Already cleanly sorted for you.
        </p>
      </Reveal>
      <Reveal order={2} className="mt-form">
        <WaitlistForm />
      </Reveal>
      <Reveal order={3} className="mt-trust">
        <TrustCard />
      </Reveal>
    </section>
  );
}
