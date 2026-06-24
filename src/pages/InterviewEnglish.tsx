import { Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { ArrowRight, MessageSquareCode, Mic, Clock } from "lucide-react";

const scenarios = [
  { name: "Self-Introduction", desc: "30-second and 90-second versions for tech roles.", level: "B1", progress: 70 },
  { name: "Project Experience", desc: "Use STAR to describe what you built and why.", level: "B1+", progress: 42 },
  { name: "Technical Q&A", desc: "Answer system & coding questions in English.", level: "B2", progress: 18 },
  { name: "Behavioral Questions", desc: "Conflict, leadership, failure stories.", level: "B1", progress: 25 },
  { name: "Salary & Offer", desc: "Negotiation phrases and clarifying questions.", level: "B2", progress: 0 },
  { name: "Closing Questions", desc: "Smart questions to ask the interviewer.", level: "B1", progress: 60 },
];

const banks = [
  { tag: "Backend", title: "Explain a recent backend project", count: 12 },
  { tag: "System Design", title: "Design a rate limiter", count: 8 },
  { tag: "Behavioral", title: "Tell me about a time you disagreed", count: 15 },
];

export default function InterviewEnglish() {
  const { t } = useI18n();
  return (
    <div>
      <PageHeader
        title={t('interview.title')}
        subtitle={t('interview.desc')}
        actions={<Link to="/ai-interview"><Button><Mic className="w-3.5 h-3.5" /> {t('interview.startMock')}</Button></Link>}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="panel p-5 bg-accent border-primary/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">{t('common.continue')}</div>
                <h3 className="mt-1.5 text-lg font-semibold">Explain your recent project</h3>
                <p className="text-sm text-muted-foreground mt-1">Use the STAR pattern. Aim for 90 seconds. Voice + AI feedback.</p>
              </div>
              <Link to="/learning"><Button>{t('common.continue')} <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
            </div>
            <Progress value={28} className="mt-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-3">{t('interview.scenarios')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map((s) => (
                <div key={s.name} className="panel p-4 hover:border-primary/40 transition cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold">{s.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                    <span className="chip shrink-0">{s.level}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Progress value={s.progress} />
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">{s.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Panel title={t('interview.questionBanks')}>
            <ul className="divide-y divide-border -my-2">
              {banks.map((b) => (
                <li key={b.title} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="chip-blue">{b.tag}</span>
                    <span className="text-sm font-medium">{b.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span>{b.count} {t('interview.questions')}</span>
                    <Link to="/ai-interview"><Button variant="outline" size="sm">{t('common.start')}</Button></Link>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t('interview.starPattern')}>
            <ul className="text-sm space-y-2">
              <li><span className="font-mono text-primary font-semibold">S</span> · Situation — set the context</li>
              <li><span className="font-mono text-primary font-semibold">T</span> · Task — what you needed to solve</li>
              <li><span className="font-mono text-primary font-semibold">A</span> · Action — what you did</li>
              <li><span className="font-mono text-primary font-semibold">R</span> · Result — measurable outcome</li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => toast.info(t("common.comingSoon"))}><MessageSquareCode className="w-3.5 h-3.5" /> {t('interview.seeExamples')}</Button>
          </Panel>

          <Panel title={t('interview.lastPractice')}>
            <p className="text-sm font-medium">Explain your recent project</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 2 days ago · 72 / 100</p>
            <p className="text-xs text-muted-foreground mt-2">Strong opening. Missing measurable result at the end.</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
