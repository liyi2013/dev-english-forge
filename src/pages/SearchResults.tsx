import { Link, useSearchParams } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { BookOpen, Sparkles, MessageSquare, Mic, ArrowRight, Search } from "lucide-react";

const datasets = {
  topics: [
    { title: "Redis Cache English", path: "/technical-english/restful-api", desc: "Hit rate, eviction, hot keys — explained in English.", level: "B2", chip: "Technical English" },
    { title: "Cache strategies in System Design", path: "/technical-english/restful-api", desc: "Compare CDN, in-memory, and write-through caching aloud.", level: "B2", chip: "System Design" },
    { title: "Database query caching", path: "/technical-english/restful-api", desc: "Explain query cache invalidation in a code review.", level: "B1+", chip: "Backend" },
  ],
  vocab: [
    { term: "cache hit rate", def: "The percentage of requests served directly from the cache." },
    { term: "eviction policy", def: "The rule (e.g. LRU, LFU) that decides which keys to drop when memory is full." },
    { term: "hot key", def: "A single key receiving a disproportionately large share of traffic." },
    { term: "TTL (time to live)", def: "How long a cached value stays valid before it expires." },
  ],
  questions: [
    { q: "How would you troubleshoot a Redis cache hit rate drop?", role: "Backend · Mid", path: "/ai-interview" },
    { q: "Walk me through your caching strategy for a read-heavy API.", role: "Backend · Senior", path: "/ai-interview" },
    { q: "What is cache stampede and how do you prevent it?", role: "System Design", path: "/ai-interview" },
  ],
  reports: [
    { title: "Mock Interview · Jun 21", score: 78, note: "Weak on cache troubleshooting structure.", path: "/ai-interview/report" },
    { title: "Mock Interview · Jun 14", score: 71, note: "Cache vocabulary was repetitive.", path: "/ai-interview/report" },
  ],
};

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "cache";

  const total =
    datasets.topics.length + datasets.vocab.length + datasets.questions.length + datasets.reports.length;

  return (
    <div>
      <PageHeader
        title={`Search results`}
        subtitle={`${total} results across topics, vocabulary, interview questions, and reports.`}
      />

      <div className="panel p-3 mb-6 flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground ml-1.5" />
        <input
          defaultValue={q}
          onKeyDown={(e) => {
            if (e.key === "Enter") setParams({ q: (e.target as HTMLInputElement).value });
          }}
          className="flex-1 h-8 bg-transparent text-sm focus:outline-none"
          placeholder="Search topics, vocabulary, interview questions..."
        />
        <div className="flex gap-1">
          {["All", "Topics", "Vocabulary", "Questions", "Reports"].map((f, i) => (
            <button
              key={f}
              className={`chip ${i === 0 ? "bg-primary text-primary-foreground border-primary" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Topics */}
        <Panel
          title="Topics"
          description={`${datasets.topics.length} matching topics in Technical English`}
          action={<span className="chip"><BookOpen className="w-3 h-3" /> Lessons</span>}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {datasets.topics.map((t) => (
              <Link key={t.title} to={t.path} className="panel p-4 hover:border-primary/40 transition block">
                <div className="flex items-center gap-2">
                  <span className="chip-blue">{t.chip}</span>
                  <span className="chip">{t.level}</span>
                </div>
                <h4 className="mt-2 text-sm font-semibold">
                  <Highlight text={t.title} q={q} />
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  <Highlight text={t.desc} q={q} />
                </p>
              </Link>
            ))}
          </div>
        </Panel>

        {/* Vocabulary */}
        <Panel
          title="Vocabulary"
          description={`${datasets.vocab.length} matching terms`}
          action={<span className="chip"><Sparkles className="w-3 h-3" /> Terms</span>}
        >
          <ul className="divide-y divide-border -my-2">
            {datasets.vocab.map((v) => (
              <li key={v.term} className="flex items-start justify-between py-3 gap-4">
                <div>
                  <div className="text-sm font-mono font-medium">
                    <Highlight text={v.term} q={q} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <Highlight text={v.def} q={q} />
                  </p>
                </div>
                <Button variant="outline" size="sm">+ Save</Button>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Interview Questions */}
        <Panel
          title="Interview Questions"
          description={`${datasets.questions.length} matching questions`}
          action={<span className="chip"><MessageSquare className="w-3 h-3" /> Q&A</span>}
        >
          <ul className="divide-y divide-border -my-2">
            {datasets.questions.map((item) => (
              <li key={item.q} className="flex items-start justify-between py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-relaxed">
                    <Highlight text={item.q} q={q} />
                  </p>
                  <span className="text-xs text-muted-foreground">{item.role}</span>
                </div>
                <Link to={item.path}>
                  <Button variant="outline" size="sm">Practice <ArrowRight className="w-3.5 h-3.5" /></Button>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Reports */}
        <Panel
          title="Interview Reports"
          description={`${datasets.reports.length} of your past reports mention this`}
          action={<span className="chip"><Mic className="w-3 h-3" /> Past sessions</span>}
        >
          <ul className="divide-y divide-border -my-2">
            {datasets.reports.map((r) => (
              <li key={r.title} className="flex items-start justify-between py-3 gap-4">
                <div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <Highlight text={r.note} q={q} />
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground">{r.score}</span>
                  <Link to={r.path}>
                    <Button variant="outline" size="sm">Open</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="bg-accent text-accent-foreground rounded px-0.5 font-medium">{p}</mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
