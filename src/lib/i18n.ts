import type { createTranslator } from "next-intl";
import { routing } from "@/i18n/routing";

export const languages: Record<string, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇺🇸" },
  zh: { name: "中文", flag: "🇨🇳" },
  ja: { name: "日本語", flag: "🇯🇵" },
  ko: { name: "한국어", flag: "🇰🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  fr: { name: "Français", flag: "🇫🇷" },
  es: { name: "Español", flag: "🇪🇸" },
  ru: { name: "Русский", flag: "🇷🇺" },
  nl: { name: "Nederlands", flag: "🇳🇱" },
  no: { name: "Norsk", flag: "🇳🇴" },
  sv: { name: "Svenska", flag: "🇸🇪" },
  fi: { name: "Suomi", flag: "🇫🇮" },
  da: { name: "Dansk", flag: "🇩🇰" },
  pt: { name: "Português", flag: "🇵🇹" },
  it: { name: "Italiano", flag: "🇮🇹" },
  pl: { name: "Polski", flag: "🇵🇱" },
  uk: { name: "Українська", flag: "🇺🇦" },
  cs: { name: "Čeština", flag: "🇨🇿" },
  tr: { name: "Türkçe", flag: "🇹🇷" },
  ar: { name: "العربية", flag: "🇸🇦" },
  th: { name: "ไทย", flag: "🇹🇭" },
  vi: { name: "Tiếng Việt", flag: "🇻🇳" },
  id: { name: "Bahasa Indonesia", flag: "🇮🇩" },
  ms: { name: "Bahasa Melayu", flag: "🇲🇾" },
  hi: { name: "हिन्दी", flag: "🇮🇳" },
  bn: { name: "বাংলা", flag: "🇧🇩" },
  he: { name: "עברית", flag: "🇮🇱" },
  el: { name: "Ελληνικά", flag: "🇬🇷" },
  hu: { name: "Magyar", flag: "🇭🇺" },
  ro: { name: "Română", flag: "🇷🇴" },
};

/**
 * Mapping from app locales to standard locale format (ISO 639-1 + ISO 3166-1)
 * Used for hreflang, HTML lang attributes, and OpenGraph locale
 * Format: language-COUNTRY (e.g., en-US, zh-CN)
 * @see https://developers.facebook.com/docs/internationalization#locales
 * @see https://en.wikipedia.org/wiki/IETF_language_tag
 */
export const localeMap: Record<string, string> = {
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  ru: "ru-RU",
  nl: "nl-NL",
  no: "no-NO",
  sv: "sv-SE",
  fi: "fi-FI",
  da: "da-DK",
  pt: "pt-PT",
  it: "it-IT",
  pl: "pl-PL",
  uk: "uk-UA",
  cs: "cs-CZ",
  tr: "tr-TR",
  ar: "ar-SA",
  th: "th-TH",
  vi: "vi-VN",
  id: "id-ID",
  ms: "ms-MY",
  hi: "hi-IN",
  bn: "bn-BD",
  he: "he-IL",
  el: "el-GR",
  hu: "hu-HU",
  ro: "ro-RO",
};

/**
 * Get OpenGraph locale format for a given app locale
 * OpenGraph uses underscore format (en_US), converted from standard format (en-US)
 * Falls back to default locale's OG format if not found
 */
export function getOgLocale(locale?: string): string {
  // OpenGraph requires underscore format (en_US)
  return localeMap[locale || routing.defaultLocale].replace("-", "_");
}
