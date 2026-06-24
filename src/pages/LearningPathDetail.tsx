import { useParams, Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { TopicCard } from "@/components/common/TopicCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getLearningPaths } from "@/data/mockLearningPaths";
import { getMockTopics } from "@/data/mockTopics";
import { ArrowLeft, CheckCircle2, Lock, Play, BookOpen, Sparkles, Mic, MessageSquare } from "lucide-react";

const modeChips = [
  { labelKey: "tech.read", icon: BookOpen },
  { labelKey: "tech.vocabulary", icon: Sparkles },
  { labelKey: "tech.speak", icon: Mic },
  { labelKey: "tech.interview", icon: MessageSquare },
];

// Map module names to topic slugs (fallback)
function moduleToSlug(name: string): string | undefined {
  const map: Record<string, string> = {
    'RESTful API': 'restful-api',
    'Database': 'database',
    'Redis Cache': 'redis-cache',
    'RabbitMQ': 'rabbitmq',
    'Self-introduction': undefined,
    'Project story (STAR)': undefined,
    'System design Q&A': undefined,
    'Behavioral deep dive': undefined,
    'Daily standup': undefined,
    'Code review comments': undefined,
    'Async writing (Slack/email)': undefined,
    'Disagree politely': undefined,
  };
  return map[name];
}

export default function LearningPathDetail() {
  const { pathSlug } = useParams<{ pathSlug: string }>();
  const { t } = useI18n();

  const path = getLearningPaths().find((p) => p.slug === pathSlug);

  if (!path) {
    return (
      <div>
        <PageHeader title={t('learning.center')} />
        <EmptyState
          title={t('learning.pathNotFound')}
          description={t('learning.pathNotFoundDesc')}
          action={<Link to="/learning"><Button>{t('common.back')}</Button></Link>}
        />
      </div>
    );
  }

  const topics = getMockTopics().filter((tp) => path.topicSlugs.includes(tp.slug));
  const inProgressModule = path.modules.find((m) => m.status === 'in_progress');

  // Find topic slug for in-progress module
  const nextTopicSlug = inProgressModule ? moduleToSlug(inProgressModule.name) || path.topicSlugs[0] : path.topicSlugs[0];

  return (
    <div>
      <div className="mb-4">
        <Link to="/learning" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-3.5 h-3.5" /> {t('learning.backToLearning')}
        </Link>
      </div>

      <PageHeader title={path.nameZh || path.name} subtitle={path.descZh || path.desc} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Progress + milestone */}
          <Panel title={t('learning.milestone')}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-foreground leading-relaxed">{path.milestoneZh || path.milestone}</p>
                <p className="text-xs text-muted-foreground mt-1">{path.milestone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={path.modules.filter((m) => m.status === 'completed').length / path.modules.length * 100} className="flex-1" />
                <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                  {path.modules.filter((m) => m.status === 'completed').length}/{path.modules.length}
                </span>
              </div>
            </div>
          </Panel>

          {/* Modules */}
          <Panel title={t('learning.modules')}>
            <ul className="divide-y divide-border -my-2">
              {path.modules.map((mod) => {
                const slug = moduleToSlug(mod.name);
                const isLocked = mod.status === 'locked';
                const isCompleted = mod.status === 'completed';
                const isInProgress = mod.status === 'in_progress';
                const isNext = mod.status === 'next';

                return (
                  <li key={mod.name} className="flex items-center justify-between py-3 gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{mod.nameZh || mod.name}</span>
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                        {isLocked && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold mt-0.5 block
                        ${isCompleted ? 'text-success' : isLocked ? 'text-muted-foreground' : 'text-primary'}">
                        {isCompleted ? t('common.completed') :
                         isInProgress ? t('common.inProgress') :
                         isNext ? t('learning.startModule') :
                         t('learning.lockedModule')}
                      </span>
                    </div>
                    <div>
                      {isCompleted && slug && (
                        <Link to={`/technical-english/${slug}`}>
                          <Button variant="ghost" size="sm">{t('common.open')}</Button>
                        </Link>
                      )}
                      {isInProgress && slug && (
                        <Link to={`/technical-english/${slug}`}>
                          <Button size="sm"><Play className="w-3 h-3" /> {t('learning.continueModule')}</Button>
                        </Link>
                      )}
                      {isInProgress && !slug && (
                        <Button size="sm" onClick={() => toast.info(t('common.comingSoon'))}><Play className="w-3 h-3" /> {t('learning.continueModule')}</Button>
                      )}
                      {isNext && slug && (
                        <Link to={`/technical-english/${slug}`}>
                          <Button variant="outline" size="sm">{t('learning.startModule')}</Button>
                        </Link>
                      )}
                      {isNext && !slug && (
                        <Button variant="outline" size="sm" onClick={() => toast.info(t('common.comingSoon'))}>{t('learning.startModule')}</Button>
                      )}
                      {isLocked && (
                        <Button variant="outline" size="sm" disabled>{t('learning.lockedModule')}</Button>
                      )}
                      {isCompleted && !slug && (
                        <Button variant="ghost" size="sm" disabled><CheckCircle2 className="w-3 h-3" /></Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Recommended topics */}
          <h2 className="text-sm font-semibold text-foreground">{t('learning.recommendedTopics')}</h2>
          {topics.length > 0 ? (
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
          ) : (
            <div className="panel p-8 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">{t('learning.noRecommendedTopics')}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{t('learning.noRecommendedTopicsDesc')}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t('common.continue')}>
            <p className="text-xs text-muted-foreground">{t('learning.nextMilestone')}</p>
            <p className="text-sm font-medium mt-1">{path.milestoneZh || path.milestone}</p>
            {nextTopicSlug ? (
              <Link to={`/technical-english/${nextTopicSlug}`} className="mt-3 block">
                <Button className="w-full"><Play className="w-3.5 h-3.5" /> {t('learning.continueModule')}</Button>
              </Link>
            ) : (
              <Button className="w-full mt-3" onClick={() => toast.info(t('common.comingSoon'))}><Play className="w-3.5 h-3.5" /> {t('common.continue')}</Button>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
