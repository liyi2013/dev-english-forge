import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { t } from "@/i18n";
import { toast } from "sonner";
import { Mail, Users, GitPullRequest, MessageCircle, ArrowRight } from "lucide-react";

const scenarios = [
  { icon: Users, name: "Daily Standup", desc: "Yesterday / Today / Blockers — concise updates.", progress: 35 },
  { icon: Mail, name: "Writing Emails", desc: "Status updates, requests, follow-ups.", progress: 20 },
  { icon: GitPullRequest, name: "Code Review", desc: "Leave clear, polite review comments.", progress: 12 },
  { icon: MessageCircle, name: "Meetings & Clarification", desc: "Ask for clarification without losing face.", progress: 8 },
];

const phrases = [
  { en: "Could you walk me through that part again?", cn: "你能再讲一下那部分吗？" },
  { en: "Just to make sure I understood correctly…", cn: "为了确认我理解正确……" },
  { en: "I'll circle back on this after the meeting.", cn: "会后我再跟进这个。" },
  { en: "Let me share my screen.", cn: "我来共享一下屏幕。" },
];

export default function WorkplaceEnglish() {
  return (
    <div>
      <PageHeader title={t('workplace.title')} subtitle={t('workplace.desc')} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="panel p-5 bg-accent border-primary/10 flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">{t('workplace.continue')}</div>
              <h3 className="mt-1.5 text-lg font-semibold">Ask for clarification in a meeting</h3>
              <p className="text-sm text-muted-foreground mt-1">Polite phrases, follow-ups, and tone control.</p>
            </div>
            <Button>{t('common.continue')} <ArrowRight className="w-3.5 h-3.5" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scenarios.map((s) => (
              <div key={s.name} className="panel p-4 hover:border-primary/40 transition cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-accent text-primary flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold">{s.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Progress value={s.progress} />
                      <span className="text-[11px] font-mono text-muted-foreground shrink-0">{s.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Panel title={t('workplace.usefulPhrases')}>
            <ul className="divide-y divide-border -my-2">
              {phrases.map((p) => (
                <li key={p.en} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{p.en}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.cn}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toast.success('Phrase saved!')}>
                    {t('workplace.savePhrase')}
                  </Button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t('workplace.miniDrill')}>
            <p className="text-sm">Write a 3-sentence standup update.</p>
            <textarea
              rows={5}
              placeholder={"Yesterday I…\nToday I…\nBlockers: …"}
              className="w-full mt-3 text-sm bg-card border border-border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <Button size="sm" className="mt-2 w-full" onClick={() => toast.success('AI feedback coming soon!')}>
              {t('workplace.getFeedback')}
            </Button>
          </Panel>

          <Panel title={t('workplace.toneGuide')}>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li>"Could you" sounds softer than "Can you".</li>
              <li>Use "I'd suggest" instead of "You should".</li>
              <li>End requests with "if that works for you".</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
