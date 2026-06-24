import { Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { Code2, MessageSquareCode, Briefcase, ArrowRight, Clock, CheckCircle2, Lock, PlayCircle, Circle } from "lucide-react";

type Module = { name: string; status: "completed" | "in_progress" | "next" | "locked"; progress?: number };

const paths: {
  to: string;
  icon: typeof Code2;
  name: string;
  desc: string;
  milestone: string;
  modules: Module[];
}[] = [
  {
    to: "/technical-english",
    icon: Code2,
    name: "Backend English",
    desc: "Talk about APIs, databases, and services in English.",
    milestone: "Milestone: Explain a backend project end-to-end in 3 min.",
    modules: [
      { name: "RESTful API", status: "completed" },
      { name: "Database", status: "completed" },
      { name: "Redis Cache", status: "in_progress", progress: 50 },
      { name: "RabbitMQ", status: "locked" },
    ],
  },
  {
    to: "/interview-english",
    icon: MessageSquareCode,
    name: "Interview English",
    desc: "Self-introduction, project stories, technical Q&A.",
    milestone: "Milestone: Pass a mid-level mock interview with score ≥ 80.",
    modules: [
      { name: "Self-introduction", status: "completed" },
      { name: "Project story (STAR)", status: "in_progress", progress: 35 },
      { name: "System design Q&A", status: "next" },
      { name: "Behavioral deep dive", status: "locked" },
    ],
  },
  {
    to: "/workplace-english",
    icon: Briefcase,
    name: "Workplace English",
    desc: "Emails, standups, code review, daily collaboration.",
    milestone: "Milestone: Run a 15-min standup in English.",
    modules: [
      { name: "Daily standup", status: "in_progress", progress: 20 },
      { name: "Code review comments", status: "next" },
      { name: "Async writing (Slack/email)", status: "locked" },
      { name: "Disagree politely", status: "locked" },
    ],
  },
];

const recommended = [
  { tag: "Interview", title: "Redis Cache Interview Answer", time: "8 min", level: "B2" },
  { tag: "Workplace", title: "Daily Standup Expressions", time: "6 min", level: "B1" },
  { tag: "Technical", title: "API Design Vocabulary", time: "10 min", level: "B1+" },
];

function statusIcon(s: Module["status"]) {
  if (s === "completed") return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
  if (s === "in_progress") return <PlayCircle className="w-3.5 h-3.5 text-primary" />;
  if (s === "locked") return <Lock className="w-3.5 h-3.5 text-muted-foreground/60" />;
  return <Circle className="w-3.5 h-3.5 text-muted-foreground" />;
}

function statusLabel(m: Module) {
  if (m.status === "completed") return "Completed";
  if (m.status === "in_progress") return `${m.progress ?? 0}%`;
  if (m.status === "locked") return "Locked";
  return "Up next";
}

function pathProgress(modules: Module[]) {
  const total = modules.length;
  const score = modules.reduce((acc, m) => {
    if (m.status === "completed") return acc + 100;
    if (m.status === "in_progress") return acc + (m.progress ?? 0);
    return acc;
  }, 0);
  return Math.round(score / total);
}

export default function Learning() {
  return (
    <div>
      <PageHeader
        title="Learning Center"
        subtitle="Structured paths with modules and milestones. Pick a path and work module by module."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {paths.map((p) => {
          const pp = pathProgress(p.modules);
          return (
            <div key={p.name} className="panel p-5 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-md bg-accent text-primary flex items-center justify-center">
                    <p.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight">{p.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{pp}%</span>
              </div>

              <Progress value={pp} className="mt-3" />

              <ul className="mt-4 space-y-1.5 flex-1">
                {p.modules.map((m) => (
                  <li
                    key={m.name}
                    className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm border ${
                      m.status === "in_progress"
                        ? "bg-accent border-primary/15"
                        : "border-transparent hover:bg-secondary/60"
                    } ${m.status === "locked" ? "text-muted-foreground" : ""}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {statusIcon(m.status)}
                      <span className="truncate">{m.name}</span>
                    </div>
                    <span
                      className={`text-[11px] font-mono shrink-0 ${
                        m.status === "completed"
                          ? "text-success"
                          : m.status === "in_progress"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {statusLabel(m)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[11px] text-muted-foreground leading-snug">{p.milestone}</p>
                <Link to={p.to}>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Open path <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Panel
          title="Recommended Today"
          description="Short sessions matched to your weak areas"
          action={<Button variant="ghost" size="sm">Refresh</Button>}
        >
          <ul className="divide-y divide-border -my-2">
            {recommended.map((r) => (
              <li key={r.title} className="flex items-center justify-between py-3 group">
                <div className="flex items-center gap-3">
                  <span className="chip-blue">{r.tag}</span>
                  <span className="text-sm font-medium">{r.title}</span>
                  <span className="chip">{r.level}</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {r.time}</span>
                  <Button variant="outline" size="sm">Start</Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
