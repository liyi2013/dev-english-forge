import { useI18n } from "@/i18n";
import { SaveButton } from "@/components/common/SaveButton";
import { isVocabSaved, saveVocabulary, removeVocabulary } from "@/lib/mockStorage";
import type { LearningTopic } from "@/types/learning";

export function VocabularyTab({ topic }: { topic: LearningTopic }) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      {topic.vocabulary.map((v) => {
        const saved = isVocabSaved(v.term);
        return (
          <div key={v.term} className="panel p-4 border-border/60 hover:border-primary/30 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-semibold font-mono">{v.term}</span>
                  <span className="chip text-[11px]">{t('topic.pronunciation')}: {v.pronunciation}</span>
                </div>
                <p className="text-sm text-foreground mt-2">
                  <span className="font-medium">{t('topic.definition')}:</span> {v.definitionEn}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{v.definitionZh}</p>
                <p className="text-sm text-muted-foreground mt-2 italic">
                  "{v.exampleSentence}"
                </p>
              </div>
              <SaveButton
                saved={saved}
                onToggle={() => saved ? removeVocabulary(v.term) : saveVocabulary({ term: v.term, savedAt: new Date().toISOString() })}
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
