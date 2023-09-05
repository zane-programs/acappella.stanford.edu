import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@/app/components/chakra";

export default function AutoStyledContent({ sx, ...props }: BoxProps) {
  return (
    <Box
      sx={{
        "& .chakra-text": { mt: 0, mb: 4 },
        "& .chakra-heading": { mb: "0.2em" },
        "& section": { mt: 3, mb: 5 },
        "& .chakra-link, & a": { fontWeight: "600", textDecoration: "underline" },
        ...sx,
      }}
      {...props}
    />
  );
}
