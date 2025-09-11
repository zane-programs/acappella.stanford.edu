import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  Badge,
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  Flex,
  VStack,
  Button,
  HStack,
  Menu,
  MenuList,
  MenuItem,
  ButtonMenuButton,
} from "@/app/components/chakra";
import GROUPS from "../config/groups";
import Link from "next/link";
import Image from "next/image";
import { format as formatDate } from "date-fns";
import { MdLocationPin, MdCalendarMonth } from "react-icons/md";
import { google, office365, ics, type CalendarEvent } from "calendar-link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shows - Stanford A Cappella",
  description:
    "Learn more about auditions, shows, and events for a cappella groups at Stanford University!",
  keywords: [
    "stanford a cappella shows",
    "stanford acapella shows",
    "a cappella shows",
    "acapella shows",
    "stanford shows",
    "shows",
    "shows at stanford",
  ],
};

type Platform = "ios" | "android" | "other";

export default async function Shows() {
  const showsData = await fetchShowsData();
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  let platform: Platform;
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    platform = "ios";
  } else if (/android/i.test(userAgent)) {
    platform = "android";
  } else {
    platform = "other";
  }

  return (
    <>
      <Heading size="lg" as="h2" mb="2">
        Shows
      </Heading>
      {showsData.length > 0 ? (
        <VStack
          gap="3"
          mt="6"
          role="list"
          aria-label="Upcoming a cappella shows"
        >
          {showsData.map((show) => (
            <ShowCard
              key={show.group + ":" + show.title}
              show={show}
              platform={platform}
            />
          ))}
        </VStack>
      ) : (
        <Text>
          Coming soon&mdash;be on the lookout for a cappella shows and
          performances!
        </Text>
      )}
    </>
  );
}

function ShowCard({
  show,
  platform,
}: {
  show: IShowsDataItem;
  platform: Platform;
}) {
  // Find group information
  const groupInfoEntry = Object.entries(GROUPS).find(
    ([_key, group]) =>
      group.name.trim().toLowerCase() === show.group.trim().toLowerCase()
  );

  const event: CalendarEvent = {
    title: show.title,
    description: show.description,
    location: show.location,
    start: show.startDate,
    end: show.endDate,
  };

  // Helper to generate Outlook/Office 365 URL based on platform
  const getOutlookUrl = () => {
    if (platform === "other") {
      return office365(event);
    }

    // Mobile platforms use a different URL scheme
    // (The `ms-outlook://` scheme is used for iOS and Android)
    // Format dates as ISO strings (which are in UTC)
    // Outlook mobile apps should handle the timezone conversion
    const formatISO = (date: Date) => date.toISOString().slice(0, 19) + "Z";
    return `ms-outlook://events/new?title=${encodeURIComponent(
      event.title
    )}&start=${formatISO(event.start)}&end=${formatISO(
      event.end
    )}&location=${encodeURIComponent(
      event.location ?? ""
    )}&description=${encodeURIComponent(event.description ?? "")}`;
  };

  const eventLinks = [
    {
      name: "Apple Calendar",
      url: ics(event),
      noNewTab: true,
    },
    {
      name: "Stanford (Office 365)",
      url: getOutlookUrl(),
    },
    {
      name: "Google Calendar",
      url: google(event),
    },
  ];

  return (
    <Card width="100%" overflow="hidden" role="listitem">
      <Flex direction={{ base: "column", md: "row" }}>
        <Flex
          width={{ base: "100%", md: "220px" }}
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
          p="6"
          sx={{
            "& img": { width: "100%" },
            "& img.placeholder": {
              width: "90px",
            },
            pb: { base: "0", md: "6" },
          }}
        >
          {groupInfoEntry ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={groupInfoEntry[1].imgUrl}
              alt={`${groupInfoEntry[1].name} group photo`}
            />
          ) : (
            <Image
              width={90}
              height={90}
              className="placeholder"
              src="/assets/img/a_cappella_treble_clef_transparent.png"
              alt="Stanford A Cappella logo"
            />
          )}
        </Flex>
        <Box flex={1}>
          <CardHeader pb="0">
            <Box mb="1.5" userSelect="none" sx={{ WebkitUserSelect: "none" }}>
              {groupInfoEntry ? (
                <Badge
                  as={Link}
                  href={"/" + groupInfoEntry[0]}
                  colorScheme="blue"
                >
                  {groupInfoEntry[1].name}
                </Badge>
              ) : (
                <Badge colorScheme="blue">{show.group}</Badge>
              )}
            </Box>
            <Heading size="md" mb="1" as="h3">
              {show.title}
            </Heading>
            <Box
              as="ul"
              fontSize="0.94em"
              color="#444"
              sx={{ listStyle: "none" }}
            >
              <InfoRow mdIcon={<MdCalendarMonth />}>
                {formatDate(show.startDate, "EEE, MMM d, yyyy")}
                {show.showEndTime
                  ? `, ${formatDate(show.startDate, "h:mmaaa")} - ${formatDate(
                      show.endDate,
                      "h:mm a"
                    )}`
                  : ` at ${formatDate(show.startDate, "h:mmaaa")}`}
              </InfoRow>
              <InfoRow mdIcon={<MdLocationPin />}>{show.location}</InfoRow>
            </Box>
          </CardHeader>
          <CardBody>
            {show.description.split("\n").map((line, idx) => (
              <Text key={idx} mb="2.5">
                {line}
              </Text>
            ))}
            <HStack mt="5">
              {show.link && (
                <Button
                  as="a"
                  colorScheme="blue"
                  href={show.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${show.linkText ?? "Learn More"} about ${
                    show.title
                  } (opens in new tab)`}
                >
                  {show.linkText ?? "Learn More"}
                </Button>
              )}
              <Menu placement="bottom">
                {/* <Button colorScheme="blue" display="flex">
                  Add to Calendar <MdChevronRight />
                </Button> */}
                <ButtonMenuButton
                  colorScheme="blue"
                  display="flex"
                  gap="2"
                  alignItems="center"
                  aria-label={`Add ${show.title} to calendar`}
                >
                  <MdCalendarMonth /> Add to Calendar
                </ButtonMenuButton>
                <MenuList>
                  {eventLinks.map((link) => (
                    <MenuItem
                      key={link.name}
                      as="a"
                      href={link.url}
                      target={link.noNewTab ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={`Add to ${link.name}${
                        link.noNewTab ? "" : " (opens in new tab)"
                      }`}
                    >
                      {link.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </HStack>
          </CardBody>
        </Box>
      </Flex>
    </Card>
  );
}

function InfoRow({
  mdIcon,
  children,
}: React.PropsWithChildren<{ mdIcon: React.ReactNode }>) {
  return (
    <Flex
      direction="row"
      gap="1"
      alignItems="center"
      as="li"
      fontSize="inherit"
    >
      {mdIcon}
      <Text flex={1} fontWeight="600" fontSize="inherit">
        {children}
      </Text>
    </Flex>
  );
}

interface IShowsDataItem {
  group: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  description: string;
  showEndTime: boolean;
  link?: string | null;
  linkText?: string | null;
}

function convertKeyToCamelCase(key: string): string {
  // Split the key into words and remove empty strings caused by extra spaces
  const words = key
    .trim()
    .split(" ")
    .filter((word) => word.trim() !== "");

  // Skip leading numeric words
  const firstValidIndex = words.findIndex((word) => !/^\d+$/.test(word));

  if (firstValidIndex === -1) {
    return ""; // No valid word found
  }

  const validWords = words
    .slice(firstValidIndex)
    .map(
      (word) => word.replace(/[^a-z0-9]/gi, "") // Keep only alphanumeric characters
    )
    .filter((word) => word.length > 0); // Filter out any empty strings after cleaning

  return validWords
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

/**
 * Determines if a date is in Pacific Daylight Time (PDT)
 * PDT runs from second Sunday in March to first Sunday in November
 */
function isPacificDaylightTime(
  year: number,
  month: number,
  day: number
): boolean {
  // month is 0-indexed in JavaScript
  const date = new Date(year, month, day);

  // Find second Sunday in March
  const march = new Date(year, 2, 1); // March 1st
  const daysUntilSunday = (7 - march.getDay()) % 7;
  const firstSundayMarch = 1 + daysUntilSunday;
  const secondSundayMarch = firstSundayMarch + 7;
  const dstStart = new Date(year, 2, secondSundayMarch);

  // Find first Sunday in November
  const november = new Date(year, 10, 1); // November 1st
  const daysUntilSundayNov = (7 - november.getDay()) % 7;
  const firstSundayNov = 1 + daysUntilSundayNov;
  const dstEnd = new Date(year, 10, firstSundayNov);

  return date >= dstStart && date < dstEnd;
}

function convertGoogleSheetsDateAndTimeToJSDate(
  dateStr: string,
  timeStr: string
): Date {
  // Extract date component from the date string
  const datePart = dateStr
    .slice(5, -1)
    .split(",")
    .slice(0, 3)
    .map((num: string) => parseInt(num));

  // Extract time component from the time string
  const timePart = timeStr
    .slice(5, -1)
    .split(",")
    .slice(-3)
    .map((num: string) => parseInt(num));

  // Google Sheets provides dates in the format: year, month (0-indexed), day, hour, minute, second
  const [year, month, day] = datePart;
  const [hour, minute, second] = timePart;

  // Determine timezone offset based on DST
  const offset = isPacificDaylightTime(year, month, day) ? "-07:00" : "-08:00";

  // Create ISO string with proper Pacific Time offset
  const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}:${String(second).padStart(2, "0")}${offset}`;

  return new Date(dateString);
}

async function fetchShowsData() {
  const req = await fetch(
    `https://docs.google.com/spreadsheets/d/${
      process.env.SHOWS_SHEET_ID
    }/gviz/tq?tqx=out:json&tq&gid=${process.env.SHOWS_SHEET_GID}&${Date.now()}`
  );
  const res = await req.text();

  const jsonStart = res.indexOf("{");
  const jsonEnd = res.lastIndexOf("}") + 1;
  const gvizData = JSON.parse(res.substring(jsonStart, jsonEnd));

  // Check if sheet empty, and if so return nothing
  if (
    !gvizData.table.cols ||
    gvizData.table.cols.filter((col: any) => !!col.label).length === 0
  ) {
    return [];
  }

  const showsData = gvizData.table.rows.map((row: any) => {
    const rowData: any = {};
    let colData, key, val;
    for (let i = 0; i < row.c.length; i++) {
      if (!row.c[i]) continue;

      colData = gvizData.table.cols[i];
      key = convertKeyToCamelCase(colData.label);

      // Filter out form response labels
      if (!key || key === "timestamp" || key === "emailAddress") continue;

      val = row.c[i].v;
      rowData[key] = val;
    }

    rowData.startDate = convertGoogleSheetsDateAndTimeToJSDate(
      rowData.date,
      rowData.startTime
    );
    rowData.endDate = convertGoogleSheetsDateAndTimeToJSDate(
      rowData.date,
      rowData.endTime
    );

    // Show end time iff showEndTime is checked (value will be "Yes")
    rowData.showEndTime = rowData.showEndTime === "Yes";

    return rowData;
  });

  return (showsData as IShowsDataItem[])
    .filter((show) => show.startDate.getTime() + 86400000 >= Date.now())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}
