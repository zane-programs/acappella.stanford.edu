import { Container } from "@/app/components/ui/Container";

/** The 32px cardinal Stanford University bar. Always solid, scrolls away. */
export function Masthead() {
  return (
    <div className="bg-cardinal text-white">
      <Container className="flex h-8 items-center">
        <a
          href="https://www.stanford.edu"
          className="font-stanford text-[1.15rem] leading-none tracking-[0.005em] text-white transition-opacity duration-150 hover:opacity-85 focus-ring rounded-sm"
        >
          Stanford University
        </a>
      </Container>
    </div>
  );
}
