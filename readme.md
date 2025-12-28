# Modern Blog Template

A modern, full-featured blog system built on [LaunchSaaS](https://launchsaas.org/), powered by Next.js and Fumadocs.

## Features

- **Built on LaunchSaaS** - Leverage the power of LaunchSaaS boilerplate for rapid development
- **MDX Support** - Write blog posts in Markdown with React components
- **Multi-language** - Built-in i18n support with next-intl (English & Chinese)
- **Dark Mode** - Beautiful dark mode with next-themes
- **Edge Deployment** - Deploy to Vercel
- **Math Support** - KaTeX integration for mathematical expressions
- **Syntax Highlighting** - Code blocks with syntax highlighting (GitHub themes)
- **Type-safe** - Full TypeScript support with Zod schema validation
- **Responsive UI** - Modern UI with Radix UI and Tailwind CSS
- **Categories & Tags** - Organize posts with categories and tags
- **Author Profiles** - Support for multiple authors with avatars

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Content**: [Fumadocs](https://fumadocs.vercel.app/) - MDX-based documentation system
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Package Manager**: pnpm

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/your-blog-template.git
cd your-blog-template
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env and update NEXT_PUBLIC_APP_URL
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── content/                # Blog content
│   ├── posts/             # Blog posts
│   │   ├── en/           # English posts
│   │   └── zh/           # Chinese posts
│   └── pages/            # Static pages
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── configurations/   # Site configuration
│   │   ├── metadata.ts  # Site metadata
│   │   ├── author.ts    # Author info
│   │   └── ...
│   ├── i18n/            # Internationalization
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript types
├── public/              # Static assets
├── messages/            # i18n translation files
│   ├── en.json
│   └── zh.json
├── source.config.ts     # Fumadocs configuration
└── next.config.ts       # Next.js configuration
```

## Configuration

### Site Settings

Edit [src/configurations/metadata.ts](src/configurations/metadata.ts) to customize your site:

```typescript
export const metadata: MetadataConfig = {
  name: "Your Blog Name",
  logo: "/avatar.png",
  tagline: "Your tagline",
  description: "Your blog description",
  keywords: ["blog", "tech", "..."],
};
```

### Author Information

Edit [src/configurations/author.ts](src/configurations/author.ts):

```typescript
export const author = {
  name: "Your Name",
  avatar: "/avatar.png",
  url: "https://yourwebsite.com",
};
```

### Navigation & Footer

- Edit [src/configurations/header.ts](src/configurations/header.ts) for navigation
- Edit [src/configurations/footer.ts](src/configurations/footer.ts) for footer links
- Edit [src/configurations/social-links.ts](src/configurations/social-links.ts) for social media

## Writing Content

### Create a New Post

1. Create a new `.md` file in `content/posts/[locale]/`:

```markdown
---
title: Your Post Title
description: Brief description
date: 2024-12-26
category:
  id: "tech"
  title: "Technology"
tags:
  - id: "nextjs"
    title: "Next.js"
  - id: "react"
    title: "React"
author:
  name: "Your Name"
  avatar: "/avatar.png"
cover: "/images/post-cover.jpg"
---

# Your Post Content

Write your content here...
```

2. The post will be automatically indexed and appear on your blog.

### Post Schema

Posts support the following frontmatter fields:

- `title` (required): Post title
- `description` (required): Post description
- `date` (required): Publication date
- `category` (required): Post category with `id` and `title`
- `tags` (optional): Array of tags with `id` and `title`
- `author` (optional): Author info with `name`, `avatar`, and `url`
- `cover` (optional): Cover image URL

## Deployment

### Deployment Options

- **Vercel**: `vercel deploy`
- **Netlify**: Connect your repository
- **Self-hosted**: `pnpm build && pnpm start`

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Customization

### Styling

The project uses Tailwind CSS 4. Customize styles in:

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.js`
- Component styles: Use Tailwind classes

### Components

UI components are built with Radix UI and located in `src/components/`. Customize them to match your design.

### MDX Configuration

Edit [source.config.ts](source.config.ts) to customize MDX processing:

```typescript
export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
```

## i18n (Internationalization)

Add new languages:

1. Add locale to `src/i18n/request.ts`
2. Create translation file in `messages/[locale].json`
3. Create content directory in `content/posts/[locale]/`

## License

MIT License - feel free to use this template for your own blog!

## Credits

- Built with [LaunchSaaS](https://launchsaas.org/)
- Powered by [Next.js](https://nextjs.org/)
- Documentation system by [Fumadocs](https://fumadocs.vercel.app/)
- UI components by [Radix UI](https://www.radix-ui.com/)

## Support

If you found this template helpful, please consider:

- Giving it a star on GitHub
- Sharing it with others
- Contributing improvements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
