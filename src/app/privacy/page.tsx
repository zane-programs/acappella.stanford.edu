import type { Metadata } from "next";

import { Eyebrow } from "../components/ui/Eyebrow";
import { Heading } from "../components/ui/Heading";
import { Prose } from "../components/ui/Prose";
import { Section } from "../components/ui/Section";

export const metadata: Metadata = {
  title: "Privacy - Stanford A Cappella",
  description: "Privacy policy for acappella.stanford.edu.",
};

export default function Privacy() {
  return (
    <>
      <Section spacing="tight" className="pt-14 md:pt-20 lg:pt-24">
        <div data-reveal className="max-w-[46rem]">
          <Eyebrow>Legal</Eyebrow>
          <Heading as="h1" size="h1" className="mt-3">
            Privacy policy
          </Heading>
          <p className="type-small mt-4 text-black-60">Updated April 9, 2024</p>
          <p className="type-lead mt-5 text-black-80">
            We value the privacy of all our users and are committed to protecting it through
            our compliance with this policy.
          </p>
        </div>
      </Section>

      <Section spacing="tight" className="pb-20 md:pb-28">
        <Prose data-reveal>
          <h2>Information we collect</h2>
          <p>
            When you use <strong>acappella.stanford.edu</strong>, we use third-party services
            like Google Analytics to collect information about your engagement and behavior.
            The information we collect includes but is not limited to:
          </p>
          <ul>
            <li>Device information</li>
            <li>Cookies</li>
            <li>Geographic and demographic information</li>
            <li>Log information</li>
          </ul>
          <p>
            This information helps us analyze and understand how you use the site, improve
            our service, and enhance our users&apos; experiences.
          </p>

          <h3>How we use your information</h3>
          <p>Your data may be used for the following purposes:</p>
          <ul>
            <li>
              To improve your online experience, to understand user behavior, and to gather
              feedback on our services.
            </li>
            <li>
              To monitor and analyse trends and better understand how users interact with
              our services.
            </li>
          </ul>

          <h2>Information sharing</h2>
          <p>
            We do not sell, rent, or otherwise disclose your personal information to third
            parties for their marketing purposes without your explicit consent.
          </p>

          <h2>Security</h2>
          <p>
            The safety and security of your information also depends on you. We urge you to
            be careful about giving out information in public areas of the website.
          </p>

          <h2>Hosting</h2>
          <p>
            Our website is hosted by Vercel. They provide us with the online platform that
            allows us to provide the Service to you. Your data may be stored through
            Vercel&apos;s data storage, databases and the general Vercel application. They
            store your data on secure servers behind a firewall.
          </p>

          <h2>Contact us</h2>
          <p>
            If you have any questions or concerns about this privacy policy or its
            implementation, you may contact us at{" "}
            <strong>zstjohn [at] stanford [dot] edu</strong>.
          </p>

          <h2>Updates to this privacy policy</h2>
          <p>
            We may change this privacy policy from time to time. If we make changes, we will
            notify you by revising the date at the top of this policy and, in some cases, we
            may provide you with additional notice. We encourage you to review this privacy
            policy whenever you access our services to stay informed about our information
            practices and the ways you can help protect your privacy.
          </p>
        </Prose>
      </Section>
    </>
  );
}

/* Previous page referred to the site as "StanfordACappella.com"; the domain is
   now acappella.stanford.edu (updated 2026-09-16). All other copy unchanged. */
