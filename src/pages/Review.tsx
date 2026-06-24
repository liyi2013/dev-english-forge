import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Panel, Tabs, Button, Progress } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { WeakPointCard } from "@/components/common/WeakPointCard";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getReviewItems, getWeakPoints, getWeakTags } from "@/data/mockReviewItems";
import { getSavedVocabulary, getSavedSentences, getCompletedReports, updateReviewItemStatus } from "@/lib/mockStorage";
import { Mic, Edit3, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

const tabKeys = ['review.wrongAnswers', 'review.vocabulary', 'review.savedSentences', 'review.interviewReports'];

export default function Review() {
  const { t } = useI18n();
  const tabLabels = tabKeys.map((k) => t(k));
  const [tab, setTabRaw] = useState(tabKeys[0]);
  const [sortBy, setSortBy] = useState<'newest' | 'weakest'>('newest');
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());
  const [vocabDone, setVocabDone] = useState<Set<string>>(new Set());
  const [, forceUpdate] = useState(0);

  const setTab = (label: string) => {
    const idx = tabLabels.indexOf(label);
    if (idx >= 0) setTabRaw(tabKeys[idx]);
  };

  const reviewItems = getReviewItems();
  const weakPoints = getWeakPoints();
  const weakTags = getWeakTags();
  const savedVocab = getSavedVocabulary();
  const savedSentences = getSavedSentences();
  const reports = getCompletedReports();

  const filteredItems = sortBy === 'newest'
    ? [...reviewItems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [...reviewItems].filter((i) => i.status === 'pending');

  const handleToggleAnswer = (id: string) => {
    setExpandedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleVocabDone = (term: string) => {
    setVocabDone((prev) => {
      const next = new Set(prev);
      next.add(term);
      return next;
    });
    toast.success(t('review.markedReviewed'));
  };

  const handleReviewDone = (id: string) => {
    updateReviewItemStatus(id, 'reviewed');
    forceUpdate((n) => n + 1);
    toast.success(t('review.markedReviewed'));
  };

  return (
    <div>
      <PageHeader title={t('review.title')} subtitle={t('review.desc')} />

      <Panel
        title={t('review.weakPointsSummary')}
        description={t('review.weakPointsDesc')}
        action={
          <Button variant="ghost" size="sm" onClick={() => {
            document.querySelector('.space-y-4')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            {t('common.viewAll')}
          </Button>
        }
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {weakPoints.map((wp) => (
            <WeakPointCard key={wp.theme} weakPoint={wp} />
          ))}
        </div>
      </Panel>

      <div className="panel mb-6">
        <Tabs tabs={tabLabels} active={t(tab)} onChange={setTab} />
        <div className="px-5 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>
            {tab === tabKeys[0] && `${filteredItems.length} ${t('review.itemsQueued')} · ${t('common.sorted')}`}
            {tab === tabKeys[1] && `${savedVocab.length} ${t('review.items')}`}
            {tab === tabKeys[2] && `${savedSentences.length} ${t('review.items')}`}
            {tab === tabKeys[3] && `${reports.length} ${t('review.reports')}`}
          </span>
          {tab === tabKeys[0] && (
            <div className="flex gap-2">
              <button
                className={`hover:text-foreground ${sortBy === 'newest' ? 'text-foreground font-medium' : ''}`}
                onClick={() => setSortBy('newest')}
              >
                {t('review.newest')}
              </button>
              <span>·</span>
              <button
                className={`hover:text-foreground ${sortBy === 'weakest' ? 'text-foreground font-medium' : ''}`}
                onClick={() => setSortBy('weakest')}
              >
                {t('review.weakest')}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {tab === tabKeys[0] && (
            filteredItems.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="w-8 h-8" />}
                title={t('review.allCaughtUp')}
                description={t('review.allCaughtUpDesc')}
                action={<Link to="/technical-english"><Button variant="outline">{t('review.browseTech')}</Button></Link>}
              />
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="panel p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`${item.status === 'pending' ? 'chip-amber' : 'chip-green'}`}>
                          <AlertCircle className="w-3 h-3" />
                          {item.status === 'pending' ? t('review.needsRework') : t('review.reviewed')}
                        </span>
                        <span className="chip">{item.source}</span>
                        <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                      </div>
                      <h3 className="mt-3 text-base font-semibold leading-relaxed">{item.title}</h3>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.userAnswer && (
                      <div className="panel p-3 bg-background border-dashed">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                          {t('review.yourPreviousAnswer')}
                        </div>
                        <p className="text-sm text-muted-foreground italic line-clamp-4">{item.userAnswer}</p>
                      </div>
                    )}
                    {item.problem && (
                      <div className="panel p-3 bg-[hsl(var(--warning)/0.06)] border-[hsl(var(--warning)/0.3)]">
                        <div className="text-[10px] uppercase tracking-wider text-warning font-semibold mb-1.5">
                          {t('review.problem')}
                        </div>
                        <p className="text-sm text-foreground">{item.problem}</p>
                      </div>
                    )}
                  </div>

                  {expandedAnswers.has(item.id) && item.correctAnswer && (
                    <div className="mt-3 panel p-3 bg-accent/30 border-primary/20">
                      <div className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">
                        {t('review.viewSuggestedAnswer')}
                      </div>
                      <p className="text-sm text-foreground">{item.correctAnswer}</p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {item.topicSlug ? (
                      <Link to={`/technical-english/${item.topicSlug}`}>
                        <Button><Edit3 className="w-3.5 h-3.5" /> {t('review.rewriteAnswer')}</Button>
                      </Link>
                    ) : (
                      <Button onClick={() => toast.info(t('common.comingSoon'))}>
                        <Edit3 className="w-3.5 h-3.5" /> {t('review.rewriteAnswer')}
                      </Button>
                    )}
                    <Link to="/ai-interview/room">
                      <Button variant="outline"><Mic className="w-3.5 h-3.5" /> {t('review.speakAgain')}</Button>
                    </Link>
                    {item.correctAnswer && (
                      <Button variant="ghost" onClick={() => handleToggleAnswer(item.id)}>
                        <BookOpen className="w-3.5 h-3.5" /> {t('review.viewSuggestedAnswer')}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleReviewDone(item.id)}>
                      {t('common.done')}
                    </Button>
                  </div>
                </div>
              ))
            )
          )}

          {tab === tabKeys[1] && (
            savedVocab.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="w-8 h-8" />}
                title={t('review.emptyVocab')}
                description={t('review.emptyVocabDesc')}
                action={<Link to="/technical-english"><Button variant="outline">{t('review.browseTech')}</Button></Link>}
              />
            ) : (
              savedVocab.map((v) => {
                const done = vocabDone.has(v.term);
                return (
                  <div key={v.term} className="panel p-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-medium text-sm">{v.term}</span>
                      <span className="text-xs text-muted-foreground ml-3">
                        {t('common.saved')} {new Date(v.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVocabDone(v.term)}
                      disabled={done}
                    >
                      {done ? t('review.markedReviewed') : t('common.done')}
                    </Button>
                  </div>
                );
              })
            )
          )}

          {tab === tabKeys[2] && (
            savedSentences.length === 0 ? (
              <EmptyState
                icon={<Edit3 className="w-8 h-8" />}
                title={t('review.emptySentences')}
                description={t('review.emptySentencesDesc')}
                action={<Link to="/technical-english"><Button variant="outline">{t('review.browseTech')}</Button></Link>}
              />
            ) : (
              savedSentences.map((s) => (
                <div key={s.pattern} className="panel p-4">
                  <p className="text-sm font-mono font-medium">{s.pattern}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('common.saved')} {new Date(s.savedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )
          )}

          {tab === tabKeys[3] && (
            reports.length === 0 ? (
              <EmptyState
                icon={<Mic className="w-8 h-8" />}
                title={t('review.emptyReports')}
                description={t('review.emptyReportsDesc')}
                action={<Link to="/ai-interview"><Button variant="outline">{t('review.startInterview')}</Button></Link>}
              />
            ) : (
              reports.map((r) => (
                <Link key={r.id} to="/ai-interview/report" className="panel p-4 flex items-center justify-between hover:border-primary/40 transition block">
                  <div>
                    <p className="text-sm font-medium">Mock Interview · {new Date(r.date).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('review.score')}: {r.overallScore}/100</p>
                  </div>
                  <span className={`font-mono text-sm font-semibold ${r.overallScore >= 70 ? 'text-success' : 'text-warning'}`}>
                    {r.overallScore}
                  </span>
                </Link>
              ))
            )
          )}
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t('review.weeklyProgress')}>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">7<span className="text-muted-foreground text-base font-normal"> / 15</span></span>
              <span className="text-xs text-muted-foreground">{t('review.itemsFixed')}</span>
            </div>
            <Progress value={46} className="mt-3" tone="success" />
            <p className="text-xs text-muted-foreground mt-3">{t('review.stayOnTrack')}</p>
          </Panel>

          <Panel title={t('review.weakSkillTags')} description={t('review.clickToFilter')}>
            <div className="flex flex-wrap gap-1.5">
              {weakTags.map((tag) => (
                <span
                  key={tag}
                  className="chip hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => toast.info(t('review.filterComingSoon'))}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title={t('review.spacedRepetition')}>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between"><span>{t('review.dueToday')}</span><span className="font-mono font-medium">4</span></li>
              <li className="flex justify-between"><span>{t('review.dueTomorrow')}</span><span className="font-mono text-muted-foreground">7</span></li>
              <li className="flex justify-between"><span>{t('review.thisWeek')}</span><span className="font-mono text-muted-foreground">18</span></li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => toast.info(t('review.sessionComingSoon'))}
            >
              {t('review.startSession')}
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
