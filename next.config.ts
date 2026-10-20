import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // wiki/errors/*.md is read with node:fs at build time by lib/error-cards.ts.
  // Make sure the files travel with the serverless bundle as well.
  outputFileTracingIncludes: {
    "/wiki/errors/**": ["./wiki/errors/*.md"],
    "/ja/wiki/errors/**": ["./wiki/errors/*.md"],
    "/sitemap.xml": ["./wiki/errors/*.md"],
  },
};

export default nextConfig;
