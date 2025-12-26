import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const { img: _img, ...restDefaultComponents } = defaultMdxComponents;

  return {
    ...restDefaultComponents,
    hr: Separator,
    img: ({ className, src, alt, ...props }: React.ComponentProps<"img">) => {
      // Ensure src is a string, not an object
      const imgSrc =
        typeof src === "object" && src !== null && "src" in src
          ? (src as { src: string }).src
          : String(src || "");

      return (
        <img
          className={cn("rounded-md border", className)}
          src={imgSrc}
          alt={alt}
          {...props}
        />
      );
    },
    Video: ({ className, ...props }: React.ComponentProps<"video">) => (
      <video
        className={cn("rounded-md border", className)}
        controls
        loop
        {...props}
      />
    ),
    ...components,
  };
}
