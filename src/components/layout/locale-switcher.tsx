"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/lib/i18n";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage = languages[locale];

  async function onSelectChange(value: string) {
    router.replace(pathname, { locale: value as Locale });
  }

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange}>
      <SelectTrigger
        className="w-auto gap-2 cursor-pointer"
        aria-label="Select language"
      >
        <SelectValue placeholder={currentLanguage?.name ?? "Language"} />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((code) => {
          const lang = languages[code];
          return (
            <SelectItem key={code} value={code}>
              {lang?.flag} {lang?.name ?? code}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
