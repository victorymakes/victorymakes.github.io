"use client";

import { Button } from "@/components/ui/button";
import {
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Mail,
  Twitter,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ShareProps {
  url: string;
  title: string;
  description?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function Share({
  url,
  title,
  description,
  size = "default",
  className,
}: ShareProps) {
  const t = useTranslations("share");

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:text-[#1877F2]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:text-[#0A66C2]",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description || title)}%0A%0A${encodeURIComponent(url)}`,
      color: "hover:text-primary",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("linkCopied"));
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const iconSize =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const buttonSize =
    size === "sm" ? "icon-sm" : size === "lg" ? "icon" : "icon-sm";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.name}
            variant="outline"
            size={buttonSize}
            asChild
            className={cn("transition-colors", link.color)}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${link.name}`}
            >
              <Icon className={iconSize} />
            </a>
          </Button>
        );
      })}
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleCopyLink}
        className="hover:text-primary transition-colors"
        aria-label={t("copyLink")}
      >
        <LinkIcon className={iconSize} />
      </Button>
    </div>
  );
}
