import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPost, getPosts } from "@/lib/fumadocs";
import {
  Calendar,
  User,
  ArrowLeft,
  Tag as TagIcon,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { Share } from "@/components/shared/share";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMDXComponents } from "@/components/shared/mdx-components";
import { generateMetadata as genMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return getPosts().map((post) => ({
    locale: post.locale,
    slug: post.slugs[0],
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost([slug], locale);

  if (!post) {
    const t = await getTranslations({ locale, namespace: "notFound" });
    return {
      title: t("postNotFound"),
    };
  }

  return genMetadata(locale, `/posts/${slug}`, {
    title: post.data.title,
    description: post.data.description,
    type: "article",
    publishedTime: post.data.date.toISOString(),
    authors: post.data.author,
    images: post.data.cover,
  });
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;

  const post = getPost([slug], locale);
  const t = await getTranslations("post");

  if (!post) {
    notFound();
  }

  const MDXContent = post.data.body;
  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://victorymakes.com"}${post.url}`;

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Content */}
        <article className="min-w-0">
          {/* Cover Image */}
          {post.data.cover && (
            <div className="mb-8 aspect-video overflow-hidden rounded-lg">
              <img
                src={post.data.cover}
                alt={post.data.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {post.data.title}
            </h1>

            {post.data.description && (
              <p className="text-xl text-muted-foreground">
                {post.data.description}
              </p>
            )}

            {/* Meta Information - Mobile */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground lg:hidden">
              {post.data.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.data.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.data.date.toISOString()}>
                  {post.data.date.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <MDXContent components={getMDXComponents()} />
          </div>

          {/* Back Button Bottom */}
          <div className="mt-12 pt-8 border-t">
            <Button variant="outline" asChild>
              <Link href="/posts" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t("backToPosts")}
              </Link>
            </Button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-6">
          {/* Table of Contents */}
          {post.data.toc && post.data.toc.length > 0 && (
            <InlineTOC
              items={post.data.toc}
              defaultOpen={true}
              className="rounded-lg bg-muted/50 border p-4"
            />
          )}

          {/* Author Card */}
          {post.data.author && (
            <div className="rounded-lg bg-muted/50 p-6 border space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Avatar>
                    <AvatarImage
                      src={post.data.author.avatar}
                      alt={post.data.author.name}
                    />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-semibold text-sm">{t("author")}</p>
                  {post.data.author.url ? (
                    <Link
                      href={post.data.author.url}
                      className="text-sm text-muted-foreground"
                      target="_blank"
                    >
                      {post.data.author.name}
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {post.data.author.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Category Card */}
          <Link
            href={`/categories/${post.data.category.id}`}
            className="block rounded-lg bg-muted/50 p-6 border hover:bg-accent transition-colors space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t("category")}</p>
                <p className="text-sm text-muted-foreground">
                  {post.data.category.title}
                </p>
              </div>
            </div>
          </Link>

          {/* Tags Card */}
          {post.data.tags && post.data.tags.length > 0 && (
            <div className="rounded-lg bg-muted/50 p-6 border space-y-3">
              <p className="font-semibold text-sm">{t("tags")}</p>
              <div className="flex flex-wrap gap-2">
                {post.data.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Published Date */}
          <div className="rounded-lg bg-muted/50 p-6 border space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t("published")}</p>
                <time
                  dateTime={post.data.date.toISOString()}
                  className="text-sm text-muted-foreground"
                >
                  {post.data.date.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="flex flex-col items-center justify-center gap-4 text-center rounded-lg bg-muted/50 p-6 border">
            <p className="font-semibold">{t("sharePrompt")}</p>
            <p className="text-sm font-medium text-muted-foreground">
              {t("shareDescription")}
            </p>
            <Share
              url={fullUrl}
              title={post.data.title}
              description={post.data.description}
              size="default"
              className="w-full justify-center"
            />
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
