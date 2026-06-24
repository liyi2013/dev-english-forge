import { useState, useRef, useCallback, useEffect } from "react";
import { Button, Progress } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import type { LearningTopic } from "@/types/learning";
import { Mic, Square } from "lucide-react";

export function SpeakTab({ topic }: { topic: LearningTopic }) {
  const { t } = useI18n();
  const [speaking, setSpeaking] = useState(false);
  const [speakingTime, setSpeakingTime] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  const handleStartSpeaking = () => {
    clearTimers();
    setSpeaking(true);
    setSpeakingTime(0);
    setShowEvaluation(false);
    intervalRef.current = setInterval(() => {
      setSpeakingTime((t) => t + 1);
    }, 1000);
    timeoutRef.current = setTimeout(() => {
      clearTimers();
      setSpeaking(false);
      setShowEvaluation(true);
    }, topic.speakingPrompt.durationSeconds * 1000);
  };

  const handleStopSpeaking = () => {
    clearTimers();
    setSpeaking(false);
    setShowEvaluation(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="panel p-6 bg-accent/40">
        <Mic className="w-8 h-8 mx-auto text-primary" />
        <h3 className="mt-4 text-lg font-semibold">{t('topic.speakingPrompt')}</h3>
        <p className="text-sm text-foreground mt-2 leading-relaxed">{topic.speakingPrompt.prompt}</p>
        <p className="text-xs text-muted-foreground mt-2">{topic.speakingPrompt.promptZh}</p>
        <p className="text-xs text-muted-foreground mt-3">
          ⏱ {topic.speakingPrompt.durationSeconds}s · {t('common.start')}
        </p>
      </div>

      <div className="panel p-8 flex flex-col items-center">
        {!speaking && !showEvaluation && (
          <Button size="lg" onClick={handleStartSpeaking}>
            <Mic className="w-5 h-5" /> {t('topic.recordAnswer')}
          </Button>
        )}

        {speaking && (
          <>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
              <button className="relative w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Mic className="w-7 h-7" />
              </button>
            </div>
            <div className="mt-4 flex items-end gap-0.5 h-8">
              {Array.from({ length: 32 }).map((_, i) => (
                <span key={i} className="w-1 bg-primary/60 rounded-full" style={{ height: `${20 + Math.abs(Math.sin(i * 0.6 + Date.now() * 0.001)) * 80}%` }} />
              ))}
            </div>
            <div className="mt-4 font-mono text-2xl tabular-nums">{formatTime(speakingTime)}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('ai.recording')}</p>
            <Button variant="danger" size="lg" className="mt-4" onClick={handleStopSpeaking}>
              <Square className="w-4 h-4" fill="currentColor" /> {t('ai.stopAnswer')}
            </Button>
          </>
        )}

        {showEvaluation && !speaking && (
          <div className="w-full space-y-4">
            <h4 className="text-sm font-semibold">{t('topic.mockEvaluationLabel')}</h4>
            <div className="panel p-4 bg-accent/40 space-y-2">
              <div className="flex justify-between text-xs"><span>{t('topic.fluency')}</span><span className="font-mono">72%</span></div>
              <Progress value={72} />
              <div className="flex justify-between text-xs"><span>{t('topic.tabVocabulary')}</span><span className="font-mono">58%</span></div>
              <Progress value={58} />
              <div className="flex justify-between text-xs"><span>{t('topic.clarity')}</span><span className="font-mono">65%</span></div>
              <Progress value={65} />
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleStartSpeaking}>
                <Mic className="w-4 h-4" /> {t('topic.practiceAgain')}
              </Button>
              <Button variant="outline" onClick={() => setShowEvaluation(false)}>{t('common.close')}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
