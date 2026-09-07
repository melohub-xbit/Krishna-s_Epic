import type { MetadataRoute } from "next";

/**
 * The front page is the portfolio and it is meant to be read by
 * everything — people, crawlers, and whatever a recruiter's tooling is
 * doing this week. components/Machine.tsx makes sure a reader that does
 * not run layout still gets all of it in order.
 *
 * /interests is the other half, and it is not for them. Not secret, not
 * blocked, just not offered: no crawl, no index, and nofollow on the
 * door that leads to it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/interests" }],
  };
}
