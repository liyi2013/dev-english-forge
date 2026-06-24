import { Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getLearningPaths } from "@/data/mockLearningPaths";
import { getMockTopics } from "@/data/mockTopics";
import { ArrowRight, CheckCircle2, PlayCircle, Lock, Circle, Clock } from "lucide-react";

function statusIcon(status: string) {
  if (status === "completed") return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
  if (status === "in_progress") return <PlayCircle className="w-3.5 h-3.5 text-primary" />;
  if (status === "locked") return <Lock className="w-3.5 h-3.5 text-muted-foreground/60" />;
  return <Circle className="w-3.5 h-3.5 text-muted-foreground" />;
}

function statusLabel(m: { status: string; progress?: number }, t: (key: string) => string) {
  if (m.status === "completed") return t('common.completed');
  if (m.status === "in_progress") return `${m.progress ?? 0}%`;
  if (m.status === "locked") return t('learning.lockedModule');
  return t('learning.startModule');
}

function pathProgress(modules: { status: string; progress?: number }[]) {
  const total = modules.length;
  const score = modules.reduce((acc, m) => {
    if (m.status === "completed") return acc + 100;
    if (m.status === "in_progress") return acc + (m.progress ?? 0);
    return acc;
  }, 0);
  return Math.round(score / total);
}

export default function Learning() {
  const { t } = useI18n();
  const paths = getLearningPaths();
  const topics = getMockTopics();

  const recommended = topics.slice(0, 3).map((t) => ({
    tag: t.slug === 'restful-api' ? 'Technical' : t.slug === 'redis-cache' ? 'Technical' : 'Backend',
    title: t.title,
    time: `${t.progress}%`,
    level: t.level,
    slug: t.slug,
  }));

  return (
    <div>
      <PageHeader title={t('learning.center')} subtitle={t('learning.desc')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-w-0">
        {paths.map((p) => {
          const pp = pathProgress(p.modules);
          return (
            <div key={p.id} className="panel p-5 flex flex-col min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-md bg-accent text-primary flex items-center justify-center">
                    <span className="text-lg font-mono font-bold">{p.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight truncate">{p.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{pp}%</span>
              </div>

              <Progress value={pp} className="mt-3" />

              <ul className="mt-4 space-y-1.5 flex-1">
                {p.modules.map((m) => (
                  <li
                    key={m.name}
                    className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm border ${
                      m.status === "in_progress"
                        ? "bg-accent border-primary/15"
                        : "border-transparent hover:bg-secondary/60"
                    } ${m.status === "locked" ? "text-muted-foreground" : ""}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {statusIcon(m.status)}
                      <span className="truncate">{m.name}</span>
                    </div>
                    <span
                      className={`text-[11px] font-mono shrink-0 ${
                        m.status === "completed" ? "text-success" :
                        m.status === "in_progress" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {statusLabel(m, t)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[11px] text-muted-foreground leading-snug">{p.milestone}</p>
                <Link to={`/learning/${p.slug}`}>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    {t('common.continue')} <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Panel title={t('learning.recommended')} action={<Button variant="ghost" size="sm" onClick={() => toast.success(t("common.refresh"))}>{t('common.refresh')}</Button>}>
          <ul className="divide-y divide-border -my-2">
            {recommended.map((r) => (
              <li key={r.title} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-2 group">
                <div className="flex items-center gap-3 flex-wrap min-w-0">
                  <span className="chip-blue">{r.tag}</span>
                  <span className="text-sm font-medium break-words">{r.title}</span>
                  <span className="chip">{r.level}</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground shrink-0">
                  <span className="text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {r.time}</span>
                  <Link to={`/technical-english/${r.slug}`}><Button variant="outline" size="sm">{t('common.start')}</Button></Link>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
