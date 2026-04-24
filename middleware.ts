import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Surface the request pathname as an `x-pathname` header so Server
 * Components (including the root layout) can detect the route and
 * apply language-specific attributes. Next.js App Router does not
 * expose the pathname to the root layout directly, so this is the
 * canonical workaround.
 *
 * Why this matters: the <html lang="..."> attribute controls browser
 * auto-translation. On /ja/* we set lang="ja" so Chrome/Edge don't
 * re-translate our already-Japanese UI; on / (English) we set
 * lang="en" so Japanese users get auto-translate offered. Voice
 * response_text is separately marked lang="en" so it gets translated
 * inline regardless of page language.
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Don't run middleware on static assets or the Next internal routes —
  // they don't need the pathname header and adding overhead to every
  // image request is wasteful.
  matcher: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
};
