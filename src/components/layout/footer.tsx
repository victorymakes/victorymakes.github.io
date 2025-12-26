"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { footer } from "@/configurations/footer";
import { metadata } from "@/configurations/metadata";
import { socialLinks } from "@/configurations/social-links";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LinkBadge } from "@/components/shared/link-badge";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-6 md:px-6 space-y-8">
        {/* Top Section - Brand and Navigation */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="col-span-full flex flex-col gap-4 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground"
            >
              <Image
                src={metadata.logo}
                alt={metadata.name}
                width={32}
                height={32}
                className="size-8 rounded-lg"
              />
              {metadata.name}
            </Link>
            <p className="text-sm text-muted-foreground">{metadata.tagline}</p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.title}
                    variant="ghost"
                    size="icon-sm"
                    asChild
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Link href={link.href} target="_blank" rel="noopener">
                      <Icon className="size-4" />
                    </Link>
                  </Button>
                );
              })}
            </div>

            {/* Built with Badge */}
            <div className="mt-2">
              <Button variant="outline" asChild>
                <Link href="https://launchsaas.org" target="_blank">
                  {t("footer.builtWith")}{" "}
                  <Image
                    src="/launchsaas.png"
                    alt="LaunchSaaS"
                    width={16}
                    height={16}
                    className="size-4"
                  />
                  LaunchSaaS
                </Link>
              </Button>
            </div>
          </div>

          {/* Navigation Sections */}
          {footer.groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3 text-sm">
              <span className="font-semibold uppercase tracking-wider text-foreground">
                {t(group.title)}
              </span>
              <div className="flex flex-col gap-2.5 text-muted-foreground">
                {group.menus.map((item) => (
                  <Link
                    target={item.external ? "_blank" : undefined}
                    key={item.title}
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {t(item.title)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        {footer.badges && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {footer.badges?.map((badge) => (
              <LinkBadge
                key={badge.link}
                link={badge.link}
                lightImage={badge.lightImage}
                darkImage={badge.darkImage || badge.lightImage}
                alt={badge.alt}
                width={badge.width}
                height={badge.height}
              />
            ))}
          </div>
        )}

        {/* Bottom Section - Copyright and Theme Toggle */}
        <div className="flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {metadata.name}{" "}
            {t("footer.allRightsReserved")}.
          </p>
          <div className="flex items-center gap-2">
            <ThemeToggle type="button-group" />
          </div>
        </div>
      </div>
    </footer>
  );
}
