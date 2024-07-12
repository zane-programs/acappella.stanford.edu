import type { Metadata } from "next";
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
  Icon,
} from "@/app/components/chakra";
import GROUPS from "../config/groups";
import Link from "next/link";
import { format as formatDate, parse as parseDate } from "date-fns";
import { MdLocationPin, MdCalendarMonth } from "react-icons/md";

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

export default async function Shows() {
  const showsData = await fetchShowsData();
  return (
    <>
      <Heading size="lg" as="h2" mb="2">
        Shows
      </Heading>
      <VStack gap="3" mt="6">
        {showsData.map((show) => (
          <ShowCard key={show.group + ":" + show.title} show={show} />
        ))}
      </VStack>
    </>
  );
}

function ShowCard({ show }: { show: IShowsDataItem }) {
  // Find group information
  const groupInfoEntry = Object.entries(GROUPS).find(
    ([_key, group]) =>
      group.name.trim().toLowerCase() === show.group.trim().toLowerCase()
  );

  return (
    <Card width="100%" overflow="hidden">
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
            <img src={groupInfoEntry[1].imgUrl} alt={groupInfoEntry[1].name} />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
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
            <Heading size="md" mb="1">
              {show.title}
            </Heading>
            <Box as="ul" fontSize="0.94em" color="#444">
              <InfoRow mdIcon={<MdCalendarMonth />}>
                {formatDate(show.date, "EEE, MMM d, yyyy 'at' h:mmaaa")}
              </InfoRow>
              <InfoRow mdIcon={<MdLocationPin />}>{show.location}</InfoRow>
            </Box>
          </CardHeader>
          <CardBody>
            <Text>{show.description}</Text>
            {show.link && (
              <Button
                as="a"
                colorScheme="blue"
                href={show.link}
                target="_blank"
                rel="noopener noreferrer"
                mt="4"
              >
                {show.linkTitle ?? "Learn More"}
              </Button>
            )}
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
  date: Date;
  location: string;
  description: string;
  link?: string | null;
  linkTitle?: string | null;
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
      key = colData.label;

      // Filter out form response labels
      if (!key || key === "timestamp" || key === "email") continue;

      val = row.c[i].v;
      rowData[key] = val;
    }

    // Extract date
    const dateP1 = rowData.date
      .slice(5, -1)
      .split(",")
      .slice(0, 3)
      .map((num: string) => parseInt(num));

    // Extract time
    const dateP2 = rowData.time
      .slice(5, -1)
      .split(",")
      .slice(-3)
      .map((num: string) => parseInt(num));

    // Construct date from the two parts above
    delete rowData.time;
    rowData.date = Reflect.construct(Date, [...dateP1, ...dateP2]);

    return rowData;
  });

  console.log(showsData);

  return (showsData as IShowsDataItem[])
    .filter((show) => show.date.getTime() + 86400000 >= Date.now())
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
