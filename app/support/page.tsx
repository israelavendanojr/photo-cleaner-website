import { ContentPage } from "@/components/sections/content-page";
import Support, { meta } from "@/content/support.mdx";
import { contentMetadata } from "@/lib/content";

export const metadata = contentMetadata(meta, "/support");

export default function SupportPage() {
  return (
    <ContentPage meta={meta}>
      <Support />
    </ContentPage>
  );
}
