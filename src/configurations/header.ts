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
  actions: [],
};
