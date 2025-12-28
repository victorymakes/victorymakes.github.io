import { createFromSource } from "fumadocs-core/search/server";
import { postLoader } from "@/lib/fumadocs";
import { createTokenizer } from "@orama/tokenizers/mandarin";

export const { GET } = createFromSource(postLoader, {
  // https://www.fumadocs.dev/docs/headless/search/orama#internationalization
  localeMap: {
    zh: {
      components: {
        tokenizer: createTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
    en: { language: "english" },
  },
});
