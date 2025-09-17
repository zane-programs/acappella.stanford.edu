import { Link, Text } from "@/app/components/chakra";

export default function OTone() {
  return (
    <>
      <Text>
        Hi! We’re Stanford O-Tone—Stanford’s all-gender East Asian Interest A
        Cappella group. We perform music across many styles, genres, and
        languages—inspired by East Asian, Asian American, and other Asian
        Diasporic artists such as Laufey, NewJeans, RADWIMPS, G.E.M., and more!
      </Text>

      <Text>
        Since our founding in 2016, we’ve been fortunate to share our music with
        audiences in the Bay Area and across the U.S.—from community events and
        cultural festivals in Hawai’i and Washington, D.C., to the ICCAs .
        Through these experiences, we’ve loved bringing our music to new
        audiences and building connections across communities.
      </Text>

      <Text>
        We’re also active on social media, where our reels have reached
        thousands worldwide. On campus, we are proud to contribute to Stanford’s
        larger Asian American community and performing arts scene, highlighting
        the importance of Asian and Asian American representation in music.
      </Text>

      <Text>
        We welcome people from all cultures and backgrounds, and whether you’re
        a curious freshman or a grad student looking for a creative break, we’d
        love to see you at auditions this fall! While we spend a lot of time
        singing together, we spend even more time laughing, bonding, and going
        on adventures. As they say, it's not work, it's fun!
      </Text>

      <Text display="flex" alignItems="center" justifyContent="center">
        <iframe
          src="https://www.youtube-nocookie.com/embed/wdceVlS9oFM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          width="360"
          height="203"
        ></iframe>
      </Text>

      <Text>
        We’ll be holding auditions Monday, Tuesday, and Wednesday of Week 1, and
        no language experience is required. To sign up for an audition slot,
        please visit{" "}
        <Link href="https://calendly.com/stanfordotone" target="_blank">
          calendly.com/stanfordotone
        </Link>
        . We hope to see you there!
      </Text>
    </>
  );
}
