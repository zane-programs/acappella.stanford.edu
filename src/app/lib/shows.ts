/**
 * Shows data layer: fetches and parses the shows Google Sheet (a Form-backed
 * sheet groups submit to). Extracted verbatim from `app/shows/page.tsx` so the
 * homepage can reuse it; the parsing internals are intentionally unchanged.
 */
import GROUPS, { type ACappellaGroup } from "@/app/config/groups";

export interface ShowItem {
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

/** Case-insensitive match of the sheet's free-text group name to a configured group. */
export function findGroupForShow(
  show: ShowItem
): { slug: string; group: ACappellaGroup } | undefined {
  const wanted = show.group.trim().toLowerCase();
  const entry = Object.entries(GROUPS).find(
    ([_slug, group]) => group.name.trim().toLowerCase() === wanted
  );
  return entry ? { slug: entry[0], group: entry[1] } : undefined;
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

/** Upcoming shows (today onward), soonest first. Empty when the sheet is unset/empty/unreachable. */
export async function fetchShows(): Promise<ShowItem[]> {
  const sheetId = process.env.SHOWS_SHEET_ID;
  const sheetGid = process.env.SHOWS_SHEET_GID;
  if (!sheetId || !sheetGid) return [];

  let res: string;
  try {
    const req = await fetch(
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq&gid=${sheetGid}&${Date.now()}`
    );
    if (!req.ok) return [];
    res = await req.text();
  } catch {
    return [];
  }

  const jsonStart = res.indexOf("{");
  const jsonEnd = res.lastIndexOf("}") + 1;
  if (jsonStart === -1 || jsonEnd === 0) return [];

  let gvizData: any;
  try {
    gvizData = JSON.parse(res.substring(jsonStart, jsonEnd));
  } catch {
    return [];
  }

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

  return (showsData as ShowItem[])
    .filter((show) => show.startDate.getTime() + 86400000 >= Date.now())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}
