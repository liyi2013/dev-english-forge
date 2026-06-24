import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getReviewItems } from "@/data/mockReviewItems";
import { getReviewQueue, getSavedVocabulary, getSavedSentences, updateReviewItemStatus, markMockItemReviewed } from "@/lib/mockStorage";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, ChevronRight, RotateCcw, BookOpen, Sparkles, MessageSquare } from "lucide-react";

type ReviewMode = 'wrong_answers' | 'vocabulary' | 'sentences' | 'mixed';

const modes: { id: ReviewMode; icon: typeof BookOpen; color: string }[] = [
  { id: 'wrong_answers', icon: RotateCcw, color: 'text-warning' },
  { id: 'vocabulary', icon: BookOpen, color: 'text-primary' },
  { id: 'sentences', icon: MessageSquare, color: 'text-success' },
  { id: 'mixed', icon: Sparkles, color: 'text-primary' },
];

interface SessionItem {
  id: string;
  type: 'wrong_answer' | 'vocab' | 'sentence';
  title: string;
  prompt: string;
  answer: string;
  source: string;
  mastered: boolean;
}

export default function ReviewSession() {
  const { t, locale } = useI18n();
  const [mode, setMode] = useState<ReviewMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [items, setItems] = useState<SessionItem[]>([]);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [sessionDone, setSessionDone] = useState(false);

  const buildItems = (m: ReviewMode): SessionItem[] => {
    const result: SessionItem[] = [];

    if (m === 'wrong_answers' || m === 'mixed') {
      const mock = getReviewItems().map((r) => ({
        id: `mock-${r.id}`, type: 'wrong_answer' as const,
        title: r.title, prompt: r.content,
        answer: r.correctAnswer || r.problem || '',
        source: r.source, mastered: false,
      }));
      const queue = getReviewQueue().map((r) => ({
        id: `queue-${r.id}`, type: 'wrong_answer' as const,
        title: r.title, prompt: r.title,
        answer: '', source: r.source, mastered: false,
      }));
      result.push(...mock, ...queue);
    }

    if (m === 'vocabulary' || m === 'mixed') {
      const vocab = getSavedVocabulary().map((v) => ({
        id: `vocab-${v.term}`, type: 'vocab' as const,
        title: v.term, prompt: v.term,
        answer: '', source: t('review.modeVocabulary'), mastered: false,
      }));
      result.push(...vocab);
    }

    if (m === 'sentences' || m === 'mixed') {
      const sents = getSavedSentences().map((s, i) => ({
        id: `sent-${i}`, type: 'sentence' as const,
        title: s.pattern, prompt: s.pattern,
        answer: '', source: t('review.modeSentences'), mastered: false,
      }));
      result.push(...sents);
    }

    return result;
  };

  const startMode = (m: ReviewMode) => {
    const built = buildItems(m);
    setItems(built);
    setMode(m);
    setCurrentIndex(0);
    setShowAnswer(false);
    setMasteredIds(new Set());
    setSessionDone(false);
  };

  const handleMarkMastered = () => {
    if (currentIndex >= items.length) return;
    const item = items[currentIndex];
    const newMastered = new Set(masteredIds);
    newMastered.add(item.id);
    setMasteredIds(newMastered);

    // Persist for wrong_answer items
    if (item.type === 'wrong_answer') {
      const realId = item.id.replace(/^(mock|queue)-/, '');
      if (item.id.startsWith('mock-')) {
        markMockItemReviewed(realId);
      } else {
        updateReviewItemStatus(realId, 'reviewed');
      }
    }

    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, mastered: true } : i));
    toast.success(t('common.saved'));
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setSessionDone(true);
    }
  };

  const handleEndSession = () => {
    setSessionDone(true);
  };

  // Mode selection view
  if (!mode) {
    return (
      <div>
        <div className="mb-4">
          <Link to="/review" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('review.backToReview')}
          </Link>
        </div>
        <PageHeader title={t('review.sessionTitle')} subtitle={t('review.sessionDesc')} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => startMode(m.id)}
                className="panel p-5 text-left hover:border-primary/40 transition cursor-pointer"
              >
                <Icon className={`w-6 h-6 ${m.color}`} />
                <h4 className="mt-3 text-sm font-semibold">
                  {m.id === 'wrong_answers' ? t('review.modeWrongAnswers') :
                   m.id === 'vocabulary' ? t('review.modeVocabulary') :
                   m.id === 'sentences' ? t('review.modeSentences') :
                   t('review.modeMixed')}
                </h4>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Completion view
  if (sessionDone) {
    return (
      <div>
        <div className="mb-4">
          <Link to="/review" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('review.backToReview')}
          </Link>
        </div>
        <PageHeader title={t('review.sessionComplete')} subtitle={t('review.sessionSummary')} />

        <div className="panel p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 mx-auto text-success" />
          <p className="text-lg font-semibold">{t('review.sessionComplete')}</p>
          <div className="flex justify-center gap-8">
            <div>
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="text-xs text-muted-foreground">{t('review.itemsReviewed')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{masteredIds.size}</p>
              <p className="text-xs text-muted-foreground">{t('review.itemsMastered')}</p>
            </div>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <Link to="/review"><Button variant="outline">{t('review.backToReview')}</Button></Link>
            <Button onClick={() => startMode(mode)}>
              <RotateCcw className="w-3.5 h-3.5" /> {t('common.continue')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div>
        <div className="mb-4">
          <Link to="/review" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('review.backToReview')}
          </Link>
        </div>
        <PageHeader title={t('review.sessionTitle')} />
        <EmptyState
          title={t('review.noSessionItems')}
          description={t('review.noSessionItemsDesc')}
          action={
            <div className="flex gap-2">
              <Link to="/review"><Button variant="outline">{t('review.backToReview')}</Button></Link>
              <Link to="/technical-english"><Button variant="outline">{t('review.browseTech')}</Button></Link>
              <Link to="/ai-interview"><Button>{t('review.startInterview')}</Button></Link>
            </div>
          }
        />
      </div>
    );
  }

  // Active review card
  const item = items[currentIndex];
  const isMastered = masteredIds.has(item.id);

  return (
    <div>
      <div className="mb-4">
        <Link to="/review" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-3.5 h-3.5" /> {t('review.backToReview')}
        </Link>
      </div>

      <PageHeader
        title={t('review.sessionTitle')}
        subtitle={t('review.sessionDesc')}
      />

      {/* Progress */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs text-muted-foreground shrink-0">{t('common.item')} {currentIndex + 1}/{items.length}</span>
        <Progress value={(currentIndex + 1) / items.length * 100} className="flex-1" />
      </div>

      {/* Card */}
      <div className="panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="chip">
            {item.type === 'wrong_answer' ? t('review.modeWrongAnswers') :
             item.type === 'vocab' ? t('review.modeVocabulary') :
             t('review.modeSentences')}
          </span>
          <span className="text-xs text-muted-foreground">{item.source}</span>
          {isMastered && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
        </div>

        <div>
          <p className="text-sm font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{item.prompt}</p>
        </div>

        {showAnswer && (
          <div className="panel p-3 bg-accent/40 border-primary/10">
            <p className="text-xs font-medium text-primary mb-1">{t('review.showAnswer')}</p>
            <p className="text-sm">{item.answer}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showAnswer ? t('review.hideAnswer') : t('review.showAnswer')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleMarkMastered} disabled={isMastered}>
            <CheckCircle2 className="w-3.5 h-3.5" /> {t('review.markMastered')}
          </Button>
          <Button size="sm" onClick={handleNext}>
            {currentIndex < items.length - 1 ? <>{t('review.nextItem')} <ChevronRight className="w-3.5 h-3.5" /></> : t('common.completed')}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleEndSession}>
            {t('review.endSession')}
          </Button>
        </div>
      </div>
    </div>
  );
}
