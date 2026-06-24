import { Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { TopicCard } from "@/components/common/TopicCard";
import { useI18n } from "@/i18n";
import { getMockTopics } from "@/data/mockTopics";
import { getCoreSkills } from "@/data/mockProfile";
import { ArrowRight, BookOpen, Mic, MessageSquare, Sparkles } from "lucide-react";

const modes = [
  { label: "Read", icon: BookOpen },
  { label: "Vocabulary", icon: Sparkles },
  { label: "Speak", icon: Mic },
  { label: "Interview", icon: MessageSquare },
];

const paths = [
  { name: "Backend English", focusKey: "APIs, databases, services", progress: 48 },
  { name: "System Design English", focusKey: "Architecture, scaling, trade-offs", progress: 22 },
  { name: "DevOps English", focusKey: "CI/CD, Docker, Kubernetes", progress: 11 },
];

export default function TechnicalEnglish() {
  const topics = getMockTopics();
  const { t } = useI18n();
  const skills = getCoreSkills();

  return (
    <div>
      <PageHeader title={t('tech.title')} subtitle={t('tech.desc')} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Continue learning highlight */}
          <div className="panel p-5 bg-gradient-to-br from-accent to-transparent border-primary/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">{t('tech.continueLearning')}</span>
                  <span className="chip">B1 · Unit 4</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold">RESTful API Design</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  Explain endpoints, status codes, and idempotency in English with confidence.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {modes.map((m) => (
                    <span key={m.label} className="chip"><m.icon className="w-3 h-3" /> {m.label}</span>
                  ))}
                </div>
              </div>
              <Link to="/technical-english/restful-api">
                <Button>{t('common.continue')} <ArrowRight className="w-3.5 h-3.5" /></Button>
              </Link>
            </div>
            <Progress value={65} className="mt-5" />
          </div>

          {/* Learning Paths */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t('learning.center')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {paths.map((p) => (
                <div key={p.name} className="panel p-4 hover:border-primary/40 transition cursor-pointer">
                  <h4 className="text-sm font-semibold">{p.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{p.focusKey}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Progress value={p.progress} />
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">{p.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">{t('tech.title')}</h2>
              <span className="text-xs text-muted-foreground">{topics.length} {t('tech.topics')}</span>
            </div>
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
                  modeChips={
                    <div className="flex flex-wrap items-center gap-1">
                      {modes.map((m) => (
                        <span key={m.label} className="chip text-[10px] py-0.5">
                          <m.icon className="w-2.5 h-2.5" /> {m.label}
                        </span>
                      ))}
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Skills panel */}
        <div className="col-span-12 lg:col-span-3">
          <Panel title={t('tech.skills')} description="Technical English breakdown">
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
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">{t('tech.nextMilestone')}</p>
              <p className="text-sm font-medium mt-0.5">Reach B2 in Speaking</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">{t('tech.viewPlan')}</Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
