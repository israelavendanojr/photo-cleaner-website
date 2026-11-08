import Link from "next/link";

import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-page px-gutter pb-footer">
      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-5.5 text-caption text-ink-muted">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            © {site.copyrightYear} {site.name}
          </span>
          <nav aria-label="Footer">
            <ul className="flex gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink-muted transition-colors duration-200 hover:text-accent-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <span>{site.footerNote}</span>
      </div>
    </footer>
  );
}
