export const site = {
  name: "Bristle",
  tagline: "Lighten your library.",
  description:
    "Clear the photos you don't need, one easy swipe at a time. Bristle sorts duplicates, near-identical shots and old screenshots on your iPhone. Join the waitlist.",
  // TODO: replace with the production domain once it is registered.
  url: "https://getbristle.app",
  supportEmail: "support@getbristle.app",
  status: "Coming soon to iPhone",
  footerNote: "",
  // Static so pages stay fully prerendered; bump yearly.
  copyrightYear: 2026,
} as const;

export const navLinks = [
  // { href: "/privacy", label: "Privacy" },
  // { href: "/support", label: "Support" },
] as const;
