import { ContentPage } from "@/components/sections/content-page";
import Privacy, { meta } from "@/content/privacy.mdx";
import { contentMetadata } from "@/lib/content";

export const metadata = contentMetadata(meta, "/privacy");

export default function PrivacyPage() {
  return (
    <ContentPage meta={meta}>
      <Privacy />
    </ContentPage>
  );
}
