import { MetadataRoute } from "next";
import { getURL } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/feed.xml", "/admin/"],
      },
    ],
    sitemap: getURL("/sitemap.xml"),
  };
}
