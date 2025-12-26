import { SocialLink } from "@/types/configuration";
import { Globe } from "lucide-react";
import { SiGithub, SiX, SiXiaohongshu } from "react-icons/si";

export const socialLinks: SocialLink[] = [
  {
    title: "GitHub",
    href: "https://github.com/victorymakes",
    icon: SiGithub,
  },
  {
    title: "Twitter",
    href: "https://twitter.com/victorymakes",
    icon: SiX,
  },
  {
    title: "Website",
    href: "https://me.victoryhub.cc",
    icon: Globe,
  },
  {
    title: "Xiaohongshu",
    href: "https://www.xiaohongshu.com/user/profile/605834f00000000001002dfc",
    icon: SiXiaohongshu,
  },
];
