import { Link } from "react-router-dom";
import { TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeakPoint } from "@/types/review";

export function WeakPointCard({
  weakPoint,
  className,
}: {
  weakPoint: WeakPoint;
  className?: string;
}) {
  const isHigh = weakPoint.severity === "high";
  return (
    <div
      className={cn(
        "panel p-4",
        isHigh ? "bg-[hsl(var(--warning)/0.06)] border-[hsl(var(--warning)/0.3)]" : "",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <TrendingDown
          className={`w-3.5 h-3.5 ${isHigh ? "text-warning" : "text-muted-foreground"}`}
        />
        <span
          className={`text-[10px] uppercase tracking-wider font-semibold ${
            isHigh ? "text-warning" : "text-muted-foreground"
          }`}
        >
          {isHigh ? "High priority" : "Recurring"}
        </span>
      </div>
      <h4 className="mt-2 text-sm font-semibold leading-snug">{weakPoint.theme}</h4>
      <p className="text-[11px] text-muted-foreground mt-1">{weakPoint.sources}</p>
      <p className="text-xs text-foreground mt-2 leading-relaxed">{weakPoint.detail}</p>
      <Link
        to={weakPoint.drillRoute}
        className="mt-3 text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline"
      >
        Open drill <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
