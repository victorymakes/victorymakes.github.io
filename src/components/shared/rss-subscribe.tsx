"use client";

import { Button } from "@/components/ui/button";
import { Rss, Check, Copy } from "lucide-react";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function RssSubscribe() {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("blog.rss");
  const locale = useLocale();

  const feedUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/feed.xml`
      : `/${locale}/feed.xml`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="rounded-lg border bg-muted/30 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Rss className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{t("title")}</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{t("description")}</p>

      <div className="flex flex-col sm:flex-row gap-2">
        <code className="flex-1 text-xs bg-background px-3 py-2 rounded border overflow-x-auto whitespace-nowrap">
          {feedUrl}
        </code>
        <Button size="sm" onClick={copyToClipboard} className="gap-2 shrink-0">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              {t("feedCopied")}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t("copyFeed")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
