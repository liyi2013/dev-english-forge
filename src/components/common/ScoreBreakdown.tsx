import { Progress } from "@/components/ui-bits";

interface ScoreItem {
  name: string;
  value: number;
}

export function ScoreBreakdown({
  scores,
  title,
}: {
  scores: ScoreItem[];
  title?: string;
}) {
  return (
    <div>
      {title && (
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
          {title}
        </div>
      )}
      <ul className="space-y-3">
        {scores.map((s) => (
          <li key={s.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-foreground font-medium">{s.name}</span>
              <span className="font-mono text-muted-foreground">{s.value}</span>
            </div>
            <Progress
              value={s.value}
              tone={s.value >= 80 ? "success" : s.value >= 60 ? "primary" : "warning"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
