import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("panel p-10 text-center", className)}>
      {icon && <div className="mx-auto text-muted-foreground/60">{icon}</div>}
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
