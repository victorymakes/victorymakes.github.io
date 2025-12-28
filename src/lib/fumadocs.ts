import { loader } from "fumadocs-core/source";
import { routing } from "@/i18n/routing";
import { pages, posts } from "fumadocs-mdx:collections/server";
import { PaginatedData } from "@/types/paginated-data";
import { author } from "@/configurations/author";

const i18n = {
  languages: [...routing.locales],
  defaultLanguage: routing.defaultLocale,
  hideLocale: "default-locale" as const,
  parser: "dir" as const,
};

const postLoader = loader({
  i18n,
  baseUrl: "/posts",
  source: posts.toFumadocsSource(),
});

export { postLoader };

export type Post = ReturnType<typeof postLoader.getPages>[number];

export function getPosts(locale?: string): Post[] {
  return postLoader
    .getPages(locale)
    .sort((a, b) => {
      return b.data.date.getTime() - a.data.date.getTime();
    })
    .map((post) => {
      post.data.author = post.data.author || author;
      return post;
    });
}

export function getPaginatedPosts(
  page: number = 1,
  size: number = 10,
  locale?: string,
): PaginatedData<Post> {
  const posts = getPosts(locale);

  const total = posts.length;
  const start = Math.max(0, (page - 1) * size);
  const end = Math.min(start + size, total);
  const items = posts.slice(start, end);

  return {
    page,
    size,
    total,
    items: items,
  };
}

export function getPost(
  slugs: string[] | undefined,
  language?: string,
): Post | undefined {
  const post = postLoader.getPage(slugs, language);
  if (post) {
    post.data.author = post.data.author || author;
  }
  return post;
}

const pageLoader = loader({
  i18n,
  baseUrl: "",
  source: pages.toFumadocsSource(),
});

// Helper function to get all unique categories
export function getCategories(locale?: string) {
  const posts = getPosts(locale);
  const categoryMap = new Map<
    string,
    { id: string; title: string; count: number }
  >();

  posts.forEach((post) => {
    const category = post.data.category;
    if (categoryMap.has(category.id)) {
      const existing = categoryMap.get(category.id)!;
      existing.count += 1;
    } else {
      categoryMap.set(category.id, {
        id: category.id,
        title: category.title,
        count: 1,
      });
    }
  });

  return Array.from(categoryMap.values()).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

// Helper function to get all unique tags
export function getTags(locale?: string) {
  const posts = getPosts(locale);
  const tagMap = new Map<
    string,
    { id: string; title: string; count: number }
  >();

  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      if (tagMap.has(tag.id)) {
        const existing = tagMap.get(tag.id)!;
        existing.count += 1;
      } else {
        tagMap.set(tag.id, { id: tag.id, title: tag.title, count: 1 });
      }
    });
  });

  return Array.from(tagMap.values()).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

// Get posts by category
export function getPostsByCategory(categoryId: string, locale?: string) {
  return getPosts(locale).filter(
    (post) => post.data.category.id === categoryId,
  );
}

// Get posts by tag
export function getPostsByTag(tagId: string, locale?: string) {
  return getPosts(locale).filter((post) =>
    post.data.tags?.some((tag) => tag.id === tagId),
  );
}

export type Page = ReturnType<typeof pageLoader.getPages>[number];

export function getPages(locale?: string): Page[] {
  return pageLoader.getPages(locale);
}

export function getPage(
  slugs: string[] | undefined,
  language?: string,
): Page | undefined {
  return pageLoader.getPage(slugs, language);
}
