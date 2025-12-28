"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from "fumadocs-ui/components/dialog/search";
import { useLocale } from "next-intl";
import { createContext, useContext, useState, type ReactNode } from "react";

type SearchContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();

  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    locale,
  });

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <SearchDialog
        search={search}
        onSearchChange={setSearch}
        isLoading={query.isLoading}
        open={open}
        onOpenChange={setOpen}
      >
        <SearchDialogOverlay />
        <SearchDialogContent>
          <SearchDialogHeader>
            <SearchDialogIcon />
            <SearchDialogInput />
            <SearchDialogClose />
          </SearchDialogHeader>
          <SearchDialogList
            items={query.data !== "empty" ? query.data : null}
          />
        </SearchDialogContent>
      </SearchDialog>
    </SearchContext.Provider>
  );
}
