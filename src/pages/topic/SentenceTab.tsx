import { useState } from "react";
import { useI18n } from "@/i18n";
import { SaveButton } from "@/components/common/SaveButton";
import { isSentenceSaved, saveSentence, removeSentence } from "@/lib/mockStorage";
import type { LearningTopic } from "@/types/learning";
import { MessageSquare } from "lucide-react";

export function SentenceTab({ topic }: { topic: LearningTopic }) {
  const { t } = useI18n();
  const [savedPatterns, setSavedPatterns] = useState<Set<string>>(() => {
    return new Set(topic.sentencePatterns.filter((s) => isSentenceSaved(s.pattern)).map((s) => s.pattern));
  });

  const handleToggle = (pattern: string) => {
    if (savedPatterns.has(pattern)) {
      removeSentence(pattern);
      setSavedPatterns((prev) => { const next = new Set(prev); next.delete(pattern); return next; });
    } else {
      saveSentence({ pattern, savedAt: new Date().toISOString() });
      setSavedPatterns((prev) => { const next = new Set(prev); next.add(pattern); return next; });
    }
  };

  return (
    <div className="space-y-4">
      {topic.sentencePatterns.map((s) => {
        const saved = savedPatterns.has(s.pattern);
        return (
          <div key={s.pattern} className="panel p-4 border-border/60 hover:border-primary/30 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  <span className="chip-blue">{t('sentence.pattern')}</span>
                </div>
                <p className="text-base font-medium mt-2 font-mono text-foreground">{s.pattern}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.meaningZh}</p>
                <div className="mt-3 panel p-3 bg-accent/40 border-border/40">
                  <p className="text-xs text-muted-foreground font-medium">{t('topic.example')}:</p>
                  <p className="text-sm text-foreground mt-0.5 italic">"{s.example}"</p>
                </div>
              </div>
              <SaveButton
                saved={saved}
                onToggle={() => handleToggle(s.pattern)}
                savedLabel={t('common.saved')}
                unsavedLabel={t('common.save')}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
