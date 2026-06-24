import { AlertCircle, CheckCircle2 } from "lucide-react";

export function AnswerGapPanel({
  gapAnalysis,
  missingKeyPoints,
}: {
  gapAnalysis: string[];
  missingKeyPoints: string[];
}) {
  return (
    <div className="space-y-4">
      {/* Gap Analysis */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-3.5 h-3.5 text-warning" />
          <span className="text-[11px] uppercase tracking-wider text-warning font-semibold">
            Gap Analysis
          </span>
        </div>
        <ul className="text-sm space-y-1.5 text-foreground">
          {gapAnalysis.map((g, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground">·</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Key Points */}
      <div className="panel p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">
            Missing Key Points
          </span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {missingKeyPoints.map((m) => (
            <li key={m} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
