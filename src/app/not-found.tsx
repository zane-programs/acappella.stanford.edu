import { Button } from "./components/ui/Button";
import { Heading } from "./components/ui/Heading";
import { Section } from "./components/ui/Section";

export default function NotFound() {
  return (
    <Section className="flex min-h-[60svh] items-center" containerClassName="text-center">
      <div data-reveal className="mx-auto max-w-[36rem]">
        <p className="type-eyebrow text-black-70">404</p>
        <Heading as="h1" size="h1" className="mt-3">
          Page not found
        </Heading>
        {/* Previous copy (through the 2025–26 season):
            "The page you were looking for was not found." */}
        <p className="type-lead mt-4 text-black-70">
          The page you were looking for doesn&apos;t exist or has moved.
        </p>
        <Button href="/" size="lg" className="mt-8">
          Go to the homepage
        </Button>
      </div>
    </Section>
  );
}
