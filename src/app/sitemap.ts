import type { MetadataRoute } from "next";
import { lastModified, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: lastModified.home,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${siteUrl}/images/walkin-about-hero.png`, `${siteUrl}/images/walkin-wallpaper.png`],
    },
    {
      url: `${siteUrl}/walkin/development-journey`,
      lastModified: lastModified.journey,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [`${siteUrl}/images/walkin-icon.png`],
    },
  ];
}
