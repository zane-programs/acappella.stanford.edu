import { TextLink } from "@/app/components/ui/TextLink";

// TODO(2026-09): Kol Etz is sending a full blurb; replace this placeholder
// when it arrives (see scratch/updates-2026/applied.json → pending).
export default function KolEtz() {
  return (
    <>
      <p>Kol Etz is Stanford&apos;s Jewish a cappella group, founded in 2026.</p>
      <p>
        More about the group, including audition sign-ups, is coming soon.
        Follow{" "}
        <TextLink href="https://www.instagram.com/koletzacappella" externalIcon={false}>
          @koletzacappella
        </TextLink>{" "}
        on Instagram for the latest.
      </p>
    </>
  );
}
