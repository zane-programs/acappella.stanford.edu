"use client";

import { useRef } from "react";

import type { ACappellaGroup } from "@/app/config/groups";
import { TransitionLink } from "@/app/components/transitions/TransitionLink";

/**
 * Compact group tile used by `MoreGroups` (docs/DESIGN.md §5 item 4 spec).
 * The photo hands off to the destination hero via the shared-image transition.
 * NOTE: the home page has its own `GroupTile`; the integrator may unify them.
 */
export function GroupCard({ slug, group }: { slug: string; group: ACappellaGroup }) {
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <li className="group">
      <TransitionLink
        href={`/${slug}`}
        className="block rounded-md focus-ring"
        sharedImage={() => {
          const img = imgRef.current;
          if (!img) return undefined;
          return { slug, from: img.getBoundingClientRect(), src: img.currentSrc || img.src };
        }}
      >
        <div className="aspect-[3/2] overflow-hidden rounded-md ring-1 ring-black-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            data-shared-image={slug}
            src={group.imgUrl}
            alt={`${group.name} group photo`}
            width={600}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-600 ease-[var(--ease-out-expo)] group-hover:scale-[1.03] select-none"
            draggable={false}
          />
        </div>
        <h3 className="type-h3 mt-4 font-serif font-normal text-black">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            {group.name}
          </span>
        </h3>
        <p className="type-small mt-1 text-black-70">{group.tagline}</p>
      </TransitionLink>
    </li>
  );
}
