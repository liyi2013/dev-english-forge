import { Link } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import { setInterviewConfig } from "@/lib/mockStorage";
import { Zap, FileText, ClipboardList, ChevronDown, Play } from "lucide-react";
import { useState } from "react";

const modes = [
  { id: "quick", icon: Zap, nameKey: "ai.quickPractice", descKey: "ai.quickDesc" },
  { id: "jd", icon: FileText, nameKey: "ai.jdBased", descKey: "ai.jdDesc" },
  { id: "full", icon: ClipboardList, nameKey: "ai.fullMock", descKey: "ai.fullDesc" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Select({ value, options }: { value: string; options: string[] }) {
  return (
    <div className="relative">
      <select
        defaultValue={value}
        className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  );
}

export default function AIInterviewLobby() {
  const { t } = useI18n();
  const [selected, setSelected] = useState("quick");
  const [role, setRole] = useState("Backend Developer");
  const [difficulty, setDifficulty] = useState("Mid-level");
  const [language, setLanguage] = useState("English");
  const [questionCount, setQuestionCount] = useState("10");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [duration, setDuration] = useState("30 minutes");

  const handleStart = () => {
    setInterviewConfig({
      mode: selected,
      role,
      difficulty,
      language,
      questionCount: parseInt(questionCount),
      interviewType,
      duration,
    });
  };

  return (
    <div>
      <PageHeader
        title={t('ai.title')}
        subtitle={t('ai.desc')}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {modes.map((m) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`panel p-5 text-left transition ${active ? "border-primary ring-1 ring-primary/30 bg-accent" : "hover:border-primary/40"}`}
            >
              <div className={`w-9 h-9 rounded-md flex items-center justify-center ${active ? "bg-primary text-primary-foreground" : "bg-accent text-primary"}`}>
                <m.icon className="w-4 h-4" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{t(m.nameKey)}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t(m.descKey)}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Panel title={t('ai.configure')} description={t('ai.configDesc')}>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('ai.targetRole')}>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {["Backend Developer", "Frontend Developer", "Full-Stack", "Data Engineer", "DevOps"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label={t('ai.difficulty')}>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {["Junior", "Mid-level", "Senior", "Staff"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label={t('ai.language')}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {["English", "English (slow)", "Bilingual hints"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label={t('ai.questionCount')}>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {["5", "10", "15", "20"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label={t('ai.interviewType')}>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {["Mixed", "Behavioral", "Technical", "System Design"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label={t('ai.duration')}>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {["15 minutes", "30 minutes", "45 minutes", "60 minutes"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {t('ai.estimatedSession')}: <span className="text-foreground font-medium">~{duration}</span> · {questionCount} {t('interview.questions')} · Voice answers
              </p>
              <Link to="/ai-interview/room" onClick={handleStart}>
                <Button size="lg"><Play className="w-4 h-4" /> {t('ai.startInterview')}</Button>
              </Link>
            </div>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t('ai.recentSessions')}>
            <ul className="space-y-3 -my-1">
              {[
                { name: "Backend · Mid", score: 78, date: "Jun 21" },
                { name: "System Design · Mid", score: 64, date: "Jun 18" },
                { name: "Behavioral · Junior", score: 81, date: "Jun 15" },
              ].map((s) => (
                <li key={s.date} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.date}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold">{s.score}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title={t('ai.beforeStart')}>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li>{t('ai.tip1')}</li>
              <li>{t('ai.tip2')}</li>
              <li>{t('ai.tip3')}</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
