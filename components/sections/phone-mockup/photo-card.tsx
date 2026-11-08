import Image from "next/image";

import { TrashIcon } from "@/components/ui/icons";
import { formatMB } from "./format";
import { DuskArt, MeadowArt } from "./photo-art";
import type { MockPhoto } from "./photos";

export function PhotoArtwork({ photo, preload }: { photo: MockPhoto; preload?: boolean }) {
  if (photo.image === "dusk") return <DuskArt />;
  if (photo.image === "meadow") return <MeadowArt />;
  return (
    <Image
      src={photo.image}
      alt=""
      fill
      sizes="332px"
      preload={preload}
      className="object-cover"
      placeholder="blur"
    />
  );
}

/** Photo, date and place caption. */
export function PhotoFace({ photo, preload }: { photo: MockPhoto; preload?: boolean }) {
  return (
    <>
      <PhotoArtwork photo={photo} preload={preload} />
      <div className="absolute inset-0 bg-linear-to-b from-transparent from-55% to-photo-scrim" />
      <div className="absolute bottom-6 left-5.5 flex flex-col gap-1 text-white">
        <span className="font-serif text-photo-title">{photo.title}</span>
        <span className="text-body opacity-90">
          {photo.place} · {formatMB(photo.sizeMB)}
        </span>
      </div>
    </>
  );
}

/** Red wash + trash stamp shown as a card tilts toward Delete. */
export function DeleteStamp({ sizeMB }: { sizeMB: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-delete-tint">
      <div className="flex size-21 items-center justify-center rounded-pill bg-accent text-white shadow-photo">
        <TrashIcon size={36} strokeWidth={2} />
      </div>
      <span className="rounded-pill bg-surface px-4 py-1.5 text-control font-semibold text-accent">
        Delete · {formatMB(sizeMB)}
      </span>
    </div>
  );
}
