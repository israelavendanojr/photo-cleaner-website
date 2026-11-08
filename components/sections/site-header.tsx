import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-page flex-wrap items-center justify-between gap-4 px-gutter pt-header">
      <Link href="/" aria-label={`${site.name} home`} className="rounded-pill">
        <Logo />
      </Link>
      <Badge>{site.status}</Badge>
    </header>
  );
}
