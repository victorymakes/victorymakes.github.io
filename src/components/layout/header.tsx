"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { ChevronDown, MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { header } from "@/configurations/header";
import { metadata } from "@/configurations/metadata";
import { NavBarItem, NestedMenuItem } from "@/types/configuration";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

// Type guard to check if an item is a NestedMenuItem
function isNestedMenuItem(item: NavBarItem): item is NestedMenuItem {
  return "children" in item;
}

export function SiteHeader() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <div className="flex gap-1">
            {metadata.logo && (
              <Image src={metadata.logo} alt="Logo" width={32} height={32} />
            )}
            <Link
              href="/"
              className="flex items-center text-lg font-semibold tracking-tight"
            >
              {metadata.name}
            </Link>
          </div>

          <DesktopNav items={header.items} />
        </div>

        <div className="flex items-center gap-3">
          {header.actions.length > 0 && (
            <div className="hidden md:flex gap-2">
              {header.actions.map((action) => (
                <Button
                  key={action.item.title}
                  asChild
                  size="sm"
                  variant={action.variant}
                >
                  <Link
                    href={action.item.href}
                    target={action.item.external ? "_blank" : undefined}
                  >
                    {t(action.item.title)}
                  </Link>
                </Button>
              ))}
            </div>
          )}

          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <ThemeToggle />

          <MobileNav />
        </div>
      </div>
    </header>
  );
}

// Export as Header for compatibility
export { SiteHeader as Header };

function isActivePath(currentPath: string, href: string) {
  return currentPath !== "/" && currentPath.includes(href);
}

function DesktopNav({ items }: { items: NavBarItem[] }) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <NavigationMenu className="hidden md:flex" viewport={false}>
      <NavigationMenuList>
        {items.map((item) =>
          isNestedMenuItem(item) ? (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuTrigger
                className={cn(
                  "bg-transparent transition-colors",
                  item.children.some((child) =>
                    isActivePath(pathname, child.href),
                  )
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(item.title)}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-1 p-2 w-64">
                  {item.children.map((child) => (
                    <li key={child.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          target={child.external ? "_blank" : undefined}
                          href={child.href}
                          className={cn(
                            "flex flex-row items-start select-none gap-3 rounded-md px-3 py-2 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActivePath(pathname, child.href)
                              ? "bg-accent text-accent-foreground"
                              : "",
                          )}
                        >
                          {child.icon && (
                            <child.icon className="mt-1 size-5 shrink-0 text-muted-foreground" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium leading-none">
                              {t(child.title)}
                            </span>
                            {child.description && (
                              <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                                {child.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent transition-colors",
                  isActivePath(pathname, item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                >
                  {t(item.title)}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            className="md:hidden"
          >
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-xs border-r px-0 overflow-y-auto"
        >
          <SheetHeader className="px-6">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {metadata.name}
            </Link>
            <p className="text-sm text-muted-foreground">{metadata.tagline}</p>
          </SheetHeader>

          <div className="flex flex-col gap-2 px-6 py-6 text-base font-medium">
            {header.items.map((item) =>
              isNestedMenuItem(item) ? (
                <MobileNestedMenu key={item.title} item={item} />
              ) : (
                <SheetClose asChild key={item.title}>
                  <Link
                    target={item.external ? "_blank" : undefined}
                    href={item.href}
                    className={cn(
                      "rounded-sm px-2 py-2 transition-colors hover:bg-muted",
                      isActivePath(pathname, item.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {t(item.title)}
                  </Link>
                </SheetClose>
              ),
            )}
          </div>

          {header.actions.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-3 px-6 py-6">
                {header.actions.map((action) => (
                  <SheetClose asChild key={action.item.title}>
                    <Button asChild variant={action.variant}>
                      <Link
                        href={action.item.href}
                        target={action.item.external ? "_blank" : undefined}
                      >
                        {t(action.item.title)}
                      </Link>
                    </Button>
                  </SheetClose>
                ))}
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-between px-6 py-4">
            <LocaleSwitcher />
            <ThemeToggle type="button-group" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MobileNestedMenu({ item }: { item: NestedMenuItem }) {
  const pathname = usePathname();
  const t = useTranslations();
  const tr = (messageKey: string | undefined, fallback: string) =>
    messageKey ? t(messageKey) : fallback;

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-sm px-2 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        {tr(item.messageKey, item.title)}
        <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4">
        {item.children.map((child) => (
          <SheetClose asChild key={child.title}>
            <Link
              target={child.external ? "_blank" : undefined}
              href={child.href}
              className={cn(
                "block rounded-sm px-2 py-2 text-sm transition-colors hover:bg-muted",
                isActivePath(pathname, child.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {tr(child.messageKey, child.title)}
            </Link>
          </SheetClose>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
