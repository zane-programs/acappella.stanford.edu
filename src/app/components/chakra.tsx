"use client";

import { Button, useMenuButton } from "@chakra-ui/react";

export {
  Badge,
  Collapse,
  Card,
  HStack,
  VStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  Box,
  CardHeader,
  CardBody,
  Heading,
  Flex,
  Container,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  Button,
  Checkbox,
  Grid,
  GridItem,
  Spinner,
  IconButton,
  ListItem,
  List,
  UnorderedList,
  VisuallyHidden,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

export { Link, Image } from "@chakra-ui/next-js";

export function ButtonMenuButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const menuButtonProps = useMenuButton();
  return (
    <Button {...props} {...menuButtonProps}>
      {children}
    </Button>
  );
}
