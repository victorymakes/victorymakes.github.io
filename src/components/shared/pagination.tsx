import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const getPageUrl = (page: number) => {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  };

  return (
    <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-3">
        {prevPage ? (
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <Link href={getPageUrl(prevPage)}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="h-8 w-8" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {nextPage ? (
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <Link href={getPageUrl(nextPage)}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="h-8 w-8" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
