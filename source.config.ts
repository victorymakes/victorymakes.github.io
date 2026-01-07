import { z } from "zod";
import {
  defineConfig,
  frontmatterSchema,
  defineDocs,
} from "fumadocs-mdx/config";
import remarkMath from "remark-math";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";

export const posts = defineDocs({
  dir: "content/posts",
  docs: {
    schema: frontmatterSchema.extend({
      date: z.date(),
      author: z
        .object({
          name: z.string(),
          avatar: z.string().optional(),
          url: z.string().optional(),
        })
        .optional(),
      category: z.object({
        id: z.string(),
        title: z.string(),
      }),
      tags: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
          }),
        )
        .optional(),
      cover: z.string().optional(),
    }),
  },
});

export const pages = defineDocs({
  dir: "content/pages",
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkMdxMermaid],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
