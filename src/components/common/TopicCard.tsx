import { Link } from "react-router-dom";
import { Progress } from "@/components/ui-bits";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import type { ReactNode } from "react";

export function TopicCard({
  title,
  titleZh,
  explainGoal,
  explainGoalZh,
  level,
  progress,
  slug,
  modeChips,
  className,
}: {
  title: string;
  titleZh?: string;
  explainGoal: string;
  explainGoalZh?: string;
  level: string;
  progress: number;
  slug: string;
  modeChips?: ReactNode;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <Link
      to={`/technical-english/${slug}`}
      className={cn("panel p-4 hover:border-primary/40 hover:shadow-sm transition group min-w-0 overflow-hidden", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold break-words">{title}</h4>
          {titleZh && (
            <p className="text-[11px] text-muted-foreground mt-0.5 break-words">{titleZh}</p>
          )}
          <p className="text-[11px] uppercase tracking-wider text-primary font-semibold mt-1.5">
            {t("topicCard.learnToExplain")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed break-words">
            {explainGoal}
          </p>
          {explainGoalZh && (
            <p className="text-xs text-muted-foreground/70 mt-0.5 break-words">{explainGoalZh}</p>
          )}
        </div>
        <span className="chip shrink-0">{level}</span>
      </div>
      {modeChips && <div className="mt-3 flex flex-wrap items-center gap-1">{modeChips}</div>}
      <div className="mt-3 flex items-center gap-2 min-w-0">
        <Progress value={progress} />
        <span className="text-[11px] font-mono text-muted-foreground shrink-0">{progress}%</span>
      </div>
    </Link>
  );
}
