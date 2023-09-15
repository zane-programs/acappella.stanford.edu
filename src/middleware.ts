import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const brandingKey = request.nextUrl.searchParams.get("bk");

  brandingKey && requestHeaders.set("x-branding-key", brandingKey);

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}
