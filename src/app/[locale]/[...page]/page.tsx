import { PageContainer } from "@/components/layout/page-container";
import { getPage, getPages } from "@/lib/fumadocs";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/shared/mdx-components";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { generateMetadata as genMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ locale: string; page: string[] }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPages(locale).map((p) => ({
      locale,
      page: p.slugs,
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, page: slugs } = await params;
  const page = getPage(slugs, locale);

  if (!page) {
    const t = await getTranslations({ locale, namespace: "notFound" });
    return {
      title: t("title"),
      description: t("description"),
    };
  }

  return genMetadata(locale, `/${slugs.join("/")}`, {
    title: page.data.title,
    description: page.data.description,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale, page: slugs } = await params;

  const page = getPage(slugs, locale);

  if (!page) {
    notFound();
  }

  const Body = page.data.body;

  return (
    <PageContainer className="space-y-12">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <Body components={getMDXComponents()} />
      </div>
    </PageContainer>
  );
}
