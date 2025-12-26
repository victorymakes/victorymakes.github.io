import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { env } from "./env";
import { metadata } from "@/configurations/metadata";
import { author } from "@/configurations/author";
import { getOgLocale, localeMap } from "./i18n";
import { Author } from "@/types/configuration";

const baseUrl = env.NEXT_PUBLIC_APP_URL;

/**
 * Generate alternates metadata for i18n pages
 */
export function generateAlternates(locale: string, path: string) {
  return {
    canonical: `${baseUrl}${locale === routing.defaultLocale ? "" : `/${locale}`}${path}`,
    languages: Object.fromEntries(
      routing.locales.map((loc) => [
        localeMap[loc] || loc,
        `${baseUrl}${loc === routing.defaultLocale ? "" : `/${loc}`}${path}`,
      ]),
    ),
  };
}

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
  const canonical = `${baseUrl}${locale === routing.defaultLocale ? "" : `/${locale}`}${path}`;
  const alternates = Object.fromEntries(
    routing.locales.map((loc) => [
      localeMap[loc] || loc,
      `${baseUrl}${loc === routing.defaultLocale ? "" : `/${loc}`}${path}`,
    ]),
  );
  return {
    metadataBase: env.NEXT_PUBLIC_APP_URL,
    title: options.title,
    description: options.description,
    applicationName: metadata.name,
    category: options.category,
    authors: options.authors || [author],
    keywords: options.tags || metadata.keywords,
    alternates: {
      canonical: canonical,
      languages: alternates,
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
