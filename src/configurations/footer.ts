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
    {
      title: "footer.products",
      menus: [
        {
          href: "https://launchsaas.org",
          title: "footer.product.LaunchSaaS",
          external: true,
        },
        {
          href: "https://victoryhub.cc",
          title: "footer.product.VictoryHub",
          external: true,
        },
        {
          href: "https://me.victoryhub.cc",
          title: "footer.product.Profile",
          external: true,
        },
        {
          href: "https://awesome.victoryhub.cc",
          title: "footer.product.Awesome",
          external: true,
        },
      ],
    },
  ],
};
