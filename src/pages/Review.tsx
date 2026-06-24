import { useState } from "react";
import { PageHeader, Panel, Tabs, Button, Progress } from "@/components/ui-bits";
import { Mic, Edit3, BookOpen, AlertCircle, TrendingDown, ArrowRight } from "lucide-react";

const tabs = ["Wrong Answers", "Vocabulary", "Saved Sentences", "Interview Reports"];

const weakTags = ["Redis cache", "System design", "Past-tense storytelling", "Idempotency", "Hot key", "Monitoring metrics"];

const weakPointsSummary = [
  {
    theme: "Cache troubleshooting structure",
    sources: "3 wrong answers · 2 interview reports",
    detail: "You jump to actions before observing metrics. Practice the 'observe → narrow → act' pattern.",
    severity: "high",
  },
  {
    theme: "Vocabulary: eviction & TTL",
    sources: "6 vocab items · 1 wrong answer",
    detail: "Terms like eviction policy, TTL, and hot key are not yet active recall.",
    severity: "medium",
  },
  {
    theme: "Past-tense project storytelling",
    sources: "2 interview reports",
    detail: "Tense slips when describing what you did last quarter (STAR · Action step).",
    severity: "medium",
  },
];

export default function Review() {
  const [tab, setTab] = useState("Wrong Answers");

  return (
    <div>
      <PageHeader
        title="Review"
        subtitle="Close the learning loop. Fix what you got wrong, lock in what you've learned."
      />

      {/* Weak Points Summary */}
      <Panel
        title="Weak Points Summary"
        description="Recurring problems aggregated from wrong answers, vocabulary, and interview reports."
        action={<Button variant="ghost" size="sm">View all</Button>}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {weakPointsSummary.map((w) => (
            <div
              key={w.theme}
              className={`panel p-4 ${
                w.severity === "high"
                  ? "bg-[hsl(var(--warning)/0.06)] border-[hsl(var(--warning)/0.3)]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingDown className={`w-3.5 h-3.5 ${w.severity === "high" ? "text-warning" : "text-muted-foreground"}`} />
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${w.severity === "high" ? "text-warning" : "text-muted-foreground"}`}>
                  {w.severity === "high" ? "High priority" : "Recurring"}
                </span>
              </div>
              <h4 className="mt-2 text-sm font-semibold leading-snug">{w.theme}</h4>
              <p className="text-[11px] text-muted-foreground mt-1">{w.sources}</p>
              <p className="text-xs text-foreground mt-2 leading-relaxed">{w.detail}</p>
              <button className="mt-3 text-xs font-medium text-primary inline-flex items-center gap-1 hover:underline">
                Open drill <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <div className="panel mb-6">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="px-5 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>{tab === "Wrong Answers" ? "12 items queued · sorted by recency" : `${tab} view`}</span>
          <div className="flex gap-2">
            <button className="hover:text-foreground">Newest</button>
            <span>·</span>
            <button className="hover:text-foreground">Weakest</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {tab === "Wrong Answers" && (
            <>
              <div className="panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="chip-amber"><AlertCircle className="w-3 h-3" /> Needs rework</span>
                      <span className="chip">Interview · Backend</span>
                      <span className="text-xs text-muted-foreground">From session · Jun 21</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold leading-relaxed">
                      How would you troubleshoot Redis cache hit rate drops?
                    </h3>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="panel p-3 bg-background border-dashed">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Your previous answer</div>
                    <p className="text-sm text-muted-foreground italic line-clamp-4">
                      "I would check the cache keys and the expiration time. Maybe the traffic pattern changed, so we need to update the cache…"
                    </p>
                  </div>
                  <div className="panel p-3 bg-[hsl(var(--warning)/0.06)] border-[hsl(var(--warning)/0.3)]">
                    <div className="text-[10px] uppercase tracking-wider text-warning font-semibold mb-1.5">Problem</div>
                    <p className="text-sm text-foreground">Missing hot key analysis and monitoring metrics. Answer ended too quickly without a structured troubleshooting flow.</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button><Edit3 className="w-3.5 h-3.5" /> Rewrite Answer</Button>
                  <Button variant="outline"><Mic className="w-3.5 h-3.5" /> Speak Again</Button>
                  <Button variant="ghost"><BookOpen className="w-3.5 h-3.5" /> View Suggested Answer</Button>
                </div>
              </div>

              <div className="panel p-5 opacity-90">
                <div className="flex items-center gap-2">
                  <span className="chip-amber">Needs rework</span>
                  <span className="chip">Interview · System Design</span>
                </div>
                <h3 className="mt-3 text-base font-semibold">
                  Design a URL shortener — how would you handle high read traffic?
                </h3>
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                  Mentioned caching but didn't compare CDN vs in-memory cache trade-offs.
                </p>
              </div>
            </>
          )}

          {tab === "Vocabulary" && (
            <div className="panel p-10 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/60" />
              <h3 className="mt-3 text-sm font-semibold">No saved vocabulary yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Words you mark while reading or during an interview will appear here for spaced review.
              </p>
              <Button variant="outline" size="sm" className="mt-4">Browse Technical English</Button>
            </div>
          )}

          {tab === "Saved Sentences" && (
            <div className="panel p-10 text-center">
              <Edit3 className="w-8 h-8 mx-auto text-muted-foreground/60" />
              <h3 className="mt-3 text-sm font-semibold">No saved sentences yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Save useful sentences from lessons or your own answers to reuse in real conversations.
              </p>
            </div>
          )}

          {tab === "Interview Reports" && (
            <div className="panel p-10 text-center">
              <Mic className="w-8 h-8 mx-auto text-muted-foreground/60" />
              <h3 className="mt-3 text-sm font-semibold">No interview reports yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Finish an AI Interview session to get a structured report with strengths, weak points, and replay practice.
              </p>
              <Button variant="outline" size="sm" className="mt-4">Start AI Interview</Button>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title="Weekly Review Progress">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">7<span className="text-muted-foreground text-base font-normal"> / 15</span></span>
              <span className="text-xs text-muted-foreground">items fixed</span>
            </div>
            <Progress value={(7/15)*100} className="mt-3" tone="success" />
            <p className="text-xs text-muted-foreground mt-3">Stay on track — fix 8 more this week to clear the queue.</p>
          </Panel>

          <Panel title="Weak Skill Tags" description="Click to filter the review list">
            <div className="flex flex-wrap gap-1.5">
              {weakTags.map((t) => (
                <span key={t} className="chip hover:bg-accent hover:text-accent-foreground cursor-pointer">{t}</span>
              ))}
            </div>
          </Panel>

          <Panel title="Spaced Repetition">
            <ul className="text-sm space-y-2">
              <li className="flex justify-between"><span>Due today</span><span className="font-mono font-medium">4</span></li>
              <li className="flex justify-between"><span>Due tomorrow</span><span className="font-mono text-muted-foreground">7</span></li>
              <li className="flex justify-between"><span>This week</span><span className="font-mono text-muted-foreground">18</span></li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4 w-full">Start review session</Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
