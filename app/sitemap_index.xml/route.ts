// Not referenced from robots.ts - kept only for any previously indexed inbound links.
// Redirects to the single real sitemap instead of serving a second, easily-stale copy.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect("https://www.bur0.click/sitemap.xml", 308);
}
