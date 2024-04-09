import {
  Box,
  Heading,
  Text,
  ListItem,
  UnorderedList,
} from "@/app/components/chakra";
import AutoStyledContent from "../components/shared/AutoStyledContent";

export default function Privacy() {
  return (
    <AutoStyledContent>
      <Heading size="xl" as="h2">
        Privacy Policy
      </Heading>
      <Text my="4" fontStyle="italic" fontSize="xl">
        Updated April 9, 2024
      </Text>

      <Text fontSize="xl">
        We value the privacy of all our users and are committed to protecting it
        through our compliance with this policy.
      </Text>

      <Box as="section">
        <Heading size="md" as="h2">
          Information We Collect
        </Heading>

        <Text>
          When you use <strong>StanfordACappella.com</strong>, we use
          third-party services like Google Analytics to collect information
          about your engagement and behavior. The Information we collect
          includes but is not limited to:
        </Text>
        <UnorderedList>
          <ListItem>Device information</ListItem>
          <ListItem>Cookies</ListItem>
          <ListItem>Geographic and demographic information</ListItem>
          <ListItem>Log information</ListItem>
        </UnorderedList>

        <Text>
          This information helps us analyze and understand how you use the site,
          improve our service, and enhance our users&apos; experiences.
        </Text>

        <Heading size="md" as="h3">
          How We Use Your Information
        </Heading>

        <Text>Your data may be used for the following purposes:</Text>
        <UnorderedList>
          <ListItem>
            To improve your online experience, to understand user behavior, and
            to gather feedback on our services.
          </ListItem>
          <ListItem>
            To monitor and analyse trends and better understand how users
            interact with our services.
          </ListItem>
        </UnorderedList>
      </Box>

      <Box as="section">
        <Heading size="md" as="h3">
          Information Sharing
        </Heading>

        <Text>
          We do not sell, rent, or otherwise disclose your personal information
          to third parties for their marketing purposes without your explicit
          consent.
        </Text>
      </Box>

      <Box as="section">
        <Heading size="md" as="h3">
          Security
        </Heading>

        <Text>
          The safety and security of your information also depends on you. We
          urge you to be careful about giving out information in public areas of
          the website.
        </Text>
      </Box>

      <Box as="section">
        <Heading size="md" as="h3">
          Hosting
        </Heading>

        <Text>
          Our website is hosted by Vercel. They provide us with the online
          platform that allows us to provide the Service to you. Your data may
          be stored through Vercel&apos;s data storage, databases and the
          general Vercel application. They store your data on secure servers
          behind a firewall.
        </Text>
      </Box>

      <Box as="section">
        <Heading size="md" as="h3">
          Contact Us
        </Heading>

        <Text>
          If you have any questions or concerns about this privacy policy or its
          implementation, you may contact us at{" "}
          <strong>zstjohn [at] stanford [dot] edu</strong>.
        </Text>
      </Box>

      <Box as="section">
        <Heading size="md" as="h3">
          Updates to this Privacy Policy
        </Heading>

        <Text>
          We may change this privacy policy from time to time. If we make
          changes, we will notify you by revising the date at the top of this
          policy and, in some cases, we may provide you with additional notice.
          We encourage you to review this privacy policy whenever you access our
          services to stay informed about our information practices and the ways
          you can help protect your privacy.
        </Text>
      </Box>
    </AutoStyledContent>
  );
}
