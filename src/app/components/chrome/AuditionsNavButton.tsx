"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { getActiveAuditionCohort, getAuditionStatus } from "@/app/utils/auditions";

/**
 * "Auditions" call to action, shown only while at least one group in the
 * active cohort has sign-ups open or upcoming. Decided on the client after
 * mount so statically rendered pages never bake a stale answer.
 */
export function AuditionsNavButton({ onCardinal = false }: { onCardinal?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const cohort = getActiveAuditionCohort();
    const now = new Date();
    setShow(
      Object.values(cohort).some((a) => {
        const s = getAuditionStatus(a, now);
        return s === "open" || s === "upcoming";
      })
    );
  }, []);

  if (!show) return null;
  return (
    <Button href="/#auditions" size="md" variant={onCardinal ? "on-cardinal" : "primary"}>
      Auditions
    </Button>
  );
}
