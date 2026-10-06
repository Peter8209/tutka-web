import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.tutka.sk", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://www.tutka.sk/ochrana-osobnych-udajov", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
