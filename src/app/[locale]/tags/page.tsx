import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getTags } from "@/lib/fumadocs";
import { Tag } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { generateMetadata as genMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tags" });

  return genMetadata(locale, "/tags", {
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function TagsPage({ params }: Props) {
  const { locale } = await params;

  const tags = getTags(locale);
  const t = await getTranslations("tags");

  return (
    <PageContainer className="space-y-8">
      {/* Header Section */}
      <div className="border-b pb-8">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Tags Cloud Section */}
      {tags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noTagsYet")}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.id}`}
              className="group inline-flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-accent"
            >
              <Tag className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium group-hover:text-primary transition-colors">
                {tag.title}
              </span>
              <span className="text-sm text-muted-foreground">
                ({tag.count})
              </span>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
