"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

interface LinkBadgeProps {
  link: string;
  lightImage: string;
  darkImage: string;
  alt: string;
  width: number;
  height: number;
}

export function LinkBadge({
  link,
  lightImage,
  darkImage,
  alt,
  width,
  height,
}: LinkBadgeProps) {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const imageSrc = currentTheme === "dark" ? darkImage : lightImage;

  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center"
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full object-contain"
      />
    </Link>
  );
}
