import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Panel, Progress, Button, Stat } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import { getDashboardData } from "@/data/mockDashboard";
import { Check, Flame, TrendingUp, Calendar, ArrowRight, Target, Mic } from "lucide-react";

function pickText(locale: string, en: string, zh?: string) {
  return locale === 'zh-CN' && zh ? zh : en;
}

export default function Dashboard() {
  const { t, locale } = useI18n();
  const data = getDashboardData();
  const [doneItems, setDoneItems] = useState<Set<string>>(new Set());

  function formatToday() {
    return new Date().toLocaleDateString(locale === "zh-CN" ? "zh-CN" : "en-US", {
      weekday: "long", month: "long", day: "numeric",
    });
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return t("dash.greetingMorning");
    if (h < 18) return t("dash.greetingAfternoon");
    return t("dash.greetingEvening");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{formatToday()}</p>
        <h1 className="text-2xl font-semibold mt-1">{greeting()}, {data.greetingName}</h1>
      </div>

      {/* Daily focus banner */}
      <Link to={data.todayFocus.route} className="panel p-5 bg-accent border-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 block hover:border-primary/30 transition">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">{t('dash.todayFocus')}</div>
            <p className="text-base font-medium text-foreground mt-0.5">
              {pickText(locale, data.todayFocus.title, data.todayFocus.titleZh)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {data.todayFocus.duration} · {pickText(locale, data.todayFocus.description, data.todayFocus.descriptionZh)}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <Button variant="primary">{t('dash.startFocus')} <ArrowRight className="w-3.5 h-3.5" /></Button>
        </div>
      </Link>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT — main column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Continue learning */}
          <Panel title={t('dash.continueLearning')} action={<Link to="/learning" className="text-xs text-primary hover:underline">{t('learning.allPaths')}</Link>}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="chip-blue">
                    {pickText(locale, data.continueLearning.path, data.continueLearning.pathZh)}
                  </span>
                  <span className="text-xs text-muted-foreground">{data.continueLearning.unit}</span>
                </div>
                <h4 className="mt-2 text-base font-semibold">
                  <Link to={data.continueLearning.route} className="hover:text-primary transition">
                    {pickText(locale, data.continueLearning.title, data.continueLearning.titleZh)}
                  </Link>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {pickText(locale, data.continueLearning.next, data.continueLearning.nextZh)}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={data.continueLearning.progress} className="max-w-xs" />
                  <span className="text-xs text-muted-foreground font-mono">{data.continueLearning.progress}%</span>
                </div>
              </div>
              <Link to={data.continueLearning.route} className="shrink-0">
                <Button>{t('common.continue')} <ArrowRight className="w-3.5 h-3.5" /></Button>
              </Link>
            </div>
          </Panel>

          {/* Today's plan */}
          <Panel title={t('dash.todayPlan')} description={`${data.todayPlan.items.length}${t("dash.smallTasks")}`}>
            <ul className="divide-y divide-border -my-2">
              {data.todayPlan.items.map((it) => (
                <li key={it.label} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${it.done ? "bg-success border-success text-white" : "border-border bg-card"}`}>
                      {(it.done || doneItems.has(it.label)) && <Check className="w-3 h-3" strokeWidth={3} />}
                    </span>
                    <span className={`text-sm truncate ${(it.done || doneItems.has(it.label)) ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {pickText(locale, it.label, it.labelZh)}
                    </span>
                  </div>
                  <button className="text-xs text-primary hover:underline shrink-0" onClick={() => { setDoneItems(prev => new Set(prev).add(it.label)); toast.success(t("common.completed")); }}>
                    {t("common.done")}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Weak skills */}
          <Panel title={t('dash.weakSkills')} description={t("dash.clickToSee")}>
            <ul className="space-y-3">
              {data.weakSkills.map((s) => (
                <li key={s.tag} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-foreground">{s.tag}</span>
                  <span className="font-mono text-muted-foreground">{s.level}%</span>
                  <Progress value={s.level} tone="warning" />
                </li>
              ))}
            </ul>
          </Panel>

          {/* Recommended */}
          <Panel title={t('dash.recommended')} description={t("dash.basedOnYesterday")}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.recommended.map((rec) => (
                rec.isPromoted ? (
                  <Link
                    key={rec.title}
                    to={rec.route}
                    className="panel p-4 md:col-span-1 bg-primary text-primary-foreground border-transparent hover:bg-primary/90 transition flex flex-col justify-between min-h-[140px]"
                  >
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold bg-white/15 px-2 py-0.5 rounded">
                        <Mic className="w-3 h-3" /> {pickText(locale, rec.tag, rec.tagZh)}
                      </div>
                      <h5 className="mt-2 text-sm font-semibold leading-snug">
                        {pickText(locale, rec.title, rec.titleZh)}
                      </h5>
                      <p className="text-xs text-primary-foreground/80 mt-1">{t("dash.liveFeedback")}</p>
                    </div>
                    <div className="mt-3 text-xs font-medium inline-flex items-center gap-1">
                      {t('common.start')} <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ) : (
                  <Link
                    key={rec.title}
                    to={rec.route}
                    className="panel p-3 hover:border-primary/40 hover:shadow-sm transition cursor-pointer flex flex-col"
                  >
                    <span className="chip-blue">{pickText(locale, rec.tag, rec.tagZh)}</span>
                    <h5 className="mt-2 text-sm font-medium">
                      {pickText(locale, rec.title, rec.titleZh)}
                    </h5>
                    <p className="text-xs text-muted-foreground mt-1">{rec.time}</p>
                  </Link>
                )
              ))}
            </div>
          </Panel>
        </div>

        {/* RIGHT — quieter secondary column */}
        <div className="col-span-12 lg:col-span-4 space-y-7">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">{t('dash.studyStreak')}</div>
            <div className="flex items-center justify-between">
              <Stat label={t('dash.current')} value={<span className="flex items-center gap-1.5 text-base font-semibold">{data.streak.current} <Flame className="w-3.5 h-3.5 text-warning" /></span>} hint={t('dash.days')} />
              <Stat label={t('dash.best')} value={<span className="text-base font-semibold">{data.streak.best}</span>} hint={t('dash.days')} />
              <Stat label={t('dash.week')} value={<span className="text-base font-semibold">{data.streak.weekActive} / {data.streak.weekTotal}</span>} hint={t('dash.active')} />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {data.streak.daily.map((v, i) => (
                <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: v === 0 ? "hsl(var(--secondary))" : `hsl(var(--primary) / ${0.2 + v * 0.4})` }} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{t('dash.level')}</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-semibold text-foreground">{data.level.current}</span>
              <span className="text-xs text-muted-foreground">{t("dash.approaching")} {data.level.next}</span>
            </div>
            <Progress value={data.level.progress} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {data.level.improvement}
            </p>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{t('dash.upcomingPractice')}</div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-md bg-secondary text-muted-foreground flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {pickText(locale, data.upcoming.title, data.upcoming.titleZh)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pickText(locale, data.upcoming.subtitle, data.upcoming.subtitleZh)}
                </p>
                <Link to={data.upcoming.route} className="text-xs text-primary hover:underline mt-1.5 inline-block">{t('ai.title')} →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
