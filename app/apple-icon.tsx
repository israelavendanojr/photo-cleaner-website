import { ImageResponse } from "next/og";

import { brand } from "@/lib/brand";
import { OgLogoMark } from "@/lib/og-logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: brand.canvas,
      }}
    >
      <OgLogoMark size={120} />
    </div>,
    size,
  );
}
