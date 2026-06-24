import { Link } from "react-router-dom";
import { Panel, Progress, Button, Stat } from "@/components/ui-bits";
import { Check, Flame, TrendingUp, Calendar, ArrowRight, Target, Mic } from "lucide-react";

const planItems = [
  { label: "Review 10 technical words", done: true },
  { label: "Practice 1 interview answer", done: false },
  { label: "Read 1 short technical paragraph", done: false },
];

const weakSkills = [
  { tag: "System Design vocabulary", level: 38 },
  { tag: "Past tense in project stories", level: 52 },
  { tag: "Cache & database terms", level: 44 },
];

function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{formatToday()}</p>
        <h1 className="text-2xl font-semibold mt-1">{greeting()}, Jinlin</h1>
      </div>

      {/* Daily focus banner */}
      <div className="panel p-5 bg-accent border-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">Today's Focus</div>
            <p className="text-base font-medium text-foreground mt-0.5">
              Explain Redis cache problems in English.
            </p>
            <p className="text-xs text-muted-foreground mt-1">~12 minutes · Speaking + Vocabulary</p>
          </div>
        </div>
        <Link to="/technical-english/restful-api" className="shrink-0">
          <Button variant="primary">Start focus <ArrowRight className="w-3.5 h-3.5" /></Button>
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT — main column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Continue learning */}
          <Panel title="Continue Learning" action={<Link to="/learning" className="text-xs text-primary hover:underline">All paths →</Link>}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="chip-blue">Technical English</span>
                  <span className="text-xs text-muted-foreground">Unit 4 of 8</span>
                </div>
                <h4 className="mt-2 text-base font-semibold">RESTful API Design</h4>
                <p className="text-sm text-muted-foreground mt-1">Next: Speaking Practice — Explain endpoints in 60 seconds.</p>
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={65} className="max-w-xs" />
                  <span className="text-xs text-muted-foreground font-mono">65%</span>
                </div>
              </div>
              <Link to="/technical-english/restful-api" className="shrink-0">
                <Button>Continue <ArrowRight className="w-3.5 h-3.5" /></Button>
              </Link>
            </div>
          </Panel>

          {/* Today's plan */}
          <Panel title="Today's Plan" description="3 small tasks · ~25 minutes total">
            <ul className="divide-y divide-border -my-2">
              {planItems.map((it) => (
                <li key={it.label} className="flex items-center justify-between py-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${it.done ? "bg-success border-success text-white" : "border-border bg-card"}`}>
                      {it.done && <Check className="w-3 h-3" strokeWidth={3} />}
                    </span>
                    <span className={`text-sm truncate ${it.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{it.label}</span>
                  </div>
                  <button className="text-xs text-primary hover:underline shrink-0">{it.done ? "Done" : "Start"}</button>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Weak skills — promoted into the main column */}
          <Panel title="Weak Skills" description="Focus areas based on your recent sessions" action={<Link to="/review" className="text-xs text-primary hover:underline">Review →</Link>}>
            <ul className="space-y-3">
              {weakSkills.map((s) => (
                <li key={s.tag}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{s.tag}</span>
                    <span className="font-mono text-muted-foreground">{s.level}%</span>
                  </div>
                  <Progress value={s.level} tone="warning" />
                </li>
              ))}
            </ul>
          </Panel>

          {/* Recommended */}
          <Panel title="Recommended Next" description="Based on yesterday's session">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Promoted AI Interview entry card */}
              <Link
                to="/ai-interview"
                className="panel p-4 md:col-span-1 bg-primary text-primary-foreground border-transparent hover:bg-primary/90 transition flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold bg-white/15 px-2 py-0.5 rounded">
                    <Mic className="w-3 h-3" /> AI Interview
                  </div>
                  <h5 className="mt-2 text-sm font-semibold leading-snug">Practice a backend mock interview</h5>
                  <p className="text-xs text-primary-foreground/80 mt-1">Live feedback on fluency, vocabulary & structure.</p>
                </div>
                <div className="mt-3 text-xs font-medium inline-flex items-center gap-1">
                  Start now <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {[
                { tag: "Workplace", title: "Daily Standup Expressions", time: "6 min", to: "/workplace-english" },
                { tag: "Technical", title: "API Design Vocabulary", time: "10 min", to: "/technical-english/restful-api" },
              ].map((c) => (
                <Link
                  key={c.title}
                  to={c.to}
                  className="panel p-3 hover:border-primary/40 hover:shadow-sm transition cursor-pointer flex flex-col"
                >
                  <span className="chip-blue">{c.tag}</span>
                  <h5 className="mt-2 text-sm font-medium">{c.title}</h5>
                  <p className="text-xs text-muted-foreground mt-1">{c.time}</p>
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        {/* RIGHT — quieter secondary column (no card chrome) */}
        <div className="col-span-12 lg:col-span-4 space-y-7">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Study Streak</div>
            <div className="flex items-center justify-between">
              <Stat label="Current" value={<span className="flex items-center gap-1.5 text-base font-semibold">12 <Flame className="w-3.5 h-3.5 text-warning" /></span>} hint="days" />
              <Stat label="Best" value={<span className="text-base font-semibold">21</span>} hint="days" />
              <Stat label="Week" value={<span className="text-base font-semibold">5 / 7</span>} hint="active" />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {[1,1,1,1,1,0.4,0].map((v,i) => (
                <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: v === 0 ? "hsl(var(--secondary))" : `hsl(var(--primary) / ${0.2 + v*0.4})` }} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Current Level</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-semibold text-foreground">B1+</span>
              <span className="text-xs text-muted-foreground">approaching B2</span>
            </div>
            <Progress value={68} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +6% from last month
            </p>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Upcoming Practice</div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-md bg-secondary text-muted-foreground flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">Mock interview — Backend</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tomorrow · 8:00 PM · 30 min</p>
                <Link to="/ai-interview" className="text-xs text-primary hover:underline mt-1.5 inline-block">Open AI Interview →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
