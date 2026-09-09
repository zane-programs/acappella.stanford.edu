import Image from "next/image";
import Link from "next/link";
import { MdArrowForward, MdCalendarMonth, MdLocationPin } from "react-icons/md";
import { Badge, Box, Button, Flex, Heading, Text } from "@/app/components/chakra";
import type { FeaturedShow } from "@/app/config/shows";
import {
  Platform,
  formatEventDateTime,
  getCalendarLinks,
} from "@/app/utils/calendar";
import AddToCalendarMenu from "./AddToCalendarMenu";
import InfoRow from "./InfoRow";
import { onDarkButtonProps } from "./buttonStyles";

interface FeaturedShowCardProps {
  featured: FeaturedShow;
  platform: Platform;
}

/**
 * Hero-style card promoting a single upcoming event. Used on the Shows page
 * in place of the "coming soon" placeholder.
 */
export default function FeaturedShowCard({
  featured,
  platform,
}: FeaturedShowCardProps) {
  const { name, tagline, blurb, event, locationFallback, cta } = featured;
  const calendarLinks = getCalendarLinks(event, platform);
  const buttonProps = onDarkButtonProps();
  const headingId = "featured-show-heading";

  return (
    <Box
      as="section"
      aria-labelledby={headingId}
      position="relative"
      overflow="hidden"
      color="white"
      background="linear-gradient(135deg, #8c1515 0%, #a51c1c 55%, #c42525 100%)"
      borderRadius={{ base: "16px", md: "20px" }}
      border="1px solid rgba(255, 255, 255, 0.2)"
      boxShadow="0 20px 40px -12px rgba(140, 21, 21, 0.35), 0 8px 16px -8px rgba(0, 0, 0, 0.15)"
      px={{ base: "5", md: "8" }}
      py={{ base: "6", md: "8" }}
      className="slideInUp"
    >
      {/* Decorative treble clef */}
      <Box
        aria-hidden="true"
        position="absolute"
        right={{ base: "-40px", md: "-10px" }}
        top={{ base: "-30px", md: "-40px" }}
        width={{ base: "180px", md: "300px" }}
        height={{ base: "180px", md: "300px" }}
        opacity="0.12"
        transform="rotate(12deg)"
        pointerEvents="none"
        sx={{ "& img": { filter: "brightness(0) invert(1)" } }}
      >
        <Image
          src="/assets/img/a_cappella_treble_clef_transparent.png"
          alt=""
          fill
          style={{ objectFit: "contain" }}
          draggable={false}
        />
      </Box>

      <Flex direction="column" gap="4" position="relative" maxW="44em">
        <Box>
          <Badge
            background="rgba(255, 255, 255, 0.18)"
            color="white"
            border="1px solid rgba(255, 255, 255, 0.3)"
            borderRadius="full"
            px="3"
            py="1"
            fontSize="xs"
            letterSpacing="0.08em"
            mb="3"
          >
            Featured Event
          </Badge>
          <Heading
            as="h3"
            id={headingId}
            size={{ base: "xl", md: "2xl" }}
            lineHeight="1.1"
            mb="1"
          >
            {name}
          </Heading>
          <Text fontWeight="600" fontSize={{ base: "md", md: "lg" }} opacity="0.95">
            {tagline}
          </Text>
        </Box>

        <Box
          as="ul"
          fontSize={{ base: "md", md: "lg" }}
          sx={{ listStyle: "none" }}
          display="flex"
          flexDirection="column"
          gap="1"
        >
          <InfoRow icon={<MdCalendarMonth />}>
            {formatEventDateTime(event.start, event.end)}
          </InfoRow>
          {(event.location || locationFallback) && (
            <InfoRow icon={<MdLocationPin />}>
              {event.location ?? locationFallback}
            </InfoRow>
          )}
        </Box>

        <Box>
          {blurb.map((paragraph, idx) => (
            <Text key={idx} opacity="0.92" lineHeight="1.5" mb="2">
              {paragraph}
            </Text>
          ))}
        </Box>

        <Flex gap="3" wrap="wrap" mt="1">
          <AddToCalendarMenu
            {...buttonProps}
            links={calendarLinks}
            eventTitle={event.title}
            analyticsLabel={featured.analyticsLabel ?? name}
          />
          {cta && (
            <Button
              {...buttonProps}
              as={Link}
              href={cta.href}
              rightIcon={<MdArrowForward />}
            >
              {cta.label}
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
