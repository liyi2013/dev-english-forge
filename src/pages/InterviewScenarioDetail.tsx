import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getInterviewScenarioBySlug } from "@/data/mockInterviewScenarios";
import { getMockTopics } from "@/data/mockTopics";
import { TopicCard } from "@/components/common/TopicCard";
import {
  ArrowLeft, Clock, Target, BookOpen, Mic, CheckCircle2, AlertCircle, Sparkles,
  MessageSquare, ChevronRight
} from "lucide-react";

function ScenarioQuestions({ questions }: { questions: ReturnType<typeof getInterviewScenarioBySlug>['questions'] }) {
  const { t } = useI18n();
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showIdeal, setShowIdeal] = useState<Record<string, boolean>>({});

  if (!questions || questions.length === 0) return null;

  return (
    <div className="space-y-4">
      {questions.map((q) => {
        const isOpen = openQuestionId === q.id;
        return (
          <div key={q.id} className="panel">
            <button
              onClick={() => setOpenQuestionId(isOpen ? null : q.id)}
              className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-accent/30 transition rounded-t-md"
              aria-label={q.question}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="chip">{t('interview.question')}</span>
                </div>
                <p className="text-sm font-medium mt-1.5">{q.question}</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 mt-1 transition ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            {isOpen && (
              <div className="border-t border-border p-4 space-y-4">
                <p className="text-xs text-muted-foreground">{q.questionZh}</p>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">{t('report.yourAnswer')}</label>
                  <textarea
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    rows={3}
                    placeholder="Type your answer in English…"
                    className="w-full mt-1.5 text-sm bg-card border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => setShowIdeal((prev) => ({ ...prev, [q.id]: true }))}>
                      {t('topic.evaluate')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnswers((prev) => ({ ...prev, [q.id]: '' }));
                        setShowIdeal((prev) => ({ ...prev, [q.id]: false }));
                      }}
                    >
                      {t('common.clear')}
                    </Button>
                  </div>
                </div>

                {showIdeal[q.id] && (
                  <div className="space-y-3">
                    <Panel title={t('topic.idealAnswer')} className="border-primary/20 bg-accent/30" padded={false}>
                      <div className="p-4">
                        <p className="text-sm text-foreground leading-relaxed">{q.idealAnswer}</p>
                      </div>
                    </Panel>

                    <div className="flex flex-wrap gap-2">
                      {q.keyPoints.map((kp) => (
                        <span key={kp} className="chip-green"><CheckCircle2 className="w-3 h-3" /> {kp}</span>
                      ))}
                    </div>

                    {q.commonMistakes.length > 0 && (
                      <div className="panel p-4">
                        <p className="text-xs font-semibold mb-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-warning" /> {t('topic.commonMistakes')}
                        </p>
                        <ul className="space-y-1">
                          {q.commonMistakes.map((cm) => (
                            <li key={cm} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-warning mt-0.5">•</span> {cm}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function InterviewScenarioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const scenario = slug ? getInterviewScenarioBySlug(slug) : undefined;

  const topics = useMemo(() => {
    if (!scenario) return [];
    return getMockTopics().filter((tp) => scenario.relatedTopics.includes(tp.slug));
  }, [scenario]);

  if (!scenario) {
    return (
      <div>
        <div className="mb-4">
          <Link to="/interview-english" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('interview.backToScenarios')}
          </Link>
        </div>
        <EmptyState
          title={t('interview.scenarioNotFound')}
          description={t('interview.scenarioNotFoundDesc')}
          action={<Link to="/interview-english"><Button>{t('common.back')}</Button></Link>}
        />
      </div>
    );
  }

  const scenarioTitle = locale === 'zh-CN' ? scenario.titleZh : scenario.title;
  const scenarioDesc = locale === 'zh-CN' ? scenario.descriptionZh : scenario.description;
  const scenarioObjective = locale === 'zh-CN' ? scenario.objectiveZh : scenario.objective;

  return (
    <div>
      <div className="mb-4">
        <Link to="/interview-english" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-3.5 h-3.5" /> {t('interview.backToScenarios')}
        </Link>
      </div>

      <PageHeader title={scenarioTitle} subtitle={scenarioDesc} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Objective */}
          <Panel title={t('interview.scenarioObjective')}>
            <div className="flex items-start gap-3">
              <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-foreground leading-relaxed">{scenarioObjective}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="chip">{scenario.level}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {scenario.estimatedTime}
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          {/* Structure Tips */}
          <Panel title={t('interview.structureTips')}>
            <ul className="space-y-3">
              {(locale === 'zh-CN' ? scenario.structureTipsZh : scenario.structureTips).map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Useful Phrases */}
          <Panel title={t('interview.usefulPhrases')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenario.usefulPhrases.map((p, i) => (
                <div key={i} className="panel p-3 bg-accent/30 border-border">
                  <p className="text-sm text-foreground">{p.en}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.zh}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Practice Questions */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t('interview.practiceQuestions')}</h2>
            <ScenarioQuestions questions={scenario.questions} />
          </div>

          {/* Sample Answer */}
          <Panel title={t('interview.sampleAnswer')} className="border-primary/20 bg-accent/30">
            <p className="text-sm text-foreground leading-relaxed">{scenario.sampleAnswer}</p>
          </Panel>

          {/* Related Topics */}
          {topics.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">{t('interview.relatedTopics')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topics.map((topic) => (
                  <TopicCard
                    key={topic.slug}
                    title={topic.title}
                    titleZh={topic.titleZh}
                    explainGoal={topic.explainGoal}
                    explainGoalZh={topic.explainGoalZh}
                    level={topic.level}
                    progress={topic.progress}
                    slug={topic.slug}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t('interview.scenarioProgress')}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-medium">{t('interview.progress')}</span>
              </div>
              <Progress value={scenario.progress} />
              <p className="text-xs text-muted-foreground font-mono">{scenario.progress}% {t('common.completed')}</p>
            </div>
          </Panel>

          <Panel title={t('interview.actions')}>
            <div className="space-y-3">
              <Link to="/ai-interview" className="block">
                <Button className="w-full"><Mic className="w-3.5 h-3.5" /> {t('interview.startMock')}</Button>
              </Link>
              <Link to="/review" className="block">
                <Button variant="outline" className="w-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('common.start')}
                </Button>
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
