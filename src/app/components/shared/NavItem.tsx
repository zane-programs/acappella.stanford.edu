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
      href={href}
      // Bold on route selected
      fontWeight={pathname === href ? "700" : undefined}
    >
      {name}
    </Link>
  );
}
