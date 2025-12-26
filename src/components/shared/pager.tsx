import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pager = ({
  page,
  size,
  total,
  onChange,
  disabled,
}: {
  page: number;
  size: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  disabled?: boolean;
}) => {
  const maxPage = Math.max(1, Math.ceil(total / size));
  const start = total === 0 ? 0 : (page - 1) * size + 1;
  const end = Math.min(total, page * size);
  return (
    <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
      <div className="text-sm text-muted-foreground">
        {start}-{end} of {total}
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(page - 1, size)}
          disabled={disabled || page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(page + 1, size)}
          disabled={disabled || page >= maxPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
