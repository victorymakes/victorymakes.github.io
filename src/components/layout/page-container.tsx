import { cn } from "@/lib/utils";

type PageContainerProps = React.ComponentProps<"div">;

export function PageContainer({
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 md:px-8 py-8 md:py-16",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
