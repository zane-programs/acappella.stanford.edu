import type { Voicing as VoicingValue } from "@/app/config/groups";
import { Badge } from "@/app/components/ui/Badge";
import { VisuallyHidden } from "@/app/components/ui/VisuallyHidden";

/**
 * Labels and definitions follow the CARA (Contemporary A Cappella Recording
 * Awards, casa.org) categories, which are range-based rather than gender-based.
 */
const VOICING: Record<VoicingValue, { label: string; definition: string }> = {
  upper: {
    label: "Upper voices",
    definition: "Sings in an upper vocal range (SSAA)",
  },
  lower: {
    label: "Lower voices",
    definition: "Sings in a lower vocal range (TTBB)",
  },
  mixed: {
    label: "Mixed voices",
    definition: "Sings in a mix of upper and lower vocal ranges (SATB)",
  },
};

/** One badge naming the range a group sings in: upper, lower or mixed voices. */
export function Voicing({ voicing }: { voicing: VoicingValue }) {
  const { label, definition } = VOICING[voicing];
  return (
    <Badge tone="on-cardinal" title={definition}>
      <VisuallyHidden>Voicing: </VisuallyHidden>
      {label}
    </Badge>
  );
}
