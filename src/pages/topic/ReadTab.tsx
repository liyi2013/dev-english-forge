import { useState } from "react";
import { Button, Panel } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { isLessonCompleted, markLessonCompleted } from "@/lib/mockStorage";
import type { LearningTopic } from "@/types/learning";
import { BookOpen, Volume2, Lightbulb, CheckCircle2 } from "lucide-react";

export function ReadTab({ topic }: { topic: LearningTopic }) {
  const { t } = useI18n();
  const [completed, setCompleted] = useState(() => isLessonCompleted(topic.slug));
  const [understandingAnswer, setUnderstandingAnswer] = useState("");
  const [understandingResult, setUnderstandingResult] = useState<boolean | null>(null);

  const handleMarkRead = () => {
    if (!completed) {
      markLessonCompleted(topic.slug);
      setCompleted(true);
    }
  };

  const handleCheckUnderstanding = () => {
    const keywords = ["same", "repeated", "request", "result", "multiple"];
    const hasKeyword = keywords.some((k) => understandingAnswer.toLowerCase().includes(k));
    setUnderstandingResult(hasKeyword);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t('topic.readingPassage')}</span>
            <span className="chip">~2 min</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => toast.info(t("common.comingSoon"))}>
            <Volume2 className="w-3.5 h-3.5" /> {t('topic.listen')}
          </Button>
        </div>

        <article className="text-foreground leading-loose text-[15px] space-y-3">
          {topic.readingParagraph.split('\n').filter(Boolean).map((para, i) => (
            <p key={i}>
              {para.split(/(`[^`]+`)/).map((seg, j) =>
                seg.startsWith('`') && seg.endsWith('`') ? (
                  <code key={j} className="text-sm bg-secondary px-1 rounded font-mono">{seg.slice(1, -1)}</code>
                ) : (
                  <span key={j}>{seg}</span>
                )
              )}
            </p>
          ))}
        </article>

        <div className="mt-6 panel p-4 bg-accent border-primary/10">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary font-semibold mb-2">
            <Lightbulb className="w-3.5 h-3.5" /> {t('topic.understandingCheck')}
          </div>
          <p className="text-sm font-medium text-foreground">
            What does <span className="font-mono">idempotent</span> mean in your own words?
          </p>
          <textarea
            value={understandingAnswer}
            onChange={(e) => setUnderstandingAnswer(e.target.value)}
            rows={3}
            placeholder="Type your answer in English…"
            className="w-full mt-2 text-sm bg-card border border-border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          {understandingResult !== null && (
            <p className={`mt-2 text-xs ${understandingResult ? 'text-success' : 'text-warning'}`}>
              {understandingResult
                ? 'Great! Idempotent means the result is the same no matter how many times you make the request.'
                : 'Hint: Think about what happens when you make the same request multiple times.'}
            </p>
          )}
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleCheckUnderstanding}>{t('topic.checkAnswer')}</Button>
            <Button variant="outline" size="sm" onClick={() => { setUnderstandingAnswer(''); setUnderstandingResult(null); }}>
              {t('common.reset')}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkRead}>
            {completed && <CheckCircle2 className="w-3.5 h-3.5" />}
            {completed ? t('common.completed') : t('topic.markAsRead')}
          </Button>
        </div>
      </div>

      <aside className="col-span-12 lg:col-span-4">
        <Panel title={t('topic.keyPointsLabel')}>
          <ul className="space-y-1.5">
            {topic.keyPoints.map((k) => (
              <li key={k} className="flex items-center justify-between text-sm">
                <span className="font-mono">{k}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </aside>
    </div>
  );
}
