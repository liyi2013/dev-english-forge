import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Panel, Button, Progress } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import { getQuestionsByMode } from "@/data/mockInterviewSessions";
import { getInterviewConfig, setInterviewProgress, clearInterviewProgress } from "@/lib/mockStorage";
import { Mic, Square, ChevronLeft, ChevronRight, X, CheckCircle2, AlertCircle } from "lucide-react";

export default function InterviewRoom() {
  const { t } = useI18n();
  const config = getInterviewConfig();
  const questions = config ? getQuestionsByMode(config.mode) : [];
  const questionCount = config?.questionCount ?? 5;
  const displayQuestions = questions.slice(0, Math.min(questionCount, questions.length));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = displayQuestions[currentIndex];
  const progress = ((currentIndex + 1) / displayQuestions.length) * 100;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setAnswers((prev) => ({ ...prev, [currentIndex]: userAnswer || `[Recorded answer - ${recordingTime}s]` }));
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (currentIndex < displayQuestions.length - 1) {
      if (userAnswer) {
        setAnswers((prev) => ({ ...prev, [currentIndex]: userAnswer }));
      }
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserAnswer(answers[currentIndex - 1] || "");
    }
  };

  const handleEndInterview = () => {
    if (userAnswer) {
      setAnswers((prev) => ({ ...prev, [currentIndex]: userAnswer }));
    }
    // Save progress
    const answersRecord: Record<number, { text: string; duration: number }> = {};
    Object.entries(answers).forEach(([key, val]) => {
      answersRecord[parseInt(key)] = { text: val, duration: 0 };
    });
    if (userAnswer) {
      answersRecord[currentIndex] = { text: userAnswer, duration: recordingTime };
    }
    setInterviewProgress({
      currentIndex,
      answers: answersRecord,
      completed: true,
    });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">{t('common.noResults')}</p>
          <Link to="/ai-interview">
            <Button variant="outline" className="mt-4">{t('common.back')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="-m-6 lg:-m-8 min-h-[calc(100vh-3.5rem)] bg-background">
      {/* Mini bar */}
      <div className="h-12 border-b border-border bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-3 text-sm">
          <span className="chip-blue">{t('ai.live')}</span>
          <span className="font-medium">{config?.role ?? 'Backend'} · {config?.difficulty ?? 'Mid-level'}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground font-mono">{t('ai.question')} {currentIndex + 1} {t('ai.of')} {displayQuestions.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{formatTime(recordingTime)}</span>
          <Link to="/ai-interview/report" onClick={handleEndInterview}>
            <Button variant="ghost" size="sm"><X className="w-3.5 h-3.5" /> {t('ai.endInterview')}</Button>
          </Link>
        </div>
      </div>

      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Main */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Panel padded={false}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {t('ai.question')} {currentIndex + 1} {t('ai.of')} {displayQuestions.length} · {currentQuestion.type}
                  </span>
                  <Progress value={progress} className="w-32" />
                </div>
                <h2 className="mt-4 text-xl font-semibold leading-relaxed">{currentQuestion.question}</h2>
                <p className="text-sm text-muted-foreground mt-3">{currentQuestion.hint}</p>
              </div>

              {/* Answer area */}
              <div className="border-t border-border p-6">
                <label className="text-xs font-medium text-muted-foreground">{t('report.yourAnswer')}</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={4}
                  placeholder="Type your answer or use voice recording below…"
                  className="w-full mt-2 text-sm bg-card border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />

                {/* Mic area */}
                <div className="mt-4 flex flex-col items-center border-t border-border pt-6">
                  <button
                    onClick={handleToggleRecording}
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition ${
                      isRecording ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {isRecording ? <Square className="w-5 h-5" fill="currentColor" /> : <Mic className="w-6 h-6" />}
                  </button>

                  {isRecording && (
                    <div className="mt-3 flex items-end gap-0.5 h-6">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <span key={i} className="w-1 bg-primary/60 rounded-full" style={{ height: `${20 + Math.abs(Math.sin(i * 0.6 + Date.now() * 0.001)) * 80}%` }} />
                      ))}
                    </div>
                  )}

                  <div className="mt-2 font-mono text-lg tabular-nums">{formatTime(recordingTime)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRecording ? t('ai.recording') : (userAnswer ? 'Answer saved' : 'Click mic to record')}
                  </p>
                </div>
              </div>
            </Panel>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
                <ChevronLeft className="w-4 h-4" /> {t('ai.previous')}
              </Button>
              {currentIndex < displayQuestions.length - 1 ? (
                <Button onClick={handleNext}>
                  {t('ai.next')} <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Link to="/ai-interview/report" onClick={handleEndInterview}>
                  <Button>{t('ai.endInterview')} <ChevronRight className="w-4 h-4" /></Button>
                </Link>
              )}
            </div>
          </div>

          {/* Live analysis */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Panel title={t('ai.liveAnalysis')} description="Updates as you speak">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{t('ai.detectedKeywords')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {["cache key", "expiration", "traffic pattern"].map((k) => (
                    <span key={k} className="chip-green"><CheckCircle2 className="w-3 h-3" /> {k}</span>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{t('ai.missingPoints')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {["hot key", "cache penetration", "monitoring metrics"].map((k) => (
                    <span key={k} className="chip-amber"><AlertCircle className="w-3 h-3" /> {k}</span>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel title={t('ai.scorePreview')} description="Live, will be refined at end">
              <ul className="space-y-3">
                {[
                  { name: 'Fluency', value: 76 },
                  { name: 'Technical Accuracy', value: 64 },
                  { name: 'Answer Structure', value: 58 },
                ].map((s) => (
                  <li key={s.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{s.name}</span>
                      <span className="font-mono text-muted-foreground">{s.value}</span>
                    </div>
                    <Progress value={s.value} />
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
