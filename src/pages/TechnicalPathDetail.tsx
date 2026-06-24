import { useParams, Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { TopicCard } from "@/components/common/TopicCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { getTechnicalPathBySlug } from "@/data/mockTechnicalPaths";
import { getMockTopics } from "@/data/mockTopics";
import { ArrowLeft, BookOpen, Sparkles, Mic, MessageSquare } from "lucide-react";

const modeChips = [
  { labelKey: "tech.read", icon: BookOpen },
  { labelKey: "tech.vocabulary", icon: Sparkles },
  { labelKey: "tech.speak", icon: Mic },
  { labelKey: "tech.interview", icon: MessageSquare },
];

export default function TechnicalPathDetail() {
  const { pathSlug } = useParams<{ pathSlug: string }>();
  const { t } = useI18n();

  const path = getTechnicalPathBySlug(pathSlug ?? "");

  if (!path) {
    return (
      <div>
        <PageHeader title={t('tech.title')} />
        <EmptyState
          title={t('tech.pathNotFound')}
          description={t('tech.pathNotFoundDesc')}
          action={<Link to="/technical-english"><Button>{t('common.back')}</Button></Link>}
        />
      </div>
    );
  }

  const topics = getMockTopics().filter((tp) => path.topicSlugs.includes(tp.slug));

  return (
    <div>
      <div className="mb-4">
        <Link to="/technical-english" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-3.5 h-3.5" /> {t('tech.backToTech')}
        </Link>
      </div>

      <PageHeader title={path.name} subtitle={path.description} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)]">
        <div className="min-w-0 space-y-6">
          {/* Path overview */}
          <Panel title={path.nameZh} description={t('tech.learnToExplain')}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-foreground leading-relaxed">{path.outcome}</p>
                <p className="text-xs text-muted-foreground mt-1">{path.outcomeZh}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="chip">{path.level}</span>
                <span className="text-xs text-muted-foreground">{path.topicSlugs.length} {t('tech.topics')}</span>
                <div className="flex-1 flex items-center gap-2">
                  <Progress value={path.progress} className="flex-1" />
                  <span className="text-[11px] font-mono text-muted-foreground shrink-0">{path.progress}%</span>
                </div>
              </div>
            </div>
          </Panel>

          {/* Topic list */}
          <h2 className="text-sm font-semibold text-foreground">{t('learning.topics')}</h2>
          <div className="space-y-3">
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
                modeChips={
                  <div className="flex flex-wrap items-center gap-1">
                    {modeChips.map((m) => (
                      <span key={m.labelKey} className="chip"><m.icon className="w-3 h-3" /> {t(m.labelKey)}</span>
                    ))}
                  </div>
                }
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="min-w-0 space-y-4">
          <Panel title={t('tech.skills')}>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs"><span>{t('topic.fluency')}</span><span className="font-mono">65%</span></div>
                <Progress value={65} className="mt-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs"><span>{t('topic.tabVocabulary')}</span><span className="font-mono">58%</span></div>
                <Progress value={58} className="mt-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs"><span>{t('topic.clarity')}</span><span className="font-mono">42%</span></div>
                <Progress value={42} className="mt-1" />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
