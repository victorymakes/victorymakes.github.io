import { FooterConfig } from "@/types/configuration";

export const footer: FooterConfig = {
  groups: [
    {
      title: "footer.content",
      menus: [
        {
          href: "/posts",
          title: "header.posts",
        },
        {
          href: "/categories",
          title: "header.categories",
        },
        {
          href: "/tags",
          title: "header.tags",
        },
      ],
    },
    {
      title: "footer.resources",
      menus: [
        {
          href: "https://me.victoryhub.cc",
          title: "header.about",
          external: true,
        },
      ],
    },
  ],
};
