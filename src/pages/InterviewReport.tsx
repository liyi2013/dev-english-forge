import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { ScoreBreakdown } from "@/components/common/ScoreBreakdown";
import { AnswerGapPanel } from "@/components/common/AnswerGapPanel";
import { RecommendedLearningCard } from "@/components/common/RecommendedLearningCard";
import { useI18n } from "@/i18n";
import { addToReviewQueue, addReport, getCompletedReports, getReviewQueue } from "@/lib/mockStorage";
import { getLatestReport } from "@/data/mockReports";
import { toast } from "sonner";
import {
  CheckCircle2, AlertCircle, ArrowRight, Download, RotateCcw, Sparkles,
  User, Bot, Wand2, ListChecks,
} from "lucide-react";

export default function InterviewReport() {
  const { t } = useI18n();
  const report = getLatestReport();
  const [added, setAdded] = useState(false);

  const handleAddToReview = () => {
    if (added) {
      toast.info(t('report.alreadyAddedToReview'));
      return;
    }

    // Check if already exists
    const existingReports = getCompletedReports();
    const existingQueue = getReviewQueue();
    const reportExists = existingReports.some((r) => r.id === report.id);
    const weakPointsExist = report.weakPoints.every((wp) =>
      existingQueue.some((q) => q.title === wp)
    );

    if (reportExists && weakPointsExist) {
      setAdded(true);
      toast.info(t('report.alreadyAddedToReview'));
      return;
    }

    // Add weak points to review queue
    report.weakPoints.forEach((wp) => {
      addToReviewQueue({
        id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'wrong_answer',
        title: wp,
        source: `Interview · ${report.config.role}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    });

    // Add report
    addReport({
      id: report.id,
      date: report.date,
      overallScore: report.overallScore,
    });

    setAdded(true);
    toast.success(t('report.addedToReviewQueue'));
  };

  const scoreItems = [
    { name: 'English Expression', value: report.scores.englishExpression },
    { name: 'Technical Accuracy', value: report.scores.technicalAccuracy },
    { name: 'Answer Structure', value: report.scores.answerStructure },
    { name: 'Confidence', value: report.scores.confidence },
  ];

  return (
    <div>
      <PageHeader
        title={t('report.title')}
        subtitle={`${report.config.role} · ${report.config.difficulty} · ${report.config.questionCount} questions · ${report.config.duration}`}
        actions={
          <>
            <Button variant="outline"><Download className="w-3.5 h-3.5" /> {t('report.exportPdf')}</Button>
            <Link to="/ai-interview"><Button variant="outline"><RotateCcw className="w-3.5 h-3.5" /> {t('report.newSession')}</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Overall */}
        <div className="col-span-12 lg:col-span-4">
          <Panel padded={false}>
            <div className="p-6 text-center">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{t('report.overallScore')}</div>
              <div className="relative inline-flex items-center justify-center mt-3">
                <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                  <circle cx="70" cy="70" r="60" stroke="hsl(var(--secondary))" strokeWidth="10" fill="none" />
                  <circle
                    cx="70" cy="70" r="60"
                    stroke="hsl(var(--primary))" strokeWidth="10" fill="none"
                    strokeDasharray={`${(report.overallScore / 100) * 377} 377`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-semibold tracking-tight">{report.overallScore}</span>
                  <span className="text-[11px] text-muted-foreground">/ 100</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {report.overallScore >= 80 ? 'Great — interview-ready!' :
                 report.overallScore >= 70 ? 'Solid — close to interview-ready.' :
                 'Keep practicing — you are making progress.'}
              </p>
            </div>
            <div className="border-t border-border p-5">
              <ScoreBreakdown scores={scoreItems} />
            </div>
          </Panel>
        </div>

        {/* Right column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel title={t('report.strongPoints')}>
              <ul className="space-y-2.5">
                {report.strongPoints.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title={t('report.weakPoints')}>
              <ul className="space-y-2.5">
                {report.weakPoints.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* Answer deep-dive for first question */}
          {report.questionDetails.length > 0 && (
            <Panel
              title={`${t('report.answerDeepDive')}`}
              description={`"${report.questionDetails[0].question}"`}
            >
              <div className="space-y-4">
                <div className="panel p-4 bg-background border-dashed">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{t('report.yourAnswer')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">{report.questionDetails[0].userAnswer}</p>
                </div>

                <div className="panel p-4 bg-accent/30 border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">{t('report.idealAnswer')}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{report.questionDetails[0].idealAnswer}</p>
                </div>

                <AnswerGapPanel
                  gapAnalysis={report.questionDetails[0].gapAnalysis}
                  missingKeyPoints={report.questionDetails[0].missingKeyPoints}
                />

                <div className="panel p-4 bg-accent border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">{t('report.betterVersion')}</span>
                    <span className="chip-blue">Rewritten from your words</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{report.questionDetails[0].betterAnswerVersion}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm"><Sparkles className="w-3.5 h-3.5" /> {t('report.practiceThisVersion')}</Button>
                    <Button variant="outline" size="sm">{t('report.saveToSentences')}</Button>
                  </div>
                </div>
              </div>
            </Panel>
          )}

          <Panel title={t('report.recommendedLearning')} description={t('report.recommendedDesc')}>
            <div className="mb-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-primary bg-accent border border-primary/15 px-2 py-1 rounded">
              {t('report.recommendedDesc')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {report.recommendedLearning.map((r) => (
                <RecommendedLearningCard key={r.title} item={r} />
              ))}
            </div>
          </Panel>

          <div className="panel p-5 bg-accent border-primary/20 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold">{t('report.closeLoop')}</h4>
              <p className="text-xs text-muted-foreground mt-1">{t('report.closeLoopDesc')}</p>
            </div>
            <Button onClick={handleAddToReview} disabled={added}>
              {added ? t('report.alreadyAddedToReview') : t('report.addToReview')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
