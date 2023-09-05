import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@/app/components/chakra";

export default function AutoStyledContent({ sx, ...props }: BoxProps) {
  return (
    <Box
      sx={{
        "& .chakra-text": { mt: 0, mb: 4 },
        "& section": { mt: 3, mb: 4 },
        "& .chakra-link": { fontWeight: "600", textDecoration: "underline" },
        ...sx,
      }}
      {...props}
    />
  );
}
