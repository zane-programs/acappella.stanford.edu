import { Link, Text } from "@/app/components/chakra";

export default function OTone() {
  return (
    <>
      <Text>
        As Stanford&apos;s newest a cappella group, founded in 2016, we are
        committed to sharing East Asian music and culture to the world through
        song!
      </Text>
      <Text>
        We sing a wide variety of styles and genres ranging from traditional
        folk songs to contemporary pop, alternative rock, and R&B — primarily in
        Chinese, Korean, and Japanese, but with the occasional English mash-up.
        No language experience is required to audition, though!
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
        We would love for you to join us this year! We will be holding auditions
        Monday, Tuesday, and Wednesday of Week 1 -- for more information, and to
        sign up for an audition slot, please visit{" "}
        <Link
          href="https://calendly.com/stanfordotone"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://calendly.com/stanfordotone
        </Link>
        .
      </Text>
    </>
  );
}
