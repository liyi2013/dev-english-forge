import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button, Stat } from "@/components/ui-bits";
import { TopicCard } from "@/components/common/TopicCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getMockTopics } from "@/data/mockTopics";
import { getCoreSkills, getProfile } from "@/data/mockProfile";
import {
  ArrowLeft, ArrowRight, BookOpen, Sparkles, Mic, MessageSquare, Check, Target,
  Calendar, TrendingUp, Clock, BarChart3, Zap
} from "lucide-react";

const modes = [
  { labelKey: "tech.read", icon: BookOpen },
  { labelKey: "tech.vocabulary", icon: Sparkles },
  { labelKey: "tech.speak", icon: Mic },
  { labelKey: "tech.interview", icon: MessageSquare },
];

interface WeekPlan {
  week: number;
  label: string;
  labelZh: string;
  goal: string;
  goalZh: string;
  topics: string[];
  status: "completed" | "current" | "upcoming" | "locked";
}

const sixWeekPlan: WeekPlan[] = [
  { week: 1, label: "RESTful API + Database", labelZh: "RESTful API + 数据库", goal: "Learn to describe endpoints, status codes, and database queries.", goalZh: "学会描述端点、状态码和数据库查询。", topics: ["restful-api", "database"], status: "completed" },
  { week: 2, label: "Redis Cache", labelZh: "Redis 缓存", goal: "Explain caching strategies and common problems in English.", goalZh: "用英语解释缓存策略和常见问题。", topics: ["redis-cache"], status: "completed" },
  { week: 3, label: "RabbitMQ", labelZh: "RabbitMQ 消息队列", goal: "Talk about message queues, exchanges, and routing keys.", goalZh: "讨论消息队列、交换器和路由键。", topics: ["rabbitmq"], status: "current" },
  { week: 4, label: "Docker", labelZh: "Docker 容器", goal: "Describe containerization, Dockerfiles, and multi-stage builds.", goalZh: "描述容器化、Dockerfile 和多阶段构建。", topics: ["docker"], status: "upcoming" },
  { week: 5, label: "CI/CD", labelZh: "CI/CD 流水线", goal: "Explain pipeline stages, automated testing, and deployment.", goalZh: "解释流水线阶段、自动化测试和部署。", topics: ["cicd"], status: "upcoming" },
  { week: 6, label: "Mock interview consolidation", labelZh: "模拟面试巩固", goal: "Consolidate all technical topics in a mock interview.", goalZh: "在模拟面试中巩固所有技术主题。", topics: ["restful-api", "redis-cache", "docker", "cicd"], status: "locked" },
];

interface Task {
  id: string;
  labelKey: string;
  topicSlug?: string;
}

const todayTasks: Task[] = [
  { id: "read", labelKey: "techPlan.readTask", topicSlug: "restful-api" },
  { id: "vocab", labelKey: "techPlan.vocabTask" },
  { id: "speak", labelKey: "techPlan.speakTask", topicSlug: "redis-cache" },
  { id: "interview", labelKey: "techPlan.interviewTask", topicSlug: "restful-api" },
];

export default function TechnicalPlan() {
  const { t, locale } = useI18n();
  const profile = getProfile();
  const skills = getCoreSkills();
  const topics = getMockTopics();

  const [doneTasks, setDoneTasks] = useState<Set<string>>(new Set());

  // Sort topics by progress ascending, take top 4
  const focusTopics = useMemo(
    () => [...topics].sort((a, b) => a.progress - b.progress).slice(0, 4),
    [topics]
  );

  // Find the lowest-progress topic for "continue" action
  const continueTopic = useMemo(
    () => [...topics].sort((a, b) => a.progress - b.progress)[0],
    [topics]
  );

  // Plan overview
  const overview = {
    currentLevel: profile.level,
    targetLevel: "B2",
    dailyMinutes: 20,
    estimatedWeeks: 6,
    progress: 68,
  };

  const handleTaskDone = (task: Task) => {
    if (doneTasks.has(task.id)) return;
    const newDone = new Set(doneTasks);
    newDone.add(task.id);
    setDoneTasks(newDone);
    toast.success(t("techPlan.completed"));
  };

  const handleWeekAction = (week: WeekPlan) => {
    if (week.status === "locked") {
      toast.info(t("techPlan.locked"));
      return;
    }
    const slug = week.topics[0];
    if (slug) {
      window.location.href = `/technical-english/${slug}`;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link to="/technical-english" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-3.5 h-3.5" /> {t('techPlan.backToTechnical')}
        </Link>
      </div>

      <PageHeader title={t('techPlan.title')} subtitle={t('techPlan.desc')} />

      {/* Plan overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="panel p-4">
          <Stat label={t('techPlan.currentLevel')} value={overview.currentLevel} />
        </div>
        <div className="panel p-4">
          <Stat label={t('techPlan.targetLevel')} value={overview.targetLevel} />
        </div>
        <div className="panel p-4">
          <Stat label={t('techPlan.dailyGoal')} value={<span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-muted-foreground" /> {overview.dailyMinutes} min</span>} />
        </div>
        <div className="panel p-4">
          <Stat label={t('techPlan.estimatedTime')} value={<span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-muted-foreground" /> {overview.estimatedWeeks} {locale === "zh-CN" ? "周" : "weeks"}</span>} />
        </div>
        <div className="panel p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{t('techPlan.totalProgress')}</div>
          <div className="mt-2">
            <Progress value={overview.progress} />
          </div>
          <div className="text-xs text-muted-foreground mt-1 font-mono">{overview.progress}%</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Today's tasks */}
          <Panel title={t('techPlan.todayTasks')}>
            <ul className="divide-y divide-border -my-2">
              {todayTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${doneTasks.has(task.id) ? "bg-success border-success text-white" : "border-border bg-card"}`}>
                      {doneTasks.has(task.id) && <Check className="w-3 h-3" strokeWidth={3} />}
                    </span>
                    <span className={`text-sm truncate ${doneTasks.has(task.id) ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {t(task.labelKey)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {task.topicSlug && !doneTasks.has(task.id) && (
                      <Link to={`/technical-english/${task.topicSlug}`}>
                        <Button variant="outline" size="sm">
                          {t('common.start')}
                        </Button>
                      </Link>
                    )}
                    <button
                      className={`text-xs shrink-0 ${doneTasks.has(task.id) ? "text-muted-foreground" : "text-primary hover:underline"}`}
                      onClick={() => handleTaskDone(task)}
                      disabled={doneTasks.has(task.id)}
                    >
                      {doneTasks.has(task.id) ? t('techPlan.completed') : t('techPlan.markDone')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          {/* 6-week plan */}
          <Panel title={t('techPlan.sixWeekPlan')}>
            <ul className="divide-y divide-border -my-2">
              {sixWeekPlan.map((week) => {
                const isCurrent = week.status === "current";
                const isCompleted = week.status === "completed";
                const isUpcoming = week.status === "upcoming";
                const isLocked = week.status === "locked";
                return (
                  <li key={week.week} className={`flex items-center justify-between py-3 gap-3 ${isLocked ? "opacity-50" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground shrink-0">
                          {locale === "zh-CN" ? `第 ${week.week} 周` : `Week ${week.week}`}
                        </span>
                        {isCompleted && <span className="chip text-[10px]">{t('techPlan.completed')}</span>}
                        {isCurrent && <span className="chip bg-primary/10 text-primary border-primary/20 text-[10px]">{t('techPlan.currentWeek')}</span>}
                      </div>
                      <p className="text-sm font-medium mt-0.5">{locale === "zh-CN" ? week.labelZh : week.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{locale === "zh-CN" ? week.goalZh : week.goal}</p>
                    </div>
                    <div className="shrink-0">
                      {isLocked ? (
                        <Button variant="outline" size="sm" disabled>
                          {t('techPlan.locked')}
                        </Button>
                      ) : (
                        <Link to={`/technical-english/${week.topics[0]}`}>
                          <Button size="sm" variant={isCurrent ? "primary" : "outline"}>
                            {isCompleted ? t('common.open') : t('common.continue')}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Focus topics */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t('techPlan.focusTopics')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {focusTopics.map((topic) => (
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
                      {modes.map((m) => (
                        <span key={m.labelKey} className="chip text-[10px] py-0.5">
                          <m.icon className="w-2.5 h-2.5" /> {t(m.labelKey)}
                        </span>
                      ))}
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Skill progress */}
          <Panel title={t('techPlan.skillProgress')}>
            <ul className="space-y-4">
              {skills.map((s) => (
                <li key={s.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground font-medium">{s.name}</span>
                    <span className="font-mono text-muted-foreground">{s.value}%</span>
                  </div>
                  <Progress value={s.value} />
                </li>
              ))}
            </ul>
          </Panel>

          {/* Next actions */}
          <Panel title={t('techPlan.nextActions')}>
            <div className="space-y-3">
              {continueTopic && (
                <Link to={`/technical-english/${continueTopic.slug}`} className="block">
                  <Button className="w-full">
                    <Zap className="w-3.5 h-3.5" /> {t('techPlan.continueTopic')}
                  </Button>
                </Link>
              )}
              <Link to="/ai-interview" className="block">
                <Button variant="outline" className="w-full">
                  <Mic className="w-3.5 h-3.5" /> {t('techPlan.startInterview')}
                </Button>
              </Link>
              <Link to="/learning" className="block">
                <Button variant="ghost" className="w-full">
                  <BarChart3 className="w-3.5 h-3.5" /> {t('techPlan.backToLearning')}
                </Button>
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
