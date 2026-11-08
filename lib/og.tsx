import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { brand } from "@/lib/brand";
import { OgLogoMark } from "@/lib/og-logo";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

// Read once at module scope so the image is prerendered at build time.
// Paths are literal so only these files are traced into the server bundle.
const dataUrl = (png: Buffer) => `data:image/png;base64,${png.toString("base64")}`;
const [serif, sans, sansBold, sunset, coast] = await Promise.all([
  readFile(join(process.cwd(), "assets/fonts/newsreader-500.ttf")),
  readFile(join(process.cwd(), "assets/fonts/inter-400.ttf")),
  readFile(join(process.cwd(), "assets/fonts/inter-600.ttf")),
  readFile(join(process.cwd(), "public/mockup/sunset.png")).then(dataUrl),
  readFile(join(process.cwd(), "public/mockup/coast.png")).then(dataUrl),
]);

const fonts = [
  { name: "Newsreader", data: serif, weight: 500, style: "normal" },
  { name: "Inter", data: sans, weight: 400, style: "normal" },
  { name: "Inter", data: sansBold, weight: 600, style: "normal" },
] as const;

/** Shared social card in the style of the waitlist hero. */
export function renderOgImage() {
  const card = {
    position: "absolute",
    width: 300,
    height: 450,
    borderRadius: 30,
    overflow: "hidden",
    display: "flex",
    boxShadow: `0 24px 60px ${brand.shadow}`,
  } as const;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: brand.canvas,
        fontFamily: "Inter",
        color: brand.ink,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 0 72px 80px",
          width: 720,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <OgLogoMark size={44} />
          <span style={{ fontFamily: "Newsreader", fontSize: 40, letterSpacing: "-0.01em" }}>
            {site.name}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span
            style={{
              fontFamily: "Newsreader",
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: "-0.025em",
            }}
          >
            {site.tagline}
          </span>
          <span style={{ fontSize: 30, lineHeight: 1.4, color: brand.inkMuted, maxWidth: 560 }}>
            Clear the photos you don&apos;t need, one easy swipe at a time.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: brand.accent }} />
          <span style={{ color: brand.inkMuted }}>{site.status}</span>
        </div>
      </div>

      <div style={{ display: "flex", position: "relative", flex: 1 }}>
        <div style={{ ...card, top: 100, left: 110, transform: "scale(0.95)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the DOM */}
          <img src={coast} width={300} height={450} alt="" style={{ objectFit: "cover" }} />
        </div>
        <div style={{ ...card, top: 88, left: 70, transform: "rotate(-6deg)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the DOM */}
          <img src={sunset} width={300} height={450} alt="" style={{ objectFit: "cover" }} />
          <div
            style={{
              // next/og (Satori) doesn't support `inset`.
              position: "absolute",
              top: 0,
              left: 0,
              width: 300,
              height: 450,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              background: "rgba(194, 74, 58, 0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 76,
                height: 76,
                borderRadius: 38,
                background: brand.accent,
              }}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 7h16" />
                <path d="M9 7V4.5h6V7" />
                <path d="m6.5 7 1 12.5h9l1-12.5" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </div>
            <span
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                background: brand.surface,
                color: brand.accent,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Delete · 3.4 MB
            </span>
          </div>
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: [...fonts] },
  );
}
