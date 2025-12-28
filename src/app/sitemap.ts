import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPosts, getCategories, getTags } from "@/lib/fumadocs";
import { getAlternates, getURL } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add home page for each locale
  routing.locales.forEach((locale) => {
    sitemapEntries.push({
      url: getURL("", locale),
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: getAlternates(""),
    });

    // Add posts page
    sitemapEntries.push({
      url: getURL("/posts", locale),
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: getAlternates("/posts"),
    });

    // Add categories page
    sitemapEntries.push({
      url: getURL("/categories", locale),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: getAlternates("/categories"),
    });

    // Add tags page
    sitemapEntries.push({
      url: getURL("/tags", locale),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: getAlternates("/tags"),
    });

    // Add about page if exists
    // sitemapEntries.push({
    //   url: `${APP_URL}${localePrefix}/about`,
    //   lastModified: currentDate,
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // });

    // Add all posts for this locale
    const posts = getPosts(locale);
    posts.forEach((post) => {
      const postPath = `/posts/${post.slugs.join("/")}`;
      const images = post.data.cover
        ? [getURL(post.data.cover, locale)]
        : undefined;

      sitemapEntries.push({
        url: getURL(postPath, locale),
        lastModified: post.data.date,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: getAlternates(postPath),
        images,
      });
    });

    // Add all categories for this locale
    const categories = getCategories(locale);
    categories.forEach((category) => {
      sitemapEntries.push({
        url: getURL(`/categories/${category.id}`, locale),
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: getAlternates(`/categories/${category.id}`),
      });
    });

    // Add all tags for this locale
    const tags = getTags(locale);
    tags.forEach((tag) => {
      sitemapEntries.push({
        url: getURL(`/tags/${tag.id}`, locale),
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: getAlternates(`/tags/${tag.id}`),
      });
    });
  });

  return sitemapEntries;
}
