"use client";

import React from "react";
import { ProgressProvider } from "@bprogress/next/app";
import { ThemeProvider } from "next-themes";
import { RootProvider } from "fumadocs-ui/provider/next";
import { SearchProvider } from "./search-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ProgressProvider>
          <SearchProvider>{children}</SearchProvider>
        </ProgressProvider>
      </ThemeProvider>
    </RootProvider>
  );
}
