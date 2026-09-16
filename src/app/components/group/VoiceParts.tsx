import { VoicePart } from "@/app/config/groups";
import { Badge } from "@/app/components/ui/Badge";
import { VisuallyHidden } from "@/app/components/ui/VisuallyHidden";

const PARTS: { flag: VoicePart; short: string; long: string }[] = [
  { flag: VoicePart.Soprano, short: "S", long: "Soprano" },
  { flag: VoicePart.Alto, short: "A", long: "Alto" },
  { flag: VoicePart.Tenor, short: "T", long: "Tenor" },
  { flag: VoicePart.Bari_Bass, short: "B", long: "Baritone/Bass" },
];

/** Voice-part chips derived from the `VoicePart` bitmask (S · A · T · B). */
export function VoiceParts({ parts }: { parts: VoicePart }) {
  const present = PARTS.filter((p) => (parts & p.flag) !== 0);
  if (present.length === 0) return null;

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Voice parts">
      <VisuallyHidden>{present.map((p) => p.long).join(" · ")}</VisuallyHidden>
      {present.map((p) => (
        <Badge key={p.short} tone="on-cardinal" aria-hidden="true" title={p.long}>
          {p.short}
        </Badge>
      ))}
    </div>
  );
}
