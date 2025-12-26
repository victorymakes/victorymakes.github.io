import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getPaginatedPosts } from "@/lib/fumadocs";
import { Calendar, User, Tag } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { PageContainer } from "@/components/layout/page-container";
import { generateMetadata as genMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return genMetadata(locale, "/posts", {
    title: t("allPosts"),
    description: t("subtitle"),
  });
}

export default async function PostsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;

  const currentPage = Number(pageParam) || 1;
  const pageSize = 12;
  const paginatedData = getPaginatedPosts(currentPage, pageSize, locale);
  const t = await getTranslations("blog");

  return (
    <PageContainer className="space-y-8">
      {/* Header Section */}
      <div className="border-b pb-8">
        <h1 className="text-4xl font-bold">{t("allPosts")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("postsCount", { count: paginatedData.total })}
        </p>
      </div>

      {/* Posts List Section */}
      {paginatedData.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noPostsYet")}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {paginatedData.items.map((post) => (
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
                      className="hover:text-primary transition-colors"
                    >
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
                          <Tag className="h-3 w-3" />
                          {tag.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {paginatedData.total > pageSize && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(paginatedData.total / pageSize)}
                basePath="/posts"
              />
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
