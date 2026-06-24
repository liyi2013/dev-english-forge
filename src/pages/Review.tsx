import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Panel, Tabs, Button, Progress } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { WeakPointCard } from "@/components/common/WeakPointCard";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getReviewItems, getWeakPoints, getWeakTags } from "@/data/mockReviewItems";
import {
  getSavedVocabulary,
  getSavedSentences,
  getCompletedReports,
  getReviewQueue,
  updateReviewItemStatus,
  isMockItemReviewed,
  markMockItemReviewed,
  type ReviewQueueItem,
} from "@/lib/mockStorage";
import type { ReviewItem } from "@/types/review";
import { Mic, Edit3, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

const tabKeys = ['review.wrongAnswers', 'review.vocabulary', 'review.savedSentences', 'review.interviewReports'];

type DisplayItem = (ReviewItem | ReviewQueueItem) & {
  _id: string;
  _type: 'mock' | 'queue';
  _title: string;
  _source: string;
  _status: 'pending' | 'reviewed' | 'mastered';
  _userAnswer?: string;
  _problem?: string;
  _correctAnswer?: string;
  _topicSlug?: string;
  _drillRoute?: string;
};

export default function Review() {
  const { t } = useI18n();
  const tabLabels = tabKeys.map((k) => t(k));
  const [tab, setTabRaw] = useState(tabKeys[0]);
  const [sortBy, setSortBy] = useState<'newest' | 'weakest'>('newest');
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());
  const [vocabDone, setVocabDone] = useState<Set<string>>(new Set());
  const [selectedWeakTag, setSelectedWeakTag] = useState<string | null>(null);
  const reviewListRef = useRef<HTMLDivElement>(null);

  const [mockItems] = useState(() => getReviewItems().map((item) => ({
    ...item,
    status: isMockItemReviewed(item.id) ? 'reviewed' : item.status,
  })));

  const [queueItems] = useState<ReviewQueueItem[]>(() => getReviewQueue());

  const [displayItems, setDisplayItems] = useState<DisplayItem[]>(() => {
    const mock: DisplayItem[] = mockItems.map((item) => ({
      ...item,
      _id: item.id,
      _type: 'mock' as const,
      _title: item.title,
      _source: item.source,
      _status: item.status,
      _userAnswer: item.userAnswer,
      _problem: item.problem,
      _correctAnswer: item.correctAnswer,
      _topicSlug: item.topicSlug,
    }));
    const queue: DisplayItem[] = queueItems.map((item) => ({
      ...item,
      _id: item.id,
      _type: 'queue' as const,
      _title: item.title,
      _source: item.source,
      _status: item.status as 'pending' | 'reviewed' | 'mastered',
      _userAnswer: item.userAnswer,
      _problem: item.problem,
      _correctAnswer: item.correctAnswer,
      _topicSlug: item.topicSlug,
      _drillRoute: item.drillRoute,
    }));
    return [...mock, ...queue];
  });

  const setTab = (label: string) => {
    const idx = tabLabels.indexOf(label);
    if (idx >= 0) setTabRaw(tabKeys[idx]);
  };

  const weakPoints = getWeakPoints();
  const weakTags = getWeakTags();
  const savedVocab = getSavedVocabulary();
  const savedSentences = getSavedSentences();
  const reports = getCompletedReports();

  const tagFiltered = selectedWeakTag
    ? displayItems.filter((i) => {
        const tags = (i as any).tags || (i as any)._tags || [];
        const itemText = ((i._title || '') + ' ' + (i._problem || '') + ' ' + (i._source || '')).toLowerCase();
        return tags.some((t: string) => t.toLowerCase().includes(selectedWeakTag.toLowerCase())) || itemText.includes(selectedWeakTag.toLowerCase());
      })
    : displayItems;
  const filteredItems = sortBy === 'newest'
    ? [...tagFiltered].sort((a, b) => {
        const da = 'createdAt' in a ? new Date(a.createdAt).getTime() : 0;
        const db = 'createdAt' in b ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      })
    : tagFiltered.filter((i) => i._status === 'pending');

  const handleToggleAnswer = (id: string) => {
    setExpandedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReviewDone = (id: string) => {
    const found = displayItems.find((item) => item._id === id);

    setDisplayItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, _status: 'reviewed' as const } : item
      )
    );

    if (found?._type === 'queue') {
      updateReviewItemStatus(id, 'reviewed');
    } else if (found?._type === 'mock') {
      markMockItemReviewed(id);
    }

    toast.success(t('review.reviewItemUpdated'));
  };

  const handleVocabDone = (term: string) => {
    setVocabDone((prev) => new Set(prev).add(term));
    toast.success(t('review.markedReviewed'));
  };

  const handleViewAll = () => {
    reviewListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <PageHeader title={t('review.title')} subtitle={t('review.desc')} />

      <Panel
        title={t('review.weakPointsSummary')}
        description={t('review.weakPointsDesc')}
        action={
          <Button variant="ghost" size="sm" onClick={handleViewAll}>
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

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-4" ref={reviewListRef}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Tabs tabs={tabLabels} active={t(tab)} onChange={setTab} />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t('common.sorted')}:</span>
              <Button variant="ghost" size="sm" onClick={() => setSortBy('newest')} className={sortBy === 'newest' ? 'text-primary' : ''}>{t('review.newest')}</Button>
              <Button variant="ghost" size="sm" onClick={() => setSortBy('weakest')} className={sortBy === 'weakest' ? 'text-primary' : ''}>{t('review.weakest')}</Button>
            </div>
          </div>

          {tab === tabKeys[0] && (
            filteredItems.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="w-8 h-8" />}
                title={t('review.allCaughtUp')}
                description={t('review.allCaughtUpDesc')}
                action={<Link to="/technical-english"><Button variant="outline">{t('review.browseTech')}</Button></Link>}
              />
            ) : (
              filteredItems.map((item) => {
                const isReviewed = item._status === 'reviewed' || item._status === 'mastered';
                return (
                  <div key={item._id} className="panel p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={isReviewed ? 'chip-green' : 'chip-amber'}>
                            <AlertCircle className="w-3 h-3" />
                            {isReviewed ? t('review.reviewed') : t('review.needsRework')}
                          </span>
                          <span className="chip">{item._source}</span>
                          <span className="text-xs text-muted-foreground">
                            {'createdAt' in item ? item.createdAt : ''}
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-semibold leading-relaxed">{item._title}</h3>
                      </div>
                    </div>

                    {(item._userAnswer || item._problem) && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item._userAnswer && (
                          <div className="panel p-3 bg-background border-dashed">
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                              {t('review.yourPreviousAnswer')}
                            </div>
                            <p className="text-sm text-muted-foreground italic line-clamp-4">{item._userAnswer}</p>
                          </div>
                        )}
                        {item._problem && (
                          <div className="panel p-3 bg-[hsl(var(--warning)/0.06)] border-[hsl(var(--warning)/0.3)]">
                            <div className="text-[10px] uppercase tracking-wider text-warning font-semibold mb-1.5">
                              {t('review.problem')}
                            </div>
                            <p className="text-sm text-foreground">{item._problem}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {expandedAnswers.has(item._id) && item._correctAnswer && (
                      <div className="mt-3 panel p-3 bg-accent/30 border-primary/20">
                        <div className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">
                          {t('review.viewSuggestedAnswer')}
                        </div>
                        <p className="text-sm text-foreground">{item._correctAnswer}</p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {item._drillRoute ? (
                        <Link to={item._drillRoute}>
                          <Button><Edit3 className="w-3.5 h-3.5" /> {t('review.rewriteAnswer')}</Button>
                        </Link>
                      ) : item._topicSlug ? (
                        <Link to={`/technical-english/${item._topicSlug}`}>
                          <Button><Edit3 className="w-3.5 h-3.5" /> {t('review.rewriteAnswer')}</Button>
                        </Link>
                      ) : (
                        <Button onClick={() => toast.info(t('common.comingSoon'))}>
                          <Edit3 className="w-3.5 h-3.5" /> {t('review.rewriteAnswer')}
                        </Button>
                      )}
                      <Link to="/ai-interview">
                        <Button variant="outline"><Mic className="w-3.5 h-3.5" /> {t('review.speakAgain')}</Button>
                      </Link>
                      {item._correctAnswer && (
                        <Button variant="ghost" onClick={() => handleToggleAnswer(item._id)}>
                          <BookOpen className="w-3.5 h-3.5" /> {t('review.viewSuggestedAnswer')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReviewDone(item._id)}
                        disabled={isReviewed}
                      >
                        {isReviewed ? t('review.reviewed') : t('common.done')}
                      </Button>
                    </div>
                  </div>
                );
              })
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
                <Link key={r.id} to={`/ai-interview/report/${r.id}`} className="panel p-4 flex items-center justify-between hover:border-primary/40 transition block">
                  <div>
                    <p className="text-sm font-medium">{t("review.mockInterview")} · {new Date(r.date).toLocaleDateString()}</p>
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
                  onClick={() => setSelectedWeakTag(selectedWeakTag === tag ? null : tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Panel>
            {selectedWeakTag && (
              <div className="flex items-center justify-between px-5 py-2 bg-accent/50 rounded-b-md -mt-1 mb-4">
                <span className="text-xs text-muted-foreground">{t('review.activeFilter')} <strong>{selectedWeakTag}</strong></span>
                <button onClick={() => setSelectedWeakTag(null)} className="text-xs text-primary hover:underline">{t('review.clearFilter')}</button>
              </div>
            )}

          <Panel title={t('review.spacedRepetition')}>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between"><span>{t('review.dueToday')}</span><span className="font-mono font-medium">4</span></li>
              <li className="flex justify-between"><span>{t('review.dueTomorrow')}</span><span className="font-mono text-muted-foreground">7</span></li>
              <li className="flex justify-between"><span>{t('review.thisWeek')}</span><span className="font-mono text-muted-foreground">18</span></li>
            </ul>
            <Link to="/review/session" className="block mt-4 w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
              >
                {t('review.startSession')}
              </Button>
            </Link>
          </Panel>
        </div>
      </div>
    </div>
  );
}
