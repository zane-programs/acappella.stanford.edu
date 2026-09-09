import { Flex, Text } from "@/app/components/chakra";

/** Icon + text line used for event details (date, location, ...). */
export default function InfoRow({
  icon,
  children,
}: React.PropsWithChildren<{ icon: React.ReactNode }>) {
  return (
    <Flex
      direction="row"
      gap="1.5"
      alignItems="center"
      as="li"
      fontSize="inherit"
    >
      {icon}
      <Text flex={1} fontWeight="600" fontSize="inherit">
        {children}
      </Text>
    </Flex>
  );
}
