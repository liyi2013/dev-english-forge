import { Link } from "react-router-dom";
import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { ArrowRight, MessageSquareCode, Mic, Clock } from "lucide-react";

const scenarios = [
  { name: "Self-Introduction", desc: "30-second and 90-second versions for tech roles.", level: "B1", progress: 70 },
  { name: "Project Experience", desc: "Use STAR to describe what you built and why.", level: "B1+", progress: 42 },
  { name: "Technical Q&A", desc: "Answer system & coding questions in English.", level: "B2", progress: 18 },
  { name: "Behavioral Questions", desc: "Conflict, leadership, failure stories.", level: "B1", progress: 25 },
  { name: "Salary & Offer", desc: "Negotiation phrases and clarifying questions.", level: "B2", progress: 0 },
  { name: "Closing Questions", desc: "Smart questions to ask the interviewer.", level: "B1", progress: 60 },
];

const banks = [
  { tag: "Backend", title: "Explain a recent backend project", count: 12 },
  { tag: "System Design", title: "Design a rate limiter", count: 8 },
  { tag: "Behavioral", title: "Tell me about a time you disagreed", count: 15 },
];

export default function InterviewEnglish() {
  return (
    <div>
      <PageHeader
        title="Interview English"
        subtitle="Self-introduction, project experience, and technical Q&A — practiced in interview English, not textbook English."
        actions={<Link to="/ai-interview"><Button><Mic className="w-3.5 h-3.5" /> Start mock interview</Button></Link>}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="panel p-5 bg-accent border-primary/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">Continue</div>
                <h3 className="mt-1.5 text-lg font-semibold">Explain your recent project</h3>
                <p className="text-sm text-muted-foreground mt-1">Use the STAR pattern. Aim for 90 seconds. Voice + AI feedback.</p>
              </div>
              <Button>Continue <ArrowRight className="w-3.5 h-3.5" /></Button>
            </div>
            <Progress value={28} className="mt-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-3">Scenarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map((s) => (
                <div key={s.name} className="panel p-4 hover:border-primary/40 transition cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold">{s.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                    <span className="chip shrink-0">{s.level}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Progress value={s.progress} />
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">{s.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Panel title="Question Banks" description="Practice real interview questions by category">
            <ul className="divide-y divide-border -my-2">
              {banks.map((b) => (
                <li key={b.title} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="chip-blue">{b.tag}</span>
                    <span className="text-sm font-medium">{b.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span>{b.count} questions</span>
                    <Button variant="outline" size="sm">Open</Button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title="STAR Pattern">
            <ul className="text-sm space-y-2">
              <li><span className="font-mono text-primary font-semibold">S</span> · Situation — set the context</li>
              <li><span className="font-mono text-primary font-semibold">T</span> · Task — what you needed to solve</li>
              <li><span className="font-mono text-primary font-semibold">A</span> · Action — what you did</li>
              <li><span className="font-mono text-primary font-semibold">R</span> · Result — measurable outcome</li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4 w-full"><MessageSquareCode className="w-3.5 h-3.5" /> See examples</Button>
          </Panel>

          <Panel title="Last Practice">
            <p className="text-sm font-medium">Explain your recent project</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 2 days ago · 72 / 100</p>
            <p className="text-xs text-muted-foreground mt-2">Strong opening. Missing measurable result at the end.</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
