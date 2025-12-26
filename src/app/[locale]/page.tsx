import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/fumadocs";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("subtitle"),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  const posts = getPosts(locale).slice(0, 6);
  const t = await getTranslations("blog");

  return (
    <PageContainer className="space-y-16">
      {/* Hero Section */}
      <section className="container">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t("recentPosts")}</h2>
          <Button variant="ghost" asChild>
            <Link href="/posts" className="flex items-center gap-2">
              {t("allPosts")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("noPostsYet")}</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.url}
                className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:bg-accent"
              >
                {post.data.cover && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.data.cover}
                      alt={post.data.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.data.date.toISOString()}>
                        {post.data.date.toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
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
                  </div>
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                    <Link
                      href={post.url}
                      className="hover:text-primary transition-colors"
                    >
                      {post.data.title}
                    </Link>
                  </h3>
                  {post.data.description && (
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {post.data.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {post.data.category.title}
                    </span>
                    <Link
                      href={post.url}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("readMore")} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
