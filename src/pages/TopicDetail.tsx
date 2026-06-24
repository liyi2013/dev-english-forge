import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { PageHeader, Panel, Tabs, Button, Progress } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { SaveButton } from "@/components/common/SaveButton";
import { getTopicBySlug } from "@/data/mockTopics";
import { isVocabSaved, saveVocabulary, removeVocabulary, isSentenceSaved, saveSentence, removeSentence, isLessonCompleted, markLessonCompleted } from "@/lib/mockStorage";
import { t } from "@/i18n";
import {
  Mic, Volume2, BookOpen, MessageSquare, Sparkles, Lightbulb, ArrowRight, Target,
  CheckCircle2, AlertCircle, Play, Square, ChevronLeft, ChevronRight,
} from "lucide-react";

const tabs = ["Read", "Vocabulary", "Sentence", "Speak", "Interview"];

const outcomes: Record<string, string> = {
  Read: "Understand the concept in English.",
  Vocabulary: "Remember key terms and recall them on demand.",
  Sentence: "Build reusable sentence patterns you can plug into real conversations.",
  Speak: "Explain the concept aloud, clearly and in your own words.",
  Interview: "Answer a real interview question end-to-end.",
};

export default function TopicDetail() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const topic = topicSlug ? getTopicBySlug(topicSlug) : undefined;

  if (!topic) {
    return <Navigate to="/technical-english" replace />;
  }

  const [tab, setTab] = useState("Read");
  const [speaking, setSpeaking] = useState(false);
  const [speakingTime, setSpeakingTime] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);
  const [understandingAnswer, setUnderstandingAnswer] = useState("");
  const [understandingResult, setUnderstandingResult] = useState<boolean | null>(null);

  const completed = isLessonCompleted(topic.slug);

  const handleMarkRead = () => {
    if (!completed) {
      markLessonCompleted(topic.slug);
    }
  };

  const handleStartSpeaking = () => {
    setSpeaking(true);
    setSpeakingTime(0);
    const interval = setInterval(() => {
      setSpeakingTime((t) => t + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setSpeaking(false);
      setShowEvaluation(true);
    }, topic.speakingPrompt.durationSeconds * 1000);
  };

  const handleStopSpeaking = () => {
    setSpeaking(false);
    setShowEvaluation(true);
  };

  const handleCheckUnderstanding = () => {
    const keywords = ["same", "repeated", "request", "result", "multiple"];
    const hasKeyword = keywords.some((k) => understandingAnswer.toLowerCase().includes(k));
    setUnderstandingResult(hasKeyword);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div>
      <PageHeader
        title={`${topic.title}${topic.titleZh ? ` · ${topic.titleZh}` : ''}`}
        subtitle={`${topic.explainGoal}`}
        actions={
          <>
            <span className="chip">{topic.level} · {t('unit.unit')} {topic.unit}{t('unit.of')}{topic.totalUnits}</span>
            {completed && <span className="chip-green"><CheckCircle2 className="w-3 h-3" /> Completed</span>}
            <Button variant="outline" size="md">{t('common.save')}</Button>
            <Link to="/technical-english">
              <Button>{t('common.back')} <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </>
        }
      />

      <div className="panel">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {/* Learning outcome banner */}
        <div className="px-6 py-3 border-b border-border bg-accent/40 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">{t('topic.learningOutcome')}</span>
          <span className="text-sm text-foreground">{outcomes[tab]}</span>
        </div>

        <div className="p-6">
          {/* === READ TAB === */}
          {tab === "Read" && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('topic.readingPassage')}</span>
                    <span className="chip">~2 min</span>
                  </div>
                  <Button variant="ghost" size="sm">
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

                {/* Understanding Check */}
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
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleMarkRead}>
                    {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                    {completed ? 'Completed' : t('topic.markAsRead')}
                  </Button>
                </div>
              </div>

              <aside className="col-span-12 lg:col-span-4 space-y-4">
                <Panel title={t('topic.keyPoints')}>
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
          )}

          {/* === VOCABULARY TAB === */}
          {tab === "Vocabulary" && (
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
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* === SENTENCE TAB === */}
          {tab === "Sentence" && (
            <div className="space-y-4">
              {topic.sentencePatterns.map((s) => {
                const saved = isSentenceSaved(s.pattern);
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
                        onToggle={() => saved ? removeSentence(s.pattern) : saveSentence({ pattern: s.pattern, savedAt: new Date().toISOString() })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* === SPEAK TAB === */}
          {tab === "Speak" && (
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="panel p-6 bg-accent/40">
                <Mic className="w-8 h-8 mx-auto text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{t('topic.speakingPrompt')}</h3>
                <p className="text-sm text-foreground mt-2 leading-relaxed">
                  {topic.speakingPrompt.prompt}
                </p>
                <p className="text-xs text-muted-foreground mt-2">{topic.speakingPrompt.promptZh}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  ⏱ {topic.speakingPrompt.durationSeconds} seconds · {t('common.start')}
                </p>
              </div>

              {/* Recording area */}
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
                    <h4 className="text-sm font-semibold">{t('topic.mockEvaluation')}</h4>
                    <div className="panel p-4 bg-accent/40 space-y-2">
                      <div className="flex justify-between text-xs"><span>Fluency</span><span className="font-mono">72%</span></div>
                      <Progress value={72} />
                      <div className="flex justify-between text-xs"><span>Vocabulary</span><span className="font-mono">58%</span></div>
                      <Progress value={58} />
                      <div className="flex justify-between text-xs"><span>Clarity</span><span className="font-mono">65%</span></div>
                      <Progress value={65} />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleStartSpeaking}>
                        <Mic className="w-4 h-4" /> Practice Again
                      </Button>
                      <Button variant="outline" onClick={() => setShowEvaluation(false)}>Close</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === INTERVIEW TAB === */}
          {tab === "Interview" && (
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
                  placeholder="Type your answer in English…"
                  className="w-full mt-1.5 text-sm bg-card border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => setShowIdealAnswer(true)}>{t('topic.evaluate')}</Button>
                  <Button variant="outline" onClick={() => setInterviewAnswer('')}>Clear</Button>
                </div>
              </div>

              {showIdealAnswer && (
                <div className="space-y-4">
                  <Panel title={t('topic.idealAnswer')} className="border-primary/20 bg-accent/30">
                    <p className="text-sm text-foreground leading-relaxed">{topic.interviewQuestion.idealAnswer}</p>
                  </Panel>

                  <Panel title="Key Points">
                    <div className="flex flex-wrap gap-2">
                      {topic.interviewQuestion.keyPoints.map((kp) => (
                        <span key={kp} className="chip-green"><CheckCircle2 className="w-3 h-3" /> {kp}</span>
                      ))}
                    </div>
                  </Panel>

                  <Panel title="Common Mistakes">
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
          )}
        </div>

        {/* Preview row for other tabs */}
        <div className="border-t border-border bg-background/50 p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 px-1">
            {t('topic.previewOtherTabs')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { tab: "Vocabulary", icon: Sparkles, label: topic.vocabulary[0]?.term ?? '', body: topic.vocabulary[0]?.definitionEn ?? '' },
              { tab: "Sentence", icon: MessageSquare, label: "Sentence pattern", body: topic.sentencePatterns[0]?.pattern ?? '' },
              { tab: "Speak", icon: Mic, label: "Speaking prompt", body: topic.speakingPrompt.prompt.slice(0, 60) + '…' },
              { tab: "Interview", icon: MessageSquare, label: "Interview question", body: topic.interviewQuestion.question.slice(0, 60) + '…' },
            ].map((r) => (
              <button
                key={r.tab}
                onClick={() => setTab(r.tab)}
                className="panel p-3 text-left hover:border-primary/40 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary font-semibold">
                  <r.icon className="w-3 h-3" /> {r.tab}
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.body}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
