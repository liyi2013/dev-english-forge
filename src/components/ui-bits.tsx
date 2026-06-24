import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("panel", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </section>
  );
}

export function Progress({
  value,
  className,
  tone = "primary",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "success" | "warning";
}) {
  const color =
    tone === "success"
      ? "bg-success"
      : tone === "warning"
      ? "bg-warning"
      : "bg-primary";
  return (
    <div className={cn("h-1.5 w-full bg-secondary rounded-full overflow-hidden", className)}>
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className="mt-1 text-xl font-semibold text-foreground">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent",
    secondary: "bg-secondary text-foreground hover:bg-secondary/70 border border-transparent",
    outline: "bg-card text-foreground hover:bg-secondary border border-border",
    ghost: "bg-transparent text-foreground hover:bg-secondary border border-transparent",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-transparent",
  };
  const sizes = {
    sm: "h-7 px-2.5 text-xs",
    md: "h-8 px-3 text-sm",
    lg: "h-10 px-4 text-sm",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={cn(
              "px-3 py-2 text-sm -mb-px border-b-2 transition-colors",
              isActive
                ? "border-primary text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex p-0.5 bg-secondary rounded-md border border-border">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "px-2.5 py-1 text-xs rounded-[4px] transition-colors",
            value === o
              ? "bg-card text-foreground shadow-sm font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
