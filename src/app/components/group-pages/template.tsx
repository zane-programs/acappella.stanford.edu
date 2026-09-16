import { TextLink } from "@/app/components/ui/TextLink";

/**
 * Starting point for a new group's bio. Bios render inside `ui/Prose`, so
 * plain <p> and links are all that's needed.
 */
export default function Template() {
  return (
    <>
      <p>
        Add text here. And add{" "}
        <TextLink href="https://www.google.com">links</TextLink> like this!
      </p>
      <p>Add another paragraph like this...</p>
    </>
  );
}
