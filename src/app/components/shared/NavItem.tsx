"use client";

import { usePathname } from "next/navigation";
import { Link } from "../chakra";

export default function NavItem({
  name,
  href,
}: {
  name: string;
  href: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      as="li"
      role="menuitem"
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      fontWeight={pathname === href ? "700" : "600"}
      color={pathname === href ? "brand.800" : "gray.700"}
      position="relative"
      px="4"
      py="2"
      borderRadius="8px"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        color: "brand.800",
        textShadow: "0 2px 4px rgba(140, 21, 21, 0.2)",
      }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "brand.600",
        outlineOffset: "2px",
      }}
      _before={{
        content: '""',
        position: "absolute",
        bottom: "-2px",
        left: "50%",
        transform: "translateX(-50%)",
        width: pathname === href ? "80%" : "0%",
        height: "2px",
        background: "linear-gradient(90deg, #8c1515, #dc2626)",
        borderRadius: "2px",
        transition: "width 0.3s ease",
      }}
      sx={{
        "&:hover::before": {
          width: "80%",
        },
      }}
    >
      {name}
    </Link>
  );
}
