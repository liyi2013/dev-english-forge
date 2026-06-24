import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { getQuestionBankBySlug } from "@/data/mockInterviewQuestionBanks";
import { ChevronLeft, ChevronDown, ChevronRight, Mic, BookOpen, AlertTriangle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InterviewQuestionBankDetail() {
  const { bankSlug } = useParams<{ bankSlug: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const bank = bankSlug ? getQuestionBankBySlug(bankSlug) : undefined;
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  if (!bank) {
    return (
      <div>
        <PageHeader
          title={t("interview.bankNotFound")}
          subtitle={t("interview.bankNotFoundDesc")}
          actions={
            <Link to="/interview-english">
              <Button variant="outline">
                <ChevronLeft className="w-3.5 h-3.5" /> {t("interview.backToScenarios")}
              </Button>
            </Link>
          }
        />
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title={t("interview.bankNotFound")}
          description={t("interview.bankNotFoundDesc")}
          action={
            <Link to="/interview-english">
              <Button variant="outline">{t("interview.backToScenarios")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStartPractice = (questionId: string) => {
    navigate(`/ai-interview?bank=${bankSlug}&question=${questionId}`);
  };

  const difficultyLabel = (d: string) => {
    const map: Record<string, string> = {
      easy: t("interview.difficultyEasy"),
      medium: t("interview.difficultyMedium"),
      hard: t("interview.difficultyHard"),
    };
    return map[d] || d;
  };

  const difficultyColor = (d: string) => {
    if (d === "easy") return "text-success";
    if (d === "hard") return "text-destructive";
    return "text-warning";
  };

  return (
    <div>
      <PageHeader
        title={bank.title}
        subtitle={bank.description}
        actions={
          <Link to="/interview-english">
            <Button variant="outline">
              <ChevronLeft className="w-3.5 h-3.5" /> {t("interview.backToScenarios")}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Bank overview */}
          <Panel title={t("interview.bankOverview")}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{t("interview.level")}</div>
                <div className="mt-1 text-lg font-semibold">{bank.level}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{t("interview.questions")}</div>
                <div className="mt-1 text-lg font-semibold">{bank.questions.length}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{t("interview.estimatedTime")}</div>
                <div className="mt-1 text-lg font-semibold">{bank.estimatedTime}</div>
              </div>
            </div>
          </Panel>

          {/* Question list */}
          <div>
            <h2 className="text-sm font-semibold mb-3">{t("interview.questionList")}</h2>
            <div className="space-y-3">
              {bank.questions.map((q) => {
                const isExpanded = expandedQuestions.has(q.id);
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "panel border transition",
                      isExpanded ? "border-primary/30" : "border-border"
                    )}
                  >
                    {/* Question header — always visible */}
                    <button
                      onClick={() => toggleQuestion(q.id)}
                      className="w-full flex items-start justify-between gap-3 p-4 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-xs font-mono font-semibold", difficultyColor(q.difficulty))}>
                            {difficultyLabel(q.difficulty)}
                          </span>
                          <span className="chip-blue text-[10px]">{q.type === "system-design" ? "System Design" : q.type.charAt(0).toUpperCase() + q.type.slice(1)}</span>
                        </div>
                        <p className="text-sm font-medium break-words">{q.question}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 break-words">{q.questionZh}</p>
                      </div>
                      <div className="shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-border space-y-4 pt-4">
                        {/* Answer structure */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-primary" />
                            {t("interview.answerStructure")}
                          </div>
                          <p className="text-sm text-muted-foreground break-words">{q.answerStructure}</p>
                          <p className="text-xs text-muted-foreground/70 mt-0.5 break-words">{q.answerStructureZh}</p>
                        </div>

                        {/* Ideal answer */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                            <Mic className="w-3.5 h-3.5 text-primary" />
                            {t("interview.idealAnswer")}
                          </div>
                          <p className="text-sm text-muted-foreground break-words leading-relaxed">{q.idealAnswer}</p>
                        </div>

                        {/* Key points */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                            {t("interview.keyPoints")}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {q.keyPoints.map((kp) => (
                              <span key={kp} className="chip">{kp}</span>
                            ))}
                          </div>
                        </div>

                        {/* Common mistakes */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                            {t("interview.commonMistakes")}
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {q.commonMistakes.map((m) => (
                              <li key={m} className="flex items-start gap-2">
                                <span className="text-warning mt-0.5">•</span>
                                <span className="break-words">{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Related topics */}
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                            {t("interview.relatedTopics")}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {q.relatedTopics.map((rt) => (
                              <span key={rt} className="chip">{rt}</span>
                            ))}
                          </div>
                        </div>

                        {/* Start practice button */}
                        <div className="pt-2">
                          <Button onClick={() => handleStartPractice(q.id)}>
                            <Mic className="w-3.5 h-3.5" /> {t("interview.startPractice")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t("interview.practiceTips")}>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold shrink-0">1.</span>
                <span className="text-muted-foreground">{t("interview.tipReadFirst")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold shrink-0">2.</span>
                <span className="text-muted-foreground">{t("interview.tipUnderstandStructure")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold shrink-0">3.</span>
                <span className="text-muted-foreground">{t("interview.tipPracticeAnswer")}</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
