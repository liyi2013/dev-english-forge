import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { getStarExamples, type StarExample } from "@/data/mockStarExamples";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronDown, ChevronRight, Lightbulb, MessageSquareCode, CheckCircle2, Target, BookOpen } from "lucide-react";

const categoryLabels: Record<string, { en: string; zh: string }> = {
  'project-experience': { en: 'Project Experience', zh: '项目经验' },
  'conflict-resolution': { en: 'Conflict Resolution', zh: '冲突解决' },
  'leadership': { en: 'Leadership', zh: '领导力' },
  'failure': { en: 'Failure & Learning', zh: '失败与学习' },
  'achievement': { en: 'Achievement', zh: '成就' },
};

export default function StarExamples() {
  const { t, locale } = useI18n();
  const examples = getStarExamples();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = Object.keys(categoryLabels);
  const filtered = selectedCategory
    ? examples.filter((e) => e.category === selectedCategory)
    : examples;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <PageHeader
        title={t('starExamples.title')}
        subtitle={t('starExamples.desc')}
        actions={
          <Link to="/interview-english">
            <Button variant="outline">
              <ChevronLeft className="w-3.5 h-3.5" /> {t('starExamples.backToInterview')}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            <span
              className={cn("chip cursor-pointer hover:bg-accent hover:text-accent-foreground transition", !selectedCategory && "bg-primary/10 text-primary border-primary/20")}
              onClick={() => setSelectedCategory(null)}
            >
              {t('common.all')}
            </span>
            {categories.map((cat) => {
              const label = locale === 'zh-CN' ? categoryLabels[cat].zh : categoryLabels[cat].en;
              return (
                <span
                  key={cat}
                  className={cn("chip cursor-pointer hover:bg-accent hover:text-accent-foreground transition", selectedCategory === cat && "bg-primary/10 text-primary border-primary/20")}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {label}
                </span>
              );
            })}
          </div>

          {/* Example list */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={<MessageSquareCode className="w-8 h-8" />}
              title={t('starExamples.noExamples')}
              description={t('starExamples.noExamplesDesc')}
              action={
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  {t('common.viewAll')}
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((example) => {
                const isExpanded = expandedId === example.id;
                return (
                  <div
                    key={example.id}
                    className={cn(
                      "panel border transition",
                      isExpanded ? "border-primary/30" : "border-border"
                    )}
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleExpand(example.id)}
                      className="w-full flex items-start justify-between gap-3 p-4 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {example.tags.map((tag) => (
                            <span key={tag} className="chip-blue text-[10px]">{tag}</span>
                          ))}
                        </div>
                        <p className="text-sm font-medium break-words">
                          {locale === 'zh-CN' ? example.titleZh : example.title}
                        </p>
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
                        {/* STAR sections */}
                        <StarSection
                          label="S"
                          title={locale === 'zh-CN' ? '情境' : 'Situation'}
                          desc={t('starExamples.situationDesc')}
                          content={locale === 'zh-CN' ? example.situationZh : example.situation}
                        />
                        <StarSection
                          label="T"
                          title={locale === 'zh-CN' ? '任务' : 'Task'}
                          desc={t('starExamples.taskDesc')}
                          content={locale === 'zh-CN' ? example.taskZh : example.task}
                        />
                        <StarSection
                          label="A"
                          title={locale === 'zh-CN' ? '行动' : 'Action'}
                          desc={t('starExamples.actionDesc')}
                          content={locale === 'zh-CN' ? example.actionZh : example.action}
                        />
                        <StarSection
                          label="R"
                          title={locale === 'zh-CN' ? '结果' : 'Result'}
                          desc={t('starExamples.resultDesc')}
                          content={locale === 'zh-CN' ? example.resultZh : example.result}
                        />

                        {/* Key takeaway */}
                        <div className="bg-accent/50 rounded-md p-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
                            <Lightbulb className="w-3.5 h-3.5 text-primary" />
                            {locale === 'zh-CN' ? '关键启示' : 'Key Takeaway'}
                          </div>
                          <p className="text-sm text-muted-foreground break-words leading-relaxed">
                            {locale === 'zh-CN' ? example.keyTakeawayZh : example.keyTakeaway}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title="STAR" description={t('starExamples.title')}>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-mono text-primary font-semibold shrink-0 w-5">S</span>
                <span className="text-muted-foreground">{t('starExamples.situationDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-primary font-semibold shrink-0 w-5">T</span>
                <span className="text-muted-foreground">{t('starExamples.taskDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-primary font-semibold shrink-0 w-5">A</span>
                <span className="text-muted-foreground">{t('starExamples.actionDesc')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-primary font-semibold shrink-0 w-5">R</span>
                <span className="text-muted-foreground">{t('starExamples.resultDesc')}</span>
              </li>
            </ul>
          </Panel>

          <Panel title={locale === 'zh-CN' ? '练习建议' : 'Practice Tips'}>
            <ul className="text-sm space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{locale === 'zh-CN' ? '每个 STAR 环节用 2-3 句话' : 'Keep each STAR element to 2-3 sentences'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{locale === 'zh-CN' ? '结果要有可衡量的数据' : 'Use measurable data in your result'}</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{locale === 'zh-CN' ? '准备 5-6 个不同场景的故事' : 'Prepare 5-6 stories for different scenarios'}</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function StarSection({
  label,
  title,
  desc,
  content,
}: {
  label: string;
  title: string;
  desc: string;
  content: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-6 h-6 rounded bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center">{label}</span>
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className="text-[10px] text-muted-foreground hidden sm:inline">— {desc}</span>
      </div>
      <p className="text-sm text-muted-foreground break-words leading-relaxed">{content}</p>
    </div>
  );
}
