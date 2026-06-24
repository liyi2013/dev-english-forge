import { Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { ArrowRight, BookOpen, Mic, MessageSquare, Sparkles } from "lucide-react";

const modes = [
  { label: "Read", icon: BookOpen },
  { label: "Vocabulary", icon: Sparkles },
  { label: "Speak", icon: Mic },
  { label: "Interview", icon: MessageSquare },
];

const paths = [
  { name: "Backend English", focus: "APIs, databases, services", progress: 48 },
  { name: "System Design English", focus: "Architecture, scaling, trade-offs", progress: 22 },
  { name: "DevOps English", focus: "CI/CD, Docker, Kubernetes", progress: 11 },
];

const topics = [
  { name: "RESTful API", goal: "Explain endpoints, status codes, and idempotency to a colleague.", level: "B1", progress: 65, slug: "restful-api" },
  { name: "Database", goal: "Discuss indexes, transactions, and join trade-offs in a design review.", level: "B2", progress: 40, slug: "database" },
  { name: "Redis Cache", goal: "Describe hit rate drops, eviction, and hot keys in an interview.", level: "B2", progress: 30, slug: "redis" },
  { name: "RabbitMQ", goal: "Talk through queues, consumers, and retry strategies in standup.", level: "B2", progress: 12, slug: "rabbitmq" },
  { name: "Microservices", goal: "Walk through service boundaries and contracts in English.", level: "B2", progress: 18, slug: "microservices" },
  { name: "Docker", goal: "Explain images, containers, and volumes to a new teammate.", level: "B1", progress: 55, slug: "docker" },
  { name: "CI/CD", goal: "Describe a deployment pipeline and roll-back plan clearly.", level: "B1+", progress: 25, slug: "cicd" },
];

const skills = [
  { name: "Reading", value: 72 },
  { name: "Vocabulary", value: 58 },
  { name: "Speaking", value: 44 },
  { name: "Interview Answer", value: 51 },
];

export default function TechnicalEnglish() {
  return (
    <div>
      <PageHeader
        title="Technical English"
        subtitle="Each topic teaches you what to say — not how to code. Practice explaining the technology in real English."
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Continue learning highlight */}
          <div className="panel p-5 bg-gradient-to-br from-accent to-transparent border-primary/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">Continue Learning</span>
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
                <Button>Continue <ArrowRight className="w-3.5 h-3.5" /></Button>
              </Link>
            </div>
            <Progress value={65} className="mt-5" />
          </div>

          {/* Paths */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {paths.map((p) => (
                <div key={p.name} className="panel p-4 hover:border-primary/40 transition cursor-pointer">
                  <h4 className="text-sm font-semibold">{p.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{p.focus}</p>
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
              <h2 className="text-sm font-semibold text-foreground">Topics</h2>
              <span className="text-xs text-muted-foreground">{topics.length} topics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topics.map((t) => (
                <Link
                  key={t.name}
                  to={t.slug === "restful-api" ? "/technical-english/restful-api" : "/technical-english"}
                  className="panel p-4 hover:border-primary/40 hover:shadow-sm transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold">{t.name}</h4>
                      <p className="text-[11px] uppercase tracking-wider text-primary font-semibold mt-1.5">You'll learn to explain</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.goal}</p>
                    </div>
                    <span className="chip shrink-0">{t.level}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    {modes.map((m) => (
                      <span key={m.label} className="chip text-[10px] py-0.5"><m.icon className="w-2.5 h-2.5" /> {m.label}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Progress value={t.progress} />
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">{t.progress}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Skills panel */}
        <div className="col-span-12 lg:col-span-3">
          <Panel title="Your Skills" description="Technical English breakdown">
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
              <p className="text-xs text-muted-foreground">Next milestone</p>
              <p className="text-sm font-medium mt-0.5">Reach B2 in Speaking</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">View plan</Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
