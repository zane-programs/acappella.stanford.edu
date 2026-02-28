import { NextRequest, NextResponse } from "next/server";
import BRANDING_OG_OPTIONS from "@/app/config/branding";

const VALID_BRANDING_KEYS = new Set(Object.keys(BRANDING_OG_OPTIONS));

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const brandingKey = request.nextUrl.searchParams.get("bk");

  if (brandingKey && VALID_BRANDING_KEYS.has(brandingKey)) {
    requestHeaders.set("x-branding-key", brandingKey);
  }

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}
