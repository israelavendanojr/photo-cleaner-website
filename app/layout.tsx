import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { brand } from "@/lib/brand";
import { site } from "@/lib/site";

import "./globals.css";

// Fallbacks only: Apple devices render New York (ui-serif) and SF (-apple-system),
// so these aren't preloaded; elsewhere they swap in once loaded.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

const defaultTitle = `${site.name} — Join the waitlist`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: defaultTitle,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: brand.canvas,
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
