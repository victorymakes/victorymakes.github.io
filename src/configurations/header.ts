import { NavBarConfig } from "@/types/configuration";

export const header: NavBarConfig = {
  items: [
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
    {
      href: "https://me.victoryhub.cc",
      title: "header.about",
      external: true,
    },
  ],
  actions: [
    {
      item: {
        href: "https://github.com/victorymakes/victorymakes.github.io",
        title: "header.useTemplate",
        external: true,
      },
    },
  ],
};
