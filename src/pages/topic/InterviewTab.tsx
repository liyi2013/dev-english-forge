import { useState } from "react";
import { Button, Panel } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import type { LearningTopic } from "@/types/learning";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function InterviewTab({ topic }: { topic: LearningTopic }) {
  const { t } = useI18n();
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="panel p-6">
        <div className="chip-blue mb-3">{t('interview.question')}</div>
        <h3 className="text-lg font-semibold leading-relaxed">{topic.interviewQuestion.question}</h3>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">{t('report.yourAnswer')}</label>
        <textarea
          value={interviewAnswer}
          onChange={(e) => setInterviewAnswer(e.target.value)}
          rows={5}
          placeholder={t("common.typeAnswerEnglish")}
          className="w-full mt-1.5 text-sm bg-card border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
        <div className="flex gap-2 mt-2">
          <Button onClick={() => setShowIdealAnswer(true)}>{t('topic.evaluate')}</Button>
          <Button variant="outline" onClick={() => { setInterviewAnswer(''); setShowIdealAnswer(false); }}>{t('common.clear')}</Button>
        </div>
      </div>

      {showIdealAnswer && (
        <div className="space-y-4">
          <Panel title={t('topic.idealAnswer')} className="border-primary/20 bg-accent/30">
            <p className="text-sm text-foreground leading-relaxed">{topic.interviewQuestion.idealAnswer}</p>
          </Panel>

          <Panel title={t('topic.keyPointsLabel')}>
            <div className="flex flex-wrap gap-2">
              {topic.interviewQuestion.keyPoints.map((kp) => (
                <span key={kp} className="chip-green"><CheckCircle2 className="w-3 h-3" /> {kp}</span>
              ))}
            </div>
          </Panel>

          <Panel title={t('topic.commonMistakes')}>
            <ul className="space-y-1.5">
              {topic.interviewQuestion.commonMistakes.map((cm) => (
                <li key={cm} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                  <span>{cm}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </div>
  );
}
