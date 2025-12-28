import { Feed } from "feed";
import { getPosts } from "@/lib/fumadocs";
import { metadata } from "@/configurations/metadata";
import { author } from "@/configurations/author";
import { getURL } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { locale } = await params;

  const feed = new Feed({
    title: metadata.name,
    description: metadata.description,
    id: getURL("", locale),
    link: getURL("", locale),
    language: locale,
    image: getURL("/avatar.png", locale),
    favicon: getURL("/favicon.ico", locale),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author.name}`,
    updated: new Date(),
    feedLinks: {
      rss2: getURL("/feed.xml", locale, true),
    },
    author: {
      name: author.name,
      link: author.url,
    },
  });

  // Get posts for this specific locale
  const posts = getPosts(locale);

  posts.forEach((post) => {
    const postUrl = getURL(`/posts/${post.slugs.join("/")}`, locale);

    feed.addItem({
      title: post.data.title,
      id: postUrl,
      link: postUrl,
      description: post.data.description || "",
      content: post.data.description || "",
      author: [
        {
          name: post.data.author?.name || author.name,
          link: post.data.author?.url || author.url,
        },
      ],
      date: post.data.date,
      image: post.data.cover ? getURL(post.data.cover) : undefined,
      category: [
        {
          name: post.data.category.title,
          term: post.data.category.id,
        },
      ],
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
