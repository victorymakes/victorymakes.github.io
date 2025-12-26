import type { IconType } from "react-icons";

// Re-export types from configuration.ts for compatibility
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
