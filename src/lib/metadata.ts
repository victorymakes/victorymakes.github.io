import type { Metadata } from "next";
import { metadata } from "@/configurations/metadata";
import { author } from "@/configurations/author";
import { getAlternates, getOgLocale, getURL } from "./i18n";
import { Author } from "@/types/configuration";

type MetadataOptions = {
  title: string;
  description?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: Author[] | Author;
  images?: string[] | string;
  tags?: string[];
  category?: string;
};

/**
 * Generate metadata with alternates for i18n pages
 */
export function generateMetadata(
  locale: string,
  path: string,
  options: MetadataOptions,
): Metadata {
  const canonical = getURL(path, locale);
  const alternates = getAlternates(path);
  return {
    metadataBase: getURL(""),
    title: options.title,
    description: options.description,
    applicationName: metadata.name,
    category: options.category,
    authors: options.authors || [author],
    keywords: options.tags || metadata.keywords,
    alternates: {
      canonical: canonical,
      ...alternates,
    },
    openGraph: {
      title: options.title,
      description: options.description,
      siteName: metadata.name,
      locale: getOgLocale(locale),
      type: options.type || "website",
      ...(options.type === "article" && {
        publishedTime: options.publishedTime,
        authors: options.authors || [author],
        images: options.images,
        tags: options.tags,
        url: canonical,
      }),
    },
    twitter: {
      card: options.images ? "summary_large_image" : "summary",
      title: options.title,
      description: options.description,
      images: options.images,
    },
  };
}
