import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategories } from "@/lib/fumadocs";
import { FolderOpen } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { generateMetadata as genMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  return genMetadata(locale, `/categories`, {
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params;

  const categories = getCategories(locale);
  const t = await getTranslations("categories");

  return (
    <PageContainer className="space-y-8">
      {/* Header Section */}
      <div className="border-b pb-8">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Categories Grid Section */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noCategoriesYet")}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group flex flex-col gap-3 rounded-lg border p-6 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {category.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("postsCount", { count: category.count })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
