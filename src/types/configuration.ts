import type { IconType } from "react-icons";

// Navigation Bar Types
export interface MenuItem {
  title: string;
  href: string;
  messageKey?: string;
  external?: boolean;
  icon?: IconType;
  description?: string;
}

export interface NestedMenuItem {
  title: string;
  messageKey?: string;
  children: MenuItem[];
}

export type NavBarItem = MenuItem | NestedMenuItem;

export interface NavBarAction {
  item: MenuItem;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
}

export interface NavBarConfig {
  items: NavBarItem[];
  actions: NavBarAction[];
}

// Footer Types
export interface FooterMenuItem {
  title: string;
  href: string;
  messageKey?: string;
  external?: boolean;
}

export interface FooterGroup {
  title: string;
  messageKey?: string;
  menus: FooterMenuItem[];
}

export interface FooterBadge {
  link: string;
  lightImage: string;
  darkImage?: string;
  alt: string;
  width: number;
  height: number;
}

export interface FooterConfig {
  groups: FooterGroup[];
  badges?: FooterBadge[];
}

// Metadata Types
export interface MetadataConfig {
  name: string;
  logo: string;
  tagline: string;
  description?: string;
  keywords?: string[];
}

// Social Links Types
export interface SocialLink {
  title: string;
  href: string;
  icon: IconType;
}

export interface Author {
  name: string;
  url?: string;
  avatar?: string;
}
