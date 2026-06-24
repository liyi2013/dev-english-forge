import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export function SaveButton({
  saved,
  onToggle,
  size = "sm",
  savedLabel = "Saved",
  unsavedLabel = "Save",
}: {
  saved: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
  savedLabel?: string;
  unsavedLabel?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1 rounded-md transition-colors font-medium",
        size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5",
        saved
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
      )}
      aria-label={saved ? savedLabel : unsavedLabel}
    >
      <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-primary")} />
      {saved ? savedLabel : unsavedLabel}
    </button>
  );
}
