import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { getMockTopics } from "@/data/mockTopics";
import { getMockVocabulary } from "@/data/mockVocabulary";
import { getQuestionsByMode } from "@/data/mockInterviewSessions";
import { getMockReports } from "@/data/mockReports";
import { getSavedSentences, getCompletedReports, saveVocabulary, removeVocabulary, isVocabSaved } from "@/lib/mockStorage";
import { toast } from "sonner";
import { BookOpen, Sparkles, MessageSquare, Mic, ArrowRight, Search, TrendingUp } from "lucide-react";

type FilterGroup = 'All' | 'Topics' | 'Vocabulary' | 'Questions' | 'Reports' | 'Sentences';

const popularSearches = [
  "Redis", "cache", "API", "Docker", "database", "CI/CD", "STAR", "idempotent",
];

export default function SearchResults() {
  const { t, locale } = useI18n();
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
    return getQuestionsByMode('quick').filter((qItem) =>
      qItem.question.toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  const reportItems = useMemo(() => {
    if (!q) return [];
    const completed = getCompletedReports();
    const mockReports = getMockReports();
    const all = [
      ...completed.map((r) => ({
        id: r.id, date: r.date, overallScore: r.overallScore,
        title: `${t("search.mockInterview")} · ${new Date(r.date).toLocaleDateString()}`,
      })),
      ...mockReports.map((r) => ({
        id: r.id, date: r.date, overallScore: r.overallScore,
        title: `${t("search.mockInterview")} · ${new Date(r.date).toLocaleDateString()}`,
      })),
    ];
    return all.filter((r) =>
      r.title.toLowerCase().includes(q.toLowerCase()) ||
      String(r.overallScore).includes(q)
    );
  }, [q, locale]);

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
                  className="chip hover:bg-accent hover:text-accent-foreground cursor-pointer transition"
                >
                  <TrendingUp className="w-3 h-3" /> {term}
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
        subtitle={`${totals[filter]} ${t('search.resultsFor')} "${q}"`}
      />

      {/* Mobile: stacked layout; Desktop: single row */}
      <div className="panel p-3 mb-6 space-y-2 md:space-y-0 md:flex md:items-center md:gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
          <Search className="w-4 h-4 text-muted-foreground shrink-0 ml-1" />
          <input
            defaultValue={q}
            onKeyDown={(e) => {
              if (e.key === "Enter") setParams({ q: (e.target as HTMLInputElement).value });
            }}
            className="flex-1 h-8 bg-transparent text-sm focus:outline-none min-w-0"
            placeholder={t('search.placeholder')}
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`chip whitespace-nowrap shrink-0 ${filter === f ? "bg-primary text-primary-foreground border-primary" : ""}`}
            >
              {f === 'All' ? t('search.groupAll') :
               f === 'Topics' ? t('search.topics') :
               f === 'Vocabulary' ? t('search.vocabulary') :
               f === 'Questions' ? t('search.questions') :
               f === 'Reports' ? t('search.reports') :
               t('search.sentences')} ({totals[f]})
            </button>
          ))}
        </div>
      </div>

      {totals['All'] === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title={t('search.emptyState')}
          description={t('search.emptyStateDesc')}
          action={<Link to="/technical-english"><Button variant="outline">{t('search.browseLearning')}</Button></Link>}
        />
      ) : (
        <div className="space-y-6">
          {(filter === 'All' || filter === 'Topics') && topics.length > 0 && (
            <Panel title={t('search.topics')} description={`${topics.length} ${t('search.matchingTopics')}`} action={<span className="chip"><BookOpen className="w-3 h-3" /> {t('search.lessons')}</span>}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topics.map((t) => (
                  <Link key={t.slug} to={`/technical-english/${t.slug}`} className="panel p-4 hover:border-primary/40 transition block">
                    <span className="chip-blue">{t.level}</span>
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
                  <li key={`${r.date}-${i}`} className="flex items-start justify-between py-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">{r.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground">{r.overallScore}</span>
                      <Link to="/ai-interview/report"><Button variant="outline" size="sm">{t('common.open')}</Button></Link>
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
