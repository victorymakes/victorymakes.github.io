"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

interface ThemeToggleProps {
  type?: "button" | "button-group";
}

function GroupedThemeToggle({
  mounted,
  theme,
  setTheme,
}: {
  mounted: boolean;
  theme: string | undefined;
  setTheme: (theme: string) => void;
}) {
  if (!mounted) {
    return (
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <Sun className="size-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Moon className="size-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Monitor className="size-4" />
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <ButtonGroup>
      <Button
        variant={theme === "light" ? "secondary" : "outline"}
        size="icon"
        onClick={() => setTheme("light")}
        aria-label="Light theme"
      >
        <Sun className="size-4" />
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "outline"}
        size="icon"
        onClick={() => setTheme("dark")}
        aria-label="Dark theme"
      >
        <Moon className="size-4" />
      </Button>
    </ButtonGroup>
  );
}

function DefaultThemeToggle({
  mounted,
  theme,
  setTheme,
}: {
  mounted: boolean;
  theme: string | undefined;
  setTheme: (theme: string) => void;
}) {
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full cursor-pointer"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="rounded-full cursor-pointer"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export function ThemeToggle({ type = "button" }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (type === "button-group") {
    return (
      <GroupedThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
    );
  }

  return (
    <DefaultThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
  );
}
