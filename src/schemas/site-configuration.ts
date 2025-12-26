import { LucideIcon } from "lucide-react";

// Re-export types from configuration.ts for compatibility
export interface MenuItem {
  title: string;
  href: string;
  messageKey?: string;
  external?: boolean;
  icon?: LucideIcon;
  description?: string;
}

export interface NestedMenuItem {
  title: string;
  messageKey?: string;
  children: MenuItem[];
}

export type NavBarItem = MenuItem | NestedMenuItem;
