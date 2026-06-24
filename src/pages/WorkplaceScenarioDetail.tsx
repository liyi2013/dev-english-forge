import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getWorkplaceScenarioBySlug } from "@/data/mockWorkplaceScenarios";
import { saveSentence, isSentenceSaved, removeSentence } from "@/lib/mockStorage";
import { getMockTopics } from "@/data/mockTopics";
import { ArrowLeft, Clock, Target, BookOpen, CheckCircle2, AlertCircle, Save, MessageSquare, ChevronRight, Sparkles } from "lucide-react";

function MiniDrillSection({ drills, t }: { drills: import('@/types/workplaceScenario').WorkplaceMiniDrill[]; t: (key: string) => string }) {
  const [activeDrill, setActiveDrill] = useState<string | null>(null);
  const [drillAnswer, setDrillAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [mockScore] = useState(() => Math.floor(Math.random() * 30) + 60);

  const drill = drills.find((d) => d.id === activeDrill);

  const handleGetFeedback = () => {
    if (!drill) return;
    if (drillAnswer.trim().length < 15) {
      toast.info(t('workplaceScenario.tooShort'));
      return;
    }
    setShowFeedback(true);
    toast.success(t('workplaceScenario.mockFeedback'));
  };

  const handleClear = () => {
    setDrillAnswer('');
    setShowFeedback(false);
  };

  const handleSaveAnswer = () => {
    if (!drillAnswer.trim()) return;
    saveSentence({ pattern: drillAnswer, savedAt: new Date().toISOString() });
    toast.success(t('workplaceScenario.answerSaved'));
  };

  const hasPolitePhrases = drillAnswer.match(/could|please|just to|suggest|if that works/i);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {drills.map((d) => (
          <button
            key={d.id}
            onClick={() => { setActiveDrill(d.id); setDrillAnswer(''); setShowFeedback(false); }}
            className={`panel p-4 text-left hover:border-primary/40 transition ${activeDrill === d.id ? 'border-primary/40 bg-accent/30' : ''}`}
          >
            <p className="text-sm text-foreground">{d.prompt}</p>
            <p className="text-xs text-muted-foreground mt-1">{d.promptZh}</p>
          </button>
        ))}
      </div>

      {drill && (
        <div className="panel p-4 space-y-3">
          <p className="text-xs text-muted-foreground">{drill.promptZh}</p>
          <textarea
            value={drillAnswer}
            onChange={(e) => { setDrillAnswer(e.target.value); setShowFeedback(false); }}
            rows={4}
            placeholder={t('workplaceScenario.typeAnswer')}
            className="w-full text-sm bg-card border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleGetFeedback}>
              <MessageSquare className="w-3 h-3" /> {t('workplaceScenario.getFeedback')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              {t('workplaceScenario.clearAnswer')}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSaveAnswer} disabled={!drillAnswer.trim()}>
              <Save className="w-3 h-3" /> {t('workplaceScenario.saveAnswer')}
            </Button>
          </div>

          {showFeedback && (
            <div className="panel p-4 bg-accent/40 border-primary/10 space-y-3">
              <p className="text-xs font-semibold text-primary">{t('workplaceScenario.mockFeedback')}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('workplaceScenario.score')}:</span>
                <span className="text-lg font-bold">{mockScore}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">{t('workplaceScenario.strengths')}</p>
                <ul className="text-xs text-muted-foreground space-y-0.5 list-disc pl-4">
                  <li>{hasPolitePhrases ? t('workplaceScenario.goodTone') : 'Your answer is relevant to the prompt.'}</li>
                  {drillAnswer.length > 50 && <li>{t('workplaceScenario.needsMoreDetail')}</li>}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">{t('workplaceScenario.suggestions')}</p>
                <ul className="text-xs text-muted-foreground space-y-0.5 list-disc pl-4">
                  {!hasPolitePhrases && <li>{t('workplaceScenario.goodTone')}</li>}
                  <li>{t('workplaceScenario.needsMoreDetail')}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WorkplaceScenarioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const scenario = slug ? getWorkplaceScenarioBySlug(slug) : undefined;

  const [sentenceSaves, setSentenceSaves] = useState<Record<string, boolean>>(() => {
    if (!scenario) return {};
    const saves: Record<string, boolean> = {};
    scenario.sentencePatterns.forEach((sp) => {
      saves[sp.pattern] = isSentenceSaved(sp.pattern);
    });
    return saves;
  });

  const [phraseSaves, setPhraseSaves] = useState<Record<string, boolean>>({});
  const [toneChecked, setToneChecked] = useState<Set<number>>(new Set());

  const topics = useMemo(() => {
    if (!scenario) return [];
    return getMockTopics().filter((tp) => scenario.relatedTopics.includes(tp.slug));
  }, [scenario]);

  const handleSentenceSave = useCallback((pattern: string) => {
    if (sentenceSaves[pattern]) {
      removeSentence(pattern);
      setSentenceSaves((prev) => ({ ...prev, [pattern]: false }));
      toast.info(t('common.saved'));
    } else {
      saveSentence({ pattern, savedAt: new Date().toISOString() });
      setSentenceSaves((prev) => ({ ...prev, [pattern]: true }));
      toast.success(t('common.saved'));
    }
  }, [sentenceSaves, t]);

  const handlePhraseSave = useCallback((en: string) => {
    if (phraseSaves[en]) {
      setPhraseSaves((prev) => ({ ...prev, [en]: false }));
      toast.info(t('common.saved'));
    } else {
      saveSentence({ pattern: en, savedAt: new Date().toISOString() });
      setPhraseSaves((prev) => ({ ...prev, [en]: true }));
      toast.success(t('common.saved'));
    }
  }, [phraseSaves, t]);

  const handleToneTipClick = useCallback((idx: number) => {
    const next = new Set(toneChecked);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setToneChecked(next);
    if (next.has(idx)) toast.success(t('workplaceScenario.tipChecked'));
  }, [toneChecked, t]);

  if (!scenario) {
    return (
      <div>
        <div className="mb-4">
          <Link to="/workplace-english" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('workplaceScenario.backToWorkplace')}
          </Link>
        </div>
        <EmptyState
          title={t('workplaceScenario.scenarioNotFound')}
          description={t('workplaceScenario.scenarioNotFoundDesc')}
          action={<Link to="/workplace-english"><Button>{t('common.back')}</Button></Link>}
        />
      </div>
    );
  }

  const scenarioTitle = locale === 'zh-CN' ? scenario.titleZh : scenario.title;
  const scenarioDesc = locale === 'zh-CN' ? scenario.descriptionZh : scenario.description;
  const scenarioContext = locale === 'zh-CN' ? scenario.contextZh : scenario.context;
  const scenarioObjective = locale === 'zh-CN' ? scenario.objectiveZh : scenario.objective;

  return (
    <div>
      <div className="mb-4">
        <Link to="/workplace-english" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-3.5 h-3.5" /> {t('workplaceScenario.backToWorkplace')}
        </Link>
      </div>

      <PageHeader
        title={scenarioTitle}
        subtitle={scenarioDesc}
        actions={
          <Link to="#mini-drills" onClick={(e) => {
            e.preventDefault();
            document.getElementById('mini-drills')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Button><BookOpen className="w-3.5 h-3.5" /> {t('workplaceScenario.continuePractice')}</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Objective + Overview */}
          <Panel title={t('workplaceScenario.objective')}>
            <div className="flex items-start gap-3">
              <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-foreground leading-relaxed">{scenarioObjective}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="chip">{scenario.level}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {scenario.estimatedTime}
                  </span>
                  <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                    <Progress value={scenario.progress} className="flex-1" />
                    <span className="text-[11px] font-mono text-muted-foreground">{scenario.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Context */}
          <Panel title={t('workplaceScenario.context')}>
            <p className="text-sm text-foreground leading-relaxed">{scenarioContext}</p>
          </Panel>

          {/* Sentence Patterns */}
          <Panel title={t('workplaceScenario.sentencePatterns')}>
            <ul className="divide-y divide-border -my-2">
              {scenario.sentencePatterns.map((sp) => {
                const isSaved = sentenceSaves[sp.pattern];
                return (
                  <li key={sp.pattern} className="flex items-start justify-between py-3 gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{sp.pattern}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{sp.meaningZh}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1 italic">{sp.example}</p>
                    </div>
                    <Button
                      variant={isSaved ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handleSentenceSave(sp.pattern)}
                      className="shrink-0"
                    >
                      <Save className="w-3 h-3" /> {isSaved ? t('common.saved') : t('common.save')}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Useful Phrases */}
          <Panel title={t('workplaceScenario.usefulPhrases')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenario.usefulPhrases.map((p) => {
                const isSaved = phraseSaves[p.en];
                return (
                  <div key={p.en} className={`panel p-3 border ${isSaved ? 'border-primary/30 bg-accent/20' : 'border-border bg-card'} transition`}>
                    <p className="text-sm font-medium text-foreground">{p.en}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.zh}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1 italic">{p.usage}</p>
                    <Button
                      variant={isSaved ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handlePhraseSave(p.en)}
                      className="mt-2"
                    >
                      <Save className="w-3 h-3" /> {isSaved ? t('common.saved') : t('workplaceScenario.saveAnswer')}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Mini Drills */}
          <div id="mini-drills">
            <Panel title={t('workplaceScenario.miniDrill')}>
              <MiniDrillSection drills={scenario.miniDrills} t={t} />
            </Panel>
          </div>

          {/* Tone Tips */}
          <Panel title={t('workplaceScenario.toneTips')}>
            <ul className="space-y-3">
              {scenario.toneTips.map((tip, i) => {
                const isChecked = toneChecked.has(i);
                return (
                  <li key={i}>
                    <button
                      onClick={() => handleToneTipClick(i)}
                      className={`w-full text-left panel p-3 flex items-start gap-3 transition ${isChecked ? 'border-primary/30 bg-accent/20' : ''}`}
                    >
                      <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center mt-0.5 ${isChecked ? 'bg-success border-success text-white' : 'border-border bg-card'}`}>
                        {isChecked && <CheckCircle2 className="w-3 h-3" strokeWidth={3} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {locale === 'zh-CN' ? tip.titleZh : tip.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {locale === 'zh-CN' ? tip.detailZh : tip.detail}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Common Mistakes */}
          <Panel title={t('workplaceScenario.commonMistakes')}>
            <ul className="space-y-1.5">
              {scenario.commonMistakes.map((cm) => (
                <li key={cm} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                  <span>{cm}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Related Topics */}
          {topics.length > 0 ? (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">{t('workplaceScenario.relatedTopics')}</h2>
              <div className="flex flex-wrap gap-2">
                {topics.map((tp) => (
                  <Link key={tp.slug} to={`/technical-english/${tp.slug}`}>
                    <Button variant="outline" size="sm"><BookOpen className="w-3 h-3" /> {tp.title}</Button>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="panel p-5 text-center">
              <BookOpen className="w-6 h-6 mx-auto text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground mt-2">{t('workplaceScenario.noRelatedTopics')}</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t('workplaceScenario.objective')}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm">{t('workplaceScenario.estimatedTime')}: {scenario.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm">{t('workplaceScenario.sentencePatterns')}: {scenario.sentencePatterns.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm">{t('workplaceScenario.usefulPhrases')}: {scenario.usefulPhrases.length}</span>
              </div>
              <Progress value={scenario.progress} />
              <p className="text-xs text-muted-foreground font-mono">{scenario.progress}% {t('common.completed')}</p>
            </div>
          </Panel>

          <Panel title={t('workplaceScenario.continuePractice')}>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => {
                document.getElementById('mini-drills')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <BookOpen className="w-3.5 h-3.5" /> {t('workplaceScenario.continuePractice')}
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
