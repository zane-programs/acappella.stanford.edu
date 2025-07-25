import { Box, Link, Text } from "@/app/components/chakra";

export default function Footer() {
  return (
    <Box 
      as="footer" 
      textAlign="center" 
      p="8" 
      className="glass"
      borderTop="1px solid rgba(0, 0, 0, 0.1)"
      mt="12"
    >
      <Text 
        fontSize="md" 
        color="gray.600"
        fontWeight="500"
      >
        &copy; {new Date().getFullYear()} Stanford A Cappella |{" "}
        <Link 
          href="/privacy" 
          color="brand.700"
          fontWeight="600"
          position="relative"
          _hover={{
            color: "brand.800",
            textDecoration: "none",
          }}
          _before={{
            content: '""',
            position: "absolute",
            bottom: "-2px",
            left: "0",
            width: "0%",
            height: "2px",
            background: "linear-gradient(90deg, #8c1515, #dc2626)",
            transition: "width 0.3s ease",
          }}
          sx={{
            "&:hover::before": {
              width: "100%",
            },
          }}
        >
          Privacy
        </Link>
      </Text>
    </Box>
  );
}
