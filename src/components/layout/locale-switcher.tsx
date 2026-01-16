"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { languages } from "@/lib/i18n";
import { LuLanguages } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LocaleSwitcher({ size }: { size?: "default" | "icon" }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage = languages[locale];

  async function onSelectChange(value: string) {
    router.replace(pathname, { locale: value as Locale });
  }

  return (
    <DropdownMenu>
      {size === "icon" ? (
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-transparent cursor-pointer"
            aria-label="Select language"
          >
            <LuLanguages className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-auto gap-2">
            {currentLanguage?.name ?? "Language"}
          </Button>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent align="end">
        {routing.locales.map((code) => {
          const lang = languages[code];
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => onSelectChange(code)}
              className="cursor-pointer"
            >
              {lang?.name ?? code}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
