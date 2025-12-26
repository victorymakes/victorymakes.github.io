import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostsByTag, getTags } from "@/lib/fumadocs";
import { Calendar, User, Tag as TagIcon, FolderOpen } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { routing } from "@/i18n/routing";
import { generateMetadata as genMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getTags(locale).map((tag) => ({
      locale,
      slug: tag.id,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const posts = getPostsByTag(slug, locale);
  const t = await getTranslations({ locale, namespace: "notFound" });
  const tPost = await getTranslations({ locale, namespace: "post" });

  if (posts.length === 0) {
    return {
      title: t("tagNotFound"),
    };
  }

  // Find the tag title from the first post
  const tagTitle =
    posts[0].data.tags?.find((t) => t.id === slug)?.title || slug;

  return genMetadata(locale, `/tags/${slug}`, {
    title: `${tagTitle} - ${tPost("tagPrefix")}`,
    description: `${tPost("tagPrefix")} ${tagTitle}`,
  });
}

export default async function TagPage({ params }: Props) {
  const { locale, slug } = await params;

  const posts = getPostsByTag(slug, locale);
  const t = await getTranslations("tags");

  if (posts.length === 0) {
    notFound();
  }

  // Find the tag title from the first post
  const tag = posts[0].data.tags?.find((t) => t.id === slug);
  const tagTitle = tag?.title || slug;

  return (
    <PageContainer className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 border-b pb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <TagIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{tagTitle}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("postsCount", { count: posts.length })}
          </p>
        </div>
      </div>

      {/* Posts List Section */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <article
            key={post.url}
            className="group flex flex-col gap-4 rounded-lg border p-6 transition-colors hover:bg-accent md:flex-row"
          >
            {post.data.cover && (
              <div className="md:w-48 flex-shrink-0">
                <div className="aspect-video overflow-hidden rounded-md">
                  <img
                    src={post.data.cover}
                    alt={post.data.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.data.date.toISOString()}>
                    {post.data.date.toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                {post.data.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.data.author.name}</span>
                  </div>
                )}
                <Link
                  href={`/categories/${post.data.category.id}`}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <FolderOpen className="h-4 w-4" />
                  {post.data.category.title}
                </Link>
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                <Link
                  href={post.url}
                  className="hover:text-primary transition-colors"
                >
                  {post.data.title}
                </Link>
              </h2>
              {post.data.description && (
                <p className="text-muted-foreground line-clamp-2 mb-3">
                  {post.data.description}
                </p>
              )}
              {post.data.tags && post.data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {post.data.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      <TagIcon className="h-3 w-3" />
                      {tag.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </PageContainer>
  );
}
