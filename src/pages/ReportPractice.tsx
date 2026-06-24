import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getReportById } from "@/data/mockReports";
import { saveSentence } from "@/lib/mockStorage";
import {
  ArrowLeft, Sparkles, CheckCircle2, AlertCircle, Mic, Square, RotateCcw,
  ChevronLeft, ChevronRight, Volume2, VolumeX, BookOpen,
} from "lucide-react";

const CHUNK_SEPARATOR = /[.。!！?？\n]+/;

function splitIntoChunks(text: string): string[] {
  return text.split(CHUNK_SEPARATOR).map((s) => s.trim()).filter(Boolean);
}

export default function ReportPractice() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const report = id ? getReportById(id) : undefined;

  const [chunkIndex, setChunkIndex] = useState(0);
  const [practicedChunks, setPracticedChunks] = useState<Set<number>>(new Set());
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [practiceResults, setPracticeResults] = useState<
    Array<{ practicedAt: string; answer: string; score: number }>
  >([]);

  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  if (!report) {
    return (
      <div>
        <EmptyState
          title={t("reportPractice.reportNotFound")}
          description={t("reportPractice.reportNotFoundDesc")}
          action={
            <div className="flex gap-2">
              <Link to="/ai-interview"><Button variant="outline">{t("reportPractice.startNewInterview")}</Button></Link>
              <Link to="/review"><Button>{t("reportPractice.goToReview")}</Button></Link>
            </div>
          }
        />
      </div>
    );
  }

  const qd = report.questionDetails[0];
  if (!qd || (!qd.betterAnswerVersion && !qd.idealAnswer)) {
    return (
      <div>
        <EmptyState
          title={t("reportPractice.noPracticeAnswer")}
          description={t("reportPractice.noPracticeAnswerDesc")}
          action={
            <div className="flex gap-2">
              <Link to={`/ai-interview/report/${id}`}><Button variant="outline">{t("reportPractice.backToReport")}</Button></Link>
              <Link to="/ai-interview"><Button>{t("reportPractice.startNewInterview")}</Button></Link>
            </div>
          }
        />
      </div>
    );
  }

  const practiceText = qd.betterAnswerVersion || qd.idealAnswer;
  const chunks = splitIntoChunks(practiceText);

  const handleListen = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utterance.lang = locale === "zh-CN" ? "zh-CN" : "en-US";
      utterance.onend = () => setIsListening(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsListening(true);
    } else {
      toast.info(t("common.comingSoon"));
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setShowEvaluation(false);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
    if (userAnswer.trim().length < 10) {
      toast.info(t("reportPractice.needsMoreDetail"));
    }
    setShowEvaluation(true);
  };

  const handleNextChunk = () => {
    if (chunkIndex < chunks.length - 1) {
      setChunkIndex(chunkIndex + 1);
      setUserAnswer("");
      setShowEvaluation(false);
    }
  };

  const handlePrevChunk = () => {
    if (chunkIndex > 0) {
      setChunkIndex(chunkIndex - 1);
      setUserAnswer("");
      setShowEvaluation(false);
    }
  };

  const handleMarkPracticed = () => {
    const next = new Set(practicedChunks);
    next.add(chunkIndex);
    setPracticedChunks(next);
    toast.success(t("reportPractice.markPracticed"));
  };

  const handleSaveBetterAnswer = () => {
    saveSentence({ pattern: practiceText, savedAt: new Date().toISOString() });
    toast.success(t("common.saved"));
  };

  const handleSavePracticeResult = () => {
    const result = {
      practicedAt: new Date().toISOString(),
      answer: userAnswer,
      score: Math.floor(Math.random() * 30) + 60,
      reportId: id,
      questionIndex: 0,
    };
    const existing = JSON.parse(localStorage.getItem("devenglish_report_practice") || "[]");
    existing.push(result);
    localStorage.setItem("devenglish_report_practice", JSON.stringify(existing));
    toast.success(t("reportPractice.practiceSaved"));
  };

  const handlePracticeAgain = () => {
    setUserAnswer("");
    setShowEvaluation(false);
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
  };

  // Mock evaluation
  const mockScore = 60 + (userAnswer.length % 31);
  const hasGoodStructure = /first|second|then|finally|because|therefore|however/i.test(userAnswer);
  const hasKeywords = qd.missingKeyPoints.some((kp: string) =>
    userAnswer.toLowerCase().includes(kp.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/ai-interview/report/${id}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t("reportPractice.backToReport")}
        </Link>
      </div>

      <PageHeader
        title={t("reportPractice.title")}
        subtitle={t("reportPractice.desc")}
      />

      {/* Report summary */}
      <div className="panel p-4 mb-6 bg-accent/30 border-primary/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip">{report.config.role}</span>
          <span className="chip">{report.config.difficulty}</span>
          <span className="text-xs text-muted-foreground">{report.date}</span>
          <span className="text-xs font-semibold font-mono">{t("reportPractice.score")}: {report.overallScore}</span>
        </div>
        <p className="text-sm font-medium mt-2">{qd.question}</p>
        {report.weakPoints.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {report.weakPoints.map((wp: string) => (
              <span key={wp} className="chip-warning text-[11px]">{wp}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: main practice area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Original answer */}
          <Panel title={t("reportPractice.originalAnswer")}>
            <p className="text-sm text-muted-foreground">{qd.userAnswer}</p>
          </Panel>

          {/* Better answer */}
          <Panel
            title={t("reportPractice.betterAnswer")}
            className="border-primary/20 bg-accent/30"
          >
            <div className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{practiceText}</p>
              {qd.gapAnalysis.length > 0 && (
                <div className="panel p-3 bg-card border-border mt-3">
                  <p className="text-xs font-semibold mb-1">{t("report.gapAnalysis")}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {qd.gapAnalysis.map((g: string) => (
                      <li key={g} className="flex items-start gap-1.5">
                        <AlertCircle className="w-3 h-3 text-warning mt-0.5 shrink-0" /> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleSaveBetterAnswer}>
                <BookOpen className="w-3 h-3" /> {t("reportPractice.saveBetterAnswer")}
              </Button>
            </div>
          </Panel>

          {/* Sentence practice */}
          <Panel title={t("reportPractice.sentencePractice")}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {t("reportPractice.currentSentence")} {chunkIndex + 1}/{chunks.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevChunk}
                    disabled={chunkIndex === 0}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> {t("reportPractice.previousSentence")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextChunk}
                    disabled={chunkIndex >= chunks.length - 1}
                  >
                    {t("reportPractice.nextSentence")} <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="panel p-4 bg-card border-border">
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  {chunks.length > 0 ? chunks[chunkIndex] : practiceText}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={isListening ? "primary" : "outline"}
                  size="sm"
                  onClick={handleListen}
                  aria-label={isListening ? t("reportPractice.stopListening") : t("reportPractice.listen")}
                >
                  {isListening ? (
                    <><VolumeX className="w-3.5 h-3.5" /> {t("reportPractice.stopListening")}</>
                  ) : (
                    <><Volume2 className="w-3.5 h-3.5" /> {t("reportPractice.listen")}</>
                  )}
                </Button>
                <Button
                  variant={practicedChunks.has(chunkIndex) ? "primary" : "ghost"}
                  size="sm"
                  onClick={handleMarkPracticed}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                  {practicedChunks.has(chunkIndex)
                    ? t("reportPractice.practiced")
                    : t("reportPractice.markPracticed")}
                </Button>
              </div>
            </div>
          </Panel>

          {/* Recording / typing practice */}
          <Panel title={t("reportPractice.startPractice")}>
            {!isRecording ? (
              <div className="space-y-4">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={4}
                  placeholder={t("reportPractice.typePracticeAnswer")}
                  className="w-full text-sm bg-card border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={startRecording}>
                    <Mic className="w-3.5 h-3.5" /> {t("reportPractice.startPractice")}
                  </Button>
                  {userAnswer.trim() && (
                    <Button variant="ghost" size="sm" onClick={handlePracticeAgain}>
                      {t("reportPractice.clear")}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="text-2xl font-mono font-bold text-destructive animate-pulse">
                    {recordingTime}s
                  </div>
                  <button
                    onClick={stopRecording}
                    className="relative w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive flex items-center justify-center hover:bg-destructive/20 transition"
                    aria-label={t("reportPractice.stopAnswer")}
                  >
                    <Square className="w-7 h-7 text-destructive" />
                  </button>
                  <p className="text-xs text-muted-foreground">{t("reportPractice.stopAnswer")}</p>
                </div>
              </div>
            )}

            {showEvaluation && (
              <div className="panel p-4 bg-accent/40 border-primary/10 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-primary">
                    {t("reportPractice.mockEvaluation")}
                  </p>
                  <span className="text-lg font-bold">{mockScore}</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t("reportPractice.fluency")}</span>
                      <span className="font-mono">{Math.min(100, mockScore + 5)}</span>
                    </div>
                    <Progress value={Math.min(100, mockScore + 5)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t("reportPractice.accuracy")}</span>
                      <span className="font-mono">{Math.min(100, mockScore - 2)}</span>
                    </div>
                    <Progress value={Math.min(100, mockScore - 2)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t("reportPractice.structure")}</span>
                      <span className="font-mono">{Math.min(100, mockScore + 3)}</span>
                    </div>
                    <Progress value={Math.min(100, mockScore + 3)} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">
                    {t("reportPractice.strengths")}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5 list-disc pl-4">
                    {hasGoodStructure && <li>{t("reportPractice.goodStructure")}</li>}
                    {hasKeywords && <li>{t("reportPractice.keywordCoverage")}</li>}
                    {userAnswer.length > 50 && <li>{t("reportPractice.needsMoreDetail")}</li>}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">
                    {t("reportPractice.suggestions")}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5 list-disc pl-4">
                    {!hasGoodStructure && <li>{t("reportPractice.goodStructure")}</li>}
                    {!hasKeywords && <li>{t("reportPractice.keywordCoverage")}</li>}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={handlePracticeAgain}>
                    <RotateCcw className="w-3 h-3" /> {t("reportPractice.practiceAgain")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSavePracticeResult}>
                    {t("reportPractice.savePracticeResult")}
                  </Button>
                </div>
              </div>
            )}
          </Panel>
        </div>

        {/* Right sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t("reportPractice.nextActions")}>
            <div className="space-y-3">
              <Link to={`/ai-interview/report/${id}`} className="block">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-3.5 h-3.5" /> {t("reportPractice.backToReport")}
                </Button>
              </Link>
              <Link to="/ai-interview" className="block">
                <Button variant="outline" className="w-full">
                  <Sparkles className="w-3.5 h-3.5" /> {t("reportPractice.startNewInterview")}
                </Button>
              </Link>
              <Link to="/review" className="block">
                <Button className="w-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t("reportPractice.goToReview")}
                </Button>
              </Link>
            </div>
          </Panel>

          <Panel title={t("reportPractice.keywordCoverage")}>
            <div className="space-y-2">
              {qd.missingKeyPoints.map((kp: string) => (
                <div key={kp} className="flex items-center gap-2 text-xs">
                  <span className="chip-warning text-[11px]">{kp}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
