import { useState } from "react";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { saveSentence } from "@/lib/mockStorage";
import { Mail, Users, GitPullRequest, MessageCircle, ArrowRight } from "lucide-react";

const scenarios = [
  { icon: Users, name: "Daily Standup", desc: "Yesterday / Today / Blockers — concise updates.", progress: 35, slug: "daily-standup" },
  { icon: Mail, name: "Writing Emails", desc: "Status updates, requests, follow-ups.", progress: 20, slug: "writing-emails" },
  { icon: GitPullRequest, name: "Code Review", desc: "Leave clear, polite review comments.", progress: 12, slug: "code-review" },
  { icon: MessageCircle, name: "Meetings & Clarification", desc: "Ask for clarification without losing face.", progress: 8, slug: "meetings-clarification" },
];

const phrases = [
  { en: "Could you walk me through that part again?", cn: "你能再讲一下那部分吗？" },
  { en: "Just to make sure I understood correctly…", cn: "为了确认我理解正确……" },
  { en: "I'll circle back on this after the meeting.", cn: "会后我再跟进这个。" },
  { en: "Let me share my screen.", cn: "我来共享一下屏幕。" },
];

export default function WorkplaceEnglish() {
  const [drillText, setDrillText] = useState("");
  const [drillFeedback, setDrillFeedback] = useState<{ score: number; suggestion: string } | null>(null);

  const handleDrillSubmit = () => {
    if (!drillText.trim()) { toast.info(t("workplace.drillEmptyHint")); return; }
    const wordCount = drillText.trim().split(/\s+/).length;
    const hasYesterday = /yesterday/i.test(drillText);
    const hasToday = /today/i.test(drillText);
    const hasBlocker = /blocker|stuck|issue|waiting/i.test(drillText);
    let score = 60;
    if (hasYesterday) score += 10;
    if (hasToday) score += 10;
    if (hasBlocker) score += 10;
    if (wordCount >= 20 && wordCount <= 50) score += 10;
    else if (wordCount > 50) score += 5;
    const suggestions = [];
    if (!hasYesterday) suggestions.push(t("workplace.drillHintYesterday"));
    if (!hasToday) suggestions.push(t("workplace.drillHintToday"));
    if (!hasBlocker) suggestions.push(t("workplace.drillHintBlocker"));
    if (wordCount < 15) suggestions.push(t("workplace.drillHintLength"));
    if (suggestions.length === 0) suggestions.push(t("workplace.drillHintGreat"));
    setDrillFeedback({ score, suggestion: suggestions.join(" ") });
    toast.success(t("workplace.drillFeedbackReady"));
  };
  const { t } = useI18n();
  return (
    <div>
      <PageHeader title={t('workplace.title')} subtitle={t('workplace.desc')} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="panel p-5 bg-accent border-primary/10 flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">{t('workplace.continue')}</div>
              <h3 className="mt-1.5 text-lg font-semibold">{t('workplace.continueClarificationTitle')}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t('workplace.continueClarificationDesc')}</p>
            </div>
            <Link to="/workplace-english/scenarios/meetings-clarification"><Button>{t('common.continue')} <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scenarios.map((s) => (
              <Link
                key={s.name}
                to={`/workplace-english/scenarios/${s.slug}`}
                className="panel p-4 hover:border-primary/40 hover:shadow-sm transition block"
                aria-label={s.name}
              >
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
              </Link>
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
                  <Button variant="ghost" size="sm" onClick={() => { saveSentence({ pattern: p.en, savedAt: new Date().toISOString() }); toast.success(t('common.saved')); }}>
                    {t('workplace.savePhrase')}
                  </Button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t('workplace.miniDrill')}>
            <p className="text-sm">{t('workplace.standupDrillPrompt')}</p>
            <textarea
              rows={5}
              value={drillText}
              onChange={(e) => setDrillText(e.target.value)}
              placeholder={"Yesterday I…\nToday I…\nBlockers: …"}
              className="w-full mt-3 text-sm bg-card border border-border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            {drillFeedback ? (
              <div className="mt-3 space-y-2">
                <div className="bg-accent rounded-md p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">{t('workplace.drillScore')}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold">{drillFeedback.score}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <div className="bg-accent rounded-md p-3">
                  <p className="text-xs font-semibold text-foreground mb-1">{t('workplace.drillSuggestion')}</p>
                  <p className="text-sm text-muted-foreground">{drillFeedback.suggestion}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => { setDrillText(""); setDrillFeedback(null); }}>
                  {t('workplace.drillTryAgain')}
                </Button>
              </div>
            ) : (
              <Button size="sm" className="mt-2 w-full" onClick={() => handleDrillSubmit()}>
                {t('workplace.getFeedback')}
              </Button>
            )}
          </Panel>

          <Panel title={t('workplace.toneGuide')}>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li>{t('workplace.toneTip1')}</li>
              <li>{t('workplace.toneTip2')}</li>
              <li>{t('workplace.toneTip3')}</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
