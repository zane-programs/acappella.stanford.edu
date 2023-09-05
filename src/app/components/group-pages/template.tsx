import { Text, Link } from "@/app/components/chakra";

export default function Template() {
  return (
    <>
      <Text>
        Add text here. And add{" "}
        <Link href="https://www.google.com" target="_blank">
          links
        </Link>{" "}
        like this!
      </Text>
      <Text>Add another paragraph like this...</Text>
    </>
  );
}
