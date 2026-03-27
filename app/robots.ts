import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/privacy", "/termini", "/upgrade"],
    },
    sitemap: "https://www.bur0.click/sitemap.xml",
  };
}
