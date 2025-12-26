import { Feed } from "feed";
import { getPosts } from "@/lib/fumadocs";
import { metadata } from "@/configurations/metadata";
import { author } from "@/configurations/author";
import { env } from "@/lib/env";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { locale } = await params;
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  const feed = new Feed({
    title: metadata.name,
    description: metadata.description,
    id: baseUrl,
    link: `${baseUrl}/${locale}`,
    language: locale,
    image: `${baseUrl}/avatar.png`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author.name}`,
    updated: new Date(),
    feedLinks: {
      rss2: `${baseUrl}/${locale}/feed.xml`,
    },
    author: {
      name: author.name,
      link: author.url,
    },
  });

  // Get posts for this specific locale
  const posts = getPosts(locale);

  posts.forEach((post) => {
    const postUrl = `${baseUrl}${post.url}`;

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
      image: post.data.cover ? `${baseUrl}${post.data.cover}` : undefined,
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
