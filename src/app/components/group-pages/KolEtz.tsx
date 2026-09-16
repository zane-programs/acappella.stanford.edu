import { Link, Text } from "@/app/components/chakra";

// TODO(2026-09): Kol Etz is sending a full blurb; replace this placeholder
// when it arrives (see scratch/updates-2026/applied.json → pending).
export default function KolEtz() {
  return (
    <>
      <Text>
        Kol Etz is Stanford&apos;s Jewish a cappella group, founded in 2026.
      </Text>
      <Text>
        More about the group, including audition sign-ups, is coming soon.
        Follow{" "}
        <Link
          href="https://www.instagram.com/koletzacappella"
          target="_blank"
          rel="noopener noreferrer"
        >
          @koletzacappella
        </Link>{" "}
        on Instagram for the latest.
      </Text>
    </>
  );
}
