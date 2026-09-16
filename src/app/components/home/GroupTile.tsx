"use client";

import { useRef } from "react";

import type { ACappellaGroup } from "@/app/config/groups";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";
import type { SharedImageHandoff } from "@/app/components/transitions/context";

/**
 * One group in the homepage grid (docs/DESIGN.md §5 item 4).
 *
 * The photo carries `data-shared-image={slug}`; clicking the tile hands the
 * image off to the transition provider, which morphs it onto the matching
 * image on the group page. A plain <img> is used on purpose (§7): it keeps the
 * measurement simple and the photos are shown at or below their native size.
 */
export function GroupTile({
  slug,
  group: { name, imgUrl, tagline },
  priority = false,
}: {
  slug: string;
  group: ACappellaGroup;
  /** Eager-load the first row of photos. */
  priority?: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  const sharedImage = (): SharedImageHandoff | undefined => {
    const img = imgRef.current;
    if (!img) return undefined;
    return { slug, from: img.getBoundingClientRect(), src: img.currentSrc || img.src };
  };

  return (
    <li data-reveal className="min-w-0">
      <TransitionLink
        href={`/${slug}`}
        sharedImage={sharedImage}
        className="group block rounded-md focus-ring"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-fog-light ring-1 ring-black-10 sm:aspect-[3/2]">
          {/* eslint-disable-next-line @next/next/no-img-element -- shared-image morph measures a plain img (DESIGN.md §7) */}
          <img
            ref={imgRef}
            data-shared-image={slug}
            src={imgUrl}
            alt=""
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className="absolute inset-0 size-full object-cover transition-transform duration-[600ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          />
        </div>
        <h3 className="mt-3 font-serif text-[1.0625rem] leading-tight text-black sm:mt-4 sm:text-[1.375rem]">
          <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-cardinal after:transition-[width] after:duration-300 after:ease-[var(--ease-out-expo)] group-hover:after:w-full">
            {name}
          </span>
        </h3>
        <p className="type-small mt-1 line-clamp-3 text-[0.8125rem] text-black-70 sm:line-clamp-none sm:text-[0.9375rem]">{tagline}</p>
      </TransitionLink>
    </li>
  );
}
