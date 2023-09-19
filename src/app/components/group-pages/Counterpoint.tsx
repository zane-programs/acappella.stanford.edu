import { Text } from "@/app/components/chakra";
import Link from "next/link";

export default function Counterpoint() {
  return (
    <>
      <Text>
        Founded in 1979 by Joyce Rogers and Linda Chin, Counterpoint is Stanford
        University&apos;s second-oldest and only soprano/alto a cappella group,
        and the first soprano/alto a cappella group on the West Coast. Although
        we lovingly call ourselves Stanford&apos;s only women+ a cappella group.
      </Text>
      <Text>
        Counterpoint has recorded twelve albums and has been featured three
        times in Best Of College A Cappella albums. Our albums and recordings
        are featured on Spotify and Apple Music. In 2019, Counterpoint released
        a music video for our single “
        <Link
          href="https://www.youtube.com/watch?v=zilsarLCn0U"
          target="_blank"
          rel="noopener noreferrer"
        >
          God Is A Woman
        </Link>
        ,” filmed in Paris. Our most recent music video, which was filmed in
        Greece, is of our arrangement of ABBA&apos;s &ldquo;Gimme Gimme
        Gimme&rdquo; and will be released soon. Counterpoint is regularly
        invited to perform at all-campus events and holds quarterly
        performances. Off-campus, Counterpoint performs gigs in the Bay Area.
        Counterpoint tours Southern California every year with the Stanford
        Mendicants, and also often travels separately during Spring Break. In
        2023, Counterpoint traveled to Greece, where we say for the Stanford
        Alumni Association of Greece and performed with singers at a Greek
        university. In 2019, Counterpoint flew to Paris for Spring Break, where
        we performed at the U.S. Embassy in central Paris as well as for the
        Stanford Alumni Association of France.
      </Text>
      <Text>
        Counterpoint&apos;s repertoire is diverse, and has included everything
        from Florence and the Machine and Sara Bareilles to Michael Jackson and
        Amy Winehouse. All of our songs are arranged by current or past members,
        and we even perform original music. We are recognized both on and off
        campus for our original arrangements and our love of singing.
      </Text>
    </>
  );
}
