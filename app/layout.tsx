import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { site } from "@/lib/site";

import "./globals.css";

// Fallbacks only: Apple devices render New York (ui-serif) and SF (-apple-system).
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Join the waitlist`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <MotionProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
