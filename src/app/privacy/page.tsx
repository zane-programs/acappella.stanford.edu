import { Box, Heading, Text } from "@/app/components/chakra";
import AutoStyledContent from "../components/shared/AutoStyledContent";

export default function Privacy() {
  return (
    <AutoStyledContent>
      <Heading size="xl" as="h2">
        Privacy Policy
      </Heading>
      <Text my="4" fontStyle="italic" fontSize="xl">
        Updated September 5, 2023
      </Text>
      <Box as="section">
        <Text fontSize="xl">
          By using <strong>StanfordACappella.com</strong> (hereinafter referred
          as &ldquo;the Site&rdquo;), users agree to the collection and use of
          their personal information as described in this Privacy Policy.
        </Text>
      </Box>
      <Box as="section">
        <Heading size="md" as="h3">
          Information Collection and Use
        </Heading>
        <Text>
          While using the Site, we may ask you to provide us with certain
          personally identifiable information. This information may include but
          is not limited to your email address, name, and phone number. We use
          this information for the purpose of providing and improving the Site
          and adhering to your requests or inquiries.
        </Text>
      </Box>
      <Box as="section">
        <Heading size="md" as="h3">
          Cookies
        </Heading>
        <Text>
          We use &ldquo;cookies&rdquo; to collect information in order to
          improve our Site for you. You have the option to accept or reject
          these cookies. If you decide to reject our cookies, you may not be
          able to use some portions of our Site.
        </Text>
      </Box>
      <Box as="section">
        <Heading size="md" as="h3">
          Google Analytics
        </Heading>
        <Text>
          The Site uses Google Analytics to measure and evaluate access to and
          traffic on the Public Area of the Site, and create user navigation
          reports for our Site administrators. Google operates independently
          from us and has its own privacy policy which we strongly encourage you
          to review. Google may use the information collected through Google
          Analytics to evaluate Users&apos; and Visitors&apos; activity on our
          Site. For more information, see{" "}
          <a
            href="https://www.google.com/policies/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy and Terms
          </a>
          .
        </Text>
      </Box>
      <Box as="section">
        <Heading size="md" as="h3">
          Hosting
        </Heading>
        <Text>
          The Site is hosted by Vercel. Vercel operates independently from us
          and has its own privacy policy, which we strongly encourage you to
          review. More information on Vercel can be found at{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel Privacy Policy
          </a>
          .
        </Text>
      </Box>
      <Box as="section">
        <Heading size="md" as="h3">
          Changes to This Privacy Policy
        </Heading>
        <Text>
          We may update our Privacy Policy from time to time. Therefore, we
          advise you to review this page periodically for any changes. We will
          notify you of any changes by posting the new Privacy Policy on this
          page. These changes are effective immediately, after they are posted
          on this page.
        </Text>
      </Box>
      <Box as="section">
        <Heading size="md" as="h3">
          Contact Us
        </Heading>
        <Text>
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us:{" "}
          <strong>zstjohn [at] stanford [dot] edu</strong>
        </Text>
      </Box>
    </AutoStyledContent>
  );
}
