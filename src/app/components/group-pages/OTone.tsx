import { TextLink } from "@/app/components/ui/TextLink";

export default function OTone() {
  return (
    <>
      <p>
        Hi! We&apos;re Stanford O-Tone—Stanford&apos;s all-gender East Asian
        Interest A Cappella group. We perform music across many styles, genres,
        and languages—inspired by East Asian, Asian American, and other Asian
        Diasporic artists such as Laufey, NewJeans, RADWIMPS, G.E.M., and more!
      </p>

      <p>
        Since our founding in 2016, we&apos;ve been fortunate to share our music
        with audiences in the Bay Area and across the U.S.—from community events
        and cultural festivals in Hawai&apos;i and Washington, D.C., to the
        ICCAs. Through these experiences, we&apos;ve loved bringing our music to
        new audiences and building connections across communities.
      </p>

      <p>
        We&apos;re also active on social media, where our reels have reached
        thousands worldwide. On campus, we are proud to contribute to
        Stanford&apos;s larger Asian American community and performing arts
        scene, highlighting the importance of Asian and Asian American
        representation in music.
      </p>

      <p>
        We welcome people from all cultures and backgrounds, and whether
        you&apos;re a curious freshman or a grad student looking for a creative
        break, we&apos;d love to see you at auditions this fall! While we spend
        a lot of time singing together, we spend even more time laughing,
        bonding, and going on adventures. As they say, it&apos;s not work,
        it&apos;s fun!
      </p>

      <p>
        We&apos;ll be holding auditions Monday, Tuesday, and Wednesday of Week
        1, and <strong>no language experience is required.</strong> To sign up
        for an audition slot, please visit{" "}
        <TextLink href="https://calendly.com/stanfordotone" externalIcon={false}>
          calendly.com/stanfordotone
        </TextLink>
        . We hope to see you there!
      </p>

      <div className="mt-6 aspect-video w-full max-w-[480px] overflow-hidden rounded-md ring-1 ring-black-10">
        <iframe
          className="h-full w-full"
          src="https://www.youtube-nocookie.com/embed/uBBtHxh3PfY"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
}
