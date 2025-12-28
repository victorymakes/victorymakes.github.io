"use client";

import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearch } from "./search-provider";

export function Search() {
  const { setOpen } = useSearch();

  return (
    <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
      <SearchIcon className="size-4" />
      <span className="sr-only">Search</span>
    </Button>
  );
}
