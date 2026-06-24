import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { t } from "@/i18n";
import { getMockTopics } from "@/data/mockTopics";
import { getMockVocabulary } from "@/data/mockVocabulary";
import { getQuestionsByMode } from "@/data/mockInterviewSessions";
import { getSavedSentences, getCompletedReports } from "@/lib/mockStorage";
import { BookOpen, Sparkles, MessageSquare, Mic, ArrowRight, Search } from "lucide-react";

type FilterGroup = 'All' | 'Topics' | 'Vocabulary' | 'Questions' | 'Reports' | 'Sentences';

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [filter, setFilter] = useState<FilterGroup>('All');

  // Actual filtering of mock data
  const topics = useMemo(() => {
    if (!q) return getMockTopics();
    return getMockTopics().filter(
      (t) =>
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        t.titleZh.toLowerCase().includes(q.toLowerCase()) ||
        t.explainGoal.toLowerCase().includes(q.toLowerCase()) ||
        t.keyPoints.some((kp) => kp.toLowerCase().includes(q.toLowerCase())) ||
        t.vocabulary.some((v) => v.term.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q]);

  const vocabItems = useMemo(() => {
    if (!q) return [];
    return getMockVocabulary().filter(
      (v) =>
        v.term.toLowerCase().includes(q.toLowerCase()) ||
        v.definitionEn.toLowerCase().includes(q.toLowerCase()) ||
        v.definitionZh.includes(q)
    );
  }, [q]);

  const questionItems = useMemo(() => {
    if (!q) return [];
    const allQ = getQuestionsByMode('quick');
    return allQ.filter(
      (qItem) =>
        qItem.question.toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  const reportItems = useMemo(() => {
    if (!q) return [];
    const reports = getCompletedReports();
    return reports.filter((r) =>
      r.date.toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  const sentenceItems = useMemo(() => {
    if (!q) return [];
    return getSavedSentences().filter((s) =>
      s.pattern.toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  const totals = {
    All: topics.length + vocabItems.length + questionItems.length + reportItems.length + sentenceItems.length,
    Topics: topics.length,
    Vocabulary: vocabItems.length,
    Questions: questionItems.length,
    Reports: reportItems.length,
    Sentences: sentenceItems.length,
  };

  const filters: FilterGroup[] = ['All', 'Topics', 'Vocabulary', 'Questions', 'Reports', 'Sentences'];

  return (
    <div>
      <PageHeader
        title={t('search.title')}
        subtitle={`${totals[filter]} ${t('search.resultsFor')} "${q}"`}
      />

      <div className="panel p-3 mb-6 flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground ml-1.5" />
        <input
          defaultValue={q}
          onKeyDown={(e) => {
            if (e.key === "Enter") setParams({ q: (e.target as HTMLInputElement).value });
          }}
          className="flex-1 h-8 bg-transparent text-sm focus:outline-none"
          placeholder={t('search.placeholder')}
        />
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`chip ${filter === f ? "bg-primary text-primary-foreground border-primary" : ""}`}
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
          {/* Topics */}
          {(filter === 'All' || filter === 'Topics') && topics.length > 0 && (
            <Panel title={t('search.topics')} description={`${topics.length} matching topics`} action={<span className="chip"><BookOpen className="w-3 h-3" /> Lessons</span>}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topics.map((t) => (
                  <Link key={t.slug} to={`/technical-english/${t.slug}`} className="panel p-4 hover:border-primary/40 transition block">
                    <div className="flex items-center gap-2">
                      <span className="chip-blue">{t.level}</span>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold"><Highlight text={t.title} q={q} /></h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed"><Highlight text={t.explainGoal} q={q} /></p>
                  </Link>
                ))}
              </div>
            </Panel>
          )}

          {/* Vocabulary */}
          {(filter === 'All' || filter === 'Vocabulary') && vocabItems.length > 0 && (
            <Panel title={t('search.vocabulary')} description={`${vocabItems.length} matching terms`} action={<span className="chip"><Sparkles className="w-3 h-3" /> Terms</span>}>
              <ul className="divide-y divide-border -my-2">
                {vocabItems.map((v) => (
                  <li key={v.term} className="flex items-start justify-between py-3 gap-4">
                    <div>
                      <div className="text-sm font-mono font-medium"><Highlight text={v.term} q={q} /></div>
                      <p className="text-xs text-muted-foreground mt-0.5"><Highlight text={v.definitionEn} q={q} /></p>
                    </div>
                    <Button variant="outline" size="sm">{t('common.save')}</Button>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Interview Questions */}
          {(filter === 'All' || filter === 'Questions') && questionItems.length > 0 && (
            <Panel title={t('search.questions')} description={`${questionItems.length} matching questions`} action={<span className="chip"><MessageSquare className="w-3 h-3" /> Q&A</span>}>
              <ul className="divide-y divide-border -my-2">
                {questionItems.map((item, i) => (
                  <li key={i} className="flex items-start justify-between py-3 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-relaxed"><Highlight text={item.question} q={q} /></p>
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                    </div>
                    <Link to="/ai-interview">
                      <Button variant="outline" size="sm">Practice <ArrowRight className="w-3.5 h-3.5" /></Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Reports */}
          {(filter === 'All' || filter === 'Reports') && reportItems.length > 0 && (
            <Panel title={t('search.reports')} description={`${reportItems.length} matching reports`} action={<span className="chip"><Mic className="w-3 h-3" /> Past sessions</span>}>
              <ul className="divide-y divide-border -my-2">
                {reportItems.map((r) => (
                  <li key={r.id} className="flex items-start justify-between py-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Mock Interview · {new Date(r.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground">{r.overallScore}</span>
                      <Link to="/ai-interview/report"><Button variant="outline" size="sm">Open</Button></Link>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Saved Sentences */}
          {(filter === 'All' || filter === 'Sentences') && sentenceItems.length > 0 && (
            <Panel title={t('search.sentences')} description={`${sentenceItems.length} matching sentences`} action={<span className="chip"><MessageSquare className="w-3 h-3" /> Saved</span>}>
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
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
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
