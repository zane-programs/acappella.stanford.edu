import { Link, Text } from "@/app/components/chakra";

export default function Talisman() {
  return (
    <>
      <Text>
        We are Stanford Talisman, a group of singers on Stanford&apos;s campus
        who since our origins have sung music stemming from Black liberation
        struggles across the world. Our alumni and current group came together
        to create a virtual choir of Lift Every Voice and Sing, the Black
        National Anthem in America. We&apos;ve also been raising funds for
        organizations contributing to the movement for Black lives in America.
        You check out{" "}
        <Link
          href="https://www.pb-resources.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          pb-resources.com
        </Link>{" "}
        for a list of further resources compiled by Alexis Williams, a
        19-year-old Computer Science major at New York University. She is an
        African American and Latina coder committed to seeing change through
        action. Her website is a comprehensive source featuring educational
        resources, petitions to sign, a list of organizations seeking donations,
        and more.
      </Text>
    </>
  );
}
