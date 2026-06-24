import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { getMockTopics } from "@/data/mockTopics";
import { getMockVocabulary } from "@/data/mockVocabulary";
import { getQuestionsByMode, getRecentSessions } from "@/data/mockInterviewSessions";
import { getMockReports } from "@/data/mockReports";
import { getSavedSentences, getCompletedReports, getGeneratedReports, saveVocabulary, removeVocabulary, isVocabSaved } from "@/lib/mockStorage";
import { toast } from "sonner";
import { BookOpen, Sparkles, MessageSquare, Mic, ArrowRight, Search, TrendingUp } from "lucide-react";

type FilterGroup = 'All' | 'Topics' | 'Vocabulary' | 'Questions' | 'Reports' | 'Sentences';

const popularSearches = [
  "Redis", "cache", "API", "Docker", "database", "CI/CD", "STAR", "idempotent",
];

export default function SearchResults() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [filter, setFilter] = useState<FilterGroup>('All');
  const [vocabSavedSet, setVocabSavedSet] = useState<Set<string>>(() => {
    const all = getMockVocabulary().map((v) => v.term);
    return new Set(all.filter((term) => isVocabSaved(term)));
  });

  const topics = useMemo(() => {
    if (!q) return [];
    return getMockTopics().filter((topic) =>
      topic.title.toLowerCase().includes(q.toLowerCase()) ||
      topic.titleZh.toLowerCase().includes(q.toLowerCase()) ||
      topic.explainGoal.toLowerCase().includes(q.toLowerCase()) ||
      topic.keyPoints.some((kp) => kp.toLowerCase().includes(q.toLowerCase())) ||
      topic.vocabulary.some((v) => v.term.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q]);

  const vocabItems = useMemo(() => {
    if (!q) return [];
    return getMockVocabulary().filter((v) =>
      v.term.toLowerCase().includes(q.toLowerCase()) ||
      v.definitionEn.toLowerCase().includes(q.toLowerCase()) ||
      v.definitionZh.includes(q)
    );
  }, [q]);

  const questionItems = useMemo(() => {
    if (!q) return [];
    const allQuestions = [
      ...getQuestionsByMode('quick'),
      ...getQuestionsByMode('jd'),
      ...getRecentSessions().flatMap((s) => s.questions),
    ];
    const seen = new Set<string>();
    return allQuestions.filter((qItem) => {
      if (seen.has(qItem.question)) return false;
      seen.add(qItem.question);
      return qItem.question.toLowerCase().includes(q.toLowerCase());
    });
  }, [q]);

  const reportItems = useMemo(() => {
    if (!q) return [];
    const query = q.toLowerCase();
    const completed = getCompletedReports();
    const mockReports = getMockReports();
    const generated = getGeneratedReports();

    // Build a full report map from mock reports for deeper content search
    const mockReportMap = new Map<string, import("@/types/interview").InterviewReport>();
    mockReports.forEach((r) => mockReportMap.set(r.id, r));

    const deepSearch = (item: { id: string; date?: string; overallScore?: number; title?: string }): boolean => {
      if (item.title?.toLowerCase().includes(query)) return true;
      if (item.overallScore != null && String(item.overallScore).includes(q)) return true;
      const full = mockReportMap.get(item.id);
      if (!full) return false;
      return (
        full.weakPoints.some((wp: string) => wp.toLowerCase().includes(query)) ||
        full.questionDetails.some((qd) =>
          qd.gapAnalysis.some((g: string) => g.toLowerCase().includes(query)) ||
          (qd.betterAnswerVersion || '').toLowerCase().includes(query) ||
          (qd.idealAnswer || '').toLowerCase().includes(query)
        ) ||
        full.recommendedLearning.some((rl) =>
          rl.title.toLowerCase().includes(query) || rl.desc.toLowerCase().includes(query)
        )
      );
    };

    const all = [
      ...completed.map((r) => {
        const title = `${t("search.mockInterview")} · ${new Date(r.date).toLocaleDateString()}`;
        return { id: r.id, date: r.date, overallScore: r.overallScore, title };
      }),
      ...mockReports.map((r) => {
        const title = `${t("search.mockInterview")} · ${new Date(r.date).toLocaleDateString()}`;
        return { id: r.id, date: r.date, overallScore: r.overallScore, title };
      }),
      ...(Array.isArray(generated) ? generated.map((r: Record<string, unknown>) => {
        const title = `${t("search.mockInterview")} · ${new Date((r.date as string) || Date.now()).toLocaleDateString()}`;
        return { id: r.id as string, date: (r.date as string) || new Date().toISOString(), overallScore: (r.overallScore as number) || 0, title };
      }) : []),
    ];
    // Deduplicate by id
    const byId = new Map<string, (typeof all)[number]>();
    all.forEach((item) => {
      if (!byId.has(item.id)) byId.set(item.id, item);
    });
    return Array.from(byId.values()).filter((r) => deepSearch(r));
  }, [q, t]);

  const sentenceItems = useMemo(() => {
    if (!q) return [];
    return getSavedSentences().filter((s) =>
      s.pattern.toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  const totals: Record<FilterGroup, number> = {
    All: topics.length + vocabItems.length + questionItems.length + reportItems.length + sentenceItems.length,
    Topics: topics.length,
    Vocabulary: vocabItems.length,
    Questions: questionItems.length,
    Reports: reportItems.length,
    Sentences: sentenceItems.length,
  };

  const filters: FilterGroup[] = ['All', 'Topics', 'Vocabulary', 'Questions', 'Reports', 'Sentences'];

  const handleSaveVocab = (term: string) => {
    if (vocabSavedSet.has(term)) {
      removeVocabulary(term);
      setVocabSavedSet((prev) => { const next = new Set(prev); next.delete(term); return next; });
      toast.info(`"${term}" ${t("search.removedFromVocab")}`);
    } else {
      saveVocabulary({ term, savedAt: new Date().toISOString() });
      setVocabSavedSet((prev) => { const next = new Set(prev); next.add(term); return next; });
      toast.success(`"${term}" ${t('search.savedToVocab')}`);
    }
  };

  if (!q) {
    return (
      <div>
        <PageHeader title={t('search.title')} subtitle={t('search.placeholder')} />
        <div className="panel p-8 text-center">
          <Search className="w-10 h-10 mx-auto text-muted-foreground/40" />
          <h3 className="mt-4 text-base font-semibold">{t('search.searchHint')}</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            {t('search.placeholder')}
          </p>
          <div className="mt-6">
            <p className="text-xs text-muted-foreground font-medium mb-3">{t('search.popularSearches')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="chip hover:bg-secondary cursor-pointer transition"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('search.title')}
        subtitle={`"${q}"`}
        actions={
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip transition ${filter === f ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {t(f === 'All' ? 'common.all' : f === 'Topics' ? 'search.topicsLabel' : f === 'Vocabulary' ? 'search.termsLabel' : f === 'Questions' ? 'search.qaLabel' : f === 'Reports' ? 'search.pastSessions' : 'search.sentencesLabel')}
                <span className="text-[10px] opacity-70 ml-1">{totals[f]}</span>
              </button>
            ))}
          </div>
        }
      />

      {totals.All === 0 ? (
        <EmptyState title={t('common.noResults')} description={`${t('search.noResultsFor')} "${q}"`} />
      ) : (
        <div className="max-w-3xl space-y-6">
          {(filter === 'All' || filter === 'Topics') && topics.length > 0 && (
            <Panel title={t('search.topics')} description={`${topics.length} ${t('search.matchingTopics')}`} action={<span className="chip"><BookOpen className="w-3 h-3" /> {t('search.topicsLabel')}</span>}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 -my-2">
                {topics.map((t) => (
                  <Link key={t.slug} to={`/technical-english/${t.slug}`} className="panel p-3 hover:border-primary/40 transition">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{t.level}</span>
                    <h4 className="mt-2 text-sm font-semibold"><Highlight text={t.title} q={q} /></h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed"><Highlight text={t.explainGoal} q={q} /></p>
                  </Link>
                ))}
              </div>
            </Panel>
          )}

          {(filter === 'All' || filter === 'Vocabulary') && vocabItems.length > 0 && (
            <Panel title={t('search.vocabulary')} description={`${vocabItems.length} ${t('search.matchingTerms')}`} action={<span className="chip"><Sparkles className="w-3 h-3" /> {t('search.termsLabel')}</span>}>
              <ul className="divide-y divide-border -my-2">
                {vocabItems.map((v) => {
                  const saved = vocabSavedSet.has(v.term);
                  return (
                    <li key={v.term} className="flex items-start justify-between py-3 gap-4">
                      <div>
                        <div className="text-sm font-mono font-medium"><Highlight text={v.term} q={q} /></div>
                        <p className="text-xs text-muted-foreground mt-0.5"><Highlight text={v.definitionEn} q={q} /></p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleSaveVocab(v.term)}>
                        {saved ? t('common.saved') : t('common.save')}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}

          {(filter === 'All' || filter === 'Questions') && questionItems.length > 0 && (
            <Panel title={t('search.questions')} description={`${questionItems.length} ${t('search.matchingQuestions')}`} action={<span className="chip"><MessageSquare className="w-3 h-3" /> {t('search.qaLabel')}</span>}>
              <ul className="divide-y divide-border -my-2">
                {questionItems.map((item, i) => (
                  <li key={i} className="flex items-start justify-between py-3 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-relaxed"><Highlight text={item.question} q={q} /></p>
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                    </div>
                    <Link to="/ai-interview">
                      <Button variant="outline" size="sm">{t('common.practice')} <ArrowRight className="w-3.5 h-3.5" /></Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {(filter === 'All' || filter === 'Reports') && reportItems.length > 0 && (
            <Panel title={t('search.reports')} description={`${reportItems.length} ${t('search.matchingReports')}`} action={<span className="chip"><Mic className="w-3 h-3" /> {t('search.pastSessions')}</span>}>
              <ul className="divide-y divide-border -my-2">
                {reportItems.map((r, i) => (
                  <li key={`${r.id}-${i}`} className="flex items-start justify-between py-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">{r.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground">{r.overallScore}</span>
                      <Link to={`/ai-interview/report/${r.id}`}><Button variant="outline" size="sm">{t('common.open')}</Button></Link>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {(filter === 'All' || filter === 'Sentences') && sentenceItems.length > 0 && (
            <Panel title={t('search.sentences')} description={`${sentenceItems.length} ${t('search.matchingSentences')}`} action={<span className="chip"><MessageSquare className="w-3 h-3" /> {t('common.saved')}</span>}>
              <ul className="divide-y divide-border -my-2">
                {sentenceItems.map((s) => (
                  <li key={s.pattern} className="flex items-start justify-between py-3 gap-4">
                    <div className="text-sm font-mono"><Highlight text={s.pattern} q={q} /></div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      )}
    </div>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q || !text) return <>{text}</>;
  try {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return (
      <>
        {parts.map((p, i) =>
          p.toLowerCase() === q.toLowerCase() ? (
            <mark key={i} className="bg-accent text-accent-foreground rounded px-0.5 font-medium">{p}</mark>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
      </>
    );
  } catch {
    return <>{text}</>;
  }
}
