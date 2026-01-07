import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlogCoverProps {
  title: string;
  description?: string;
  coverImage?: string;
  className?: string;
}

export function BlogCover({
  title,
  description,
  coverImage,
  className,
}: BlogCoverProps) {
  if (coverImage) {
    return (
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden",
          className,
        )}
      >
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
    );
  }

  // Default gradient cover when no image
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border p-6 md:p-8",
        className,
      )}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 max-w-3xl">
          {/* Top decorative line */}
          <div className="bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full w-16 md:w-20 h-1" />

          {/* Title */}
          <h3 className="text-center font-bold text-foreground/90 line-clamp-3 text-lg md:text-2xl px-4 ">
            {title}
          </h3>

          {/* Description - only show when provided */}
          {description && (
            <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mx-auto px-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Bottom decorative line */}
          <div className="bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30 rounded-full w-12 md:w-16 h-1" />
        </div>
      </div>
    </div>
  );
}
