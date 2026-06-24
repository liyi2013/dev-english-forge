import { Link } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import { setInterviewConfig } from "@/lib/mockStorage";
import { Zap, FileText, ClipboardList, Play } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const modes = [
  { id: "quick", icon: Zap, nameKey: "ai.quickPractice", descKey: "ai.quickDesc" },
  { id: "jd", icon: FileText, nameKey: "ai.jdBased", descKey: "ai.jdDesc" },
  { id: "full", icon: ClipboardList, nameKey: "ai.fullMock", descKey: "ai.fullDesc" },
];


const roleOptions = [
  { value: "Backend Developer", labelKey: "ai.roleBackend" },
  { value: "Frontend Developer", labelKey: "ai.roleFrontend" },
  { value: "Full-Stack", labelKey: "ai.roleFullStack" },
  { value: "Data Engineer", labelKey: "ai.roleDataEngineer" },
  { value: "DevOps", labelKey: "ai.roleDevOps" },
];

const difficultyOptions = [
  { value: "Junior", labelKey: "ai.difficultyJunior" },
  { value: "Mid-level", labelKey: "ai.difficultyMid" },
  { value: "Senior", labelKey: "ai.difficultySenior" },
  { value: "Staff", labelKey: "ai.difficultyStaff" },
];

const languageOptions = [
  { value: "English", labelKey: "ai.languageEnglish" },
  { value: "English (slow)", labelKey: "ai.languageEnglishSlow" },
  { value: "Bilingual hints", labelKey: "ai.languageBilingualHints" },
];

const typeOptions = [
  { value: "Mixed", labelKey: "ai.typeMixed" },
  { value: "Behavioral", labelKey: "ai.typeBehavioral" },
  { value: "Technical", labelKey: "ai.typeTechnical" },
  { value: "System Design", labelKey: "ai.typeSystemDesign" },
];

const durationOptions = [
  { value: "15 minutes", labelKey: "ai.duration15" },
  { value: "30 minutes", labelKey: "ai.duration30" },
  { value: "45 minutes", labelKey: "ai.duration45" },
  { value: "60 minutes", labelKey: "ai.duration60" },
];

const recentSessions = [
  { nameKey: "ai.recentBackendMid", score: 78, dateKey: "ai.dateJun21" },
  { nameKey: "ai.recentSystemDesignMid", score: 64, dateKey: "ai.dateJun18" },
  { nameKey: "ai.recentBehavioralJunior", score: 81, dateKey: "ai.dateJun15" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
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
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");

  const handleStart = () => {
    if (selected === "jd" && !jdText.trim()) {
      toast.info(t("ai.jdMissingHint"));
    }
    if (selected === "full" && !resumeText.trim() && !jdText.trim()) {
      toast.info(t("ai.fullMissingHint"));
    }
    setInterviewConfig({
      mode: selected,
      role,
      difficulty,
      language,
      questionCount: parseInt(questionCount),
      interviewType,
      duration,
      ...(selected === "jd" || selected === "full" ? { jdText: jdText.trim() || undefined } : {}),
      ...(selected === "full" ? { resumeText: resumeText.trim() || undefined } : {}),
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
                  {roleOptions.map((o) => (
                    <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                  ))}
                </select>
              </Field>
              <Field label={t('ai.difficulty')}>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {difficultyOptions.map((o) => <option key={o.value} value={o.value}>{t(o.labelKey)}</option>)}
                </select>
              </Field>
              <Field label={t('ai.language')}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {languageOptions.map((o) => <option key={o.value} value={o.value}>{t(o.labelKey)}</option>)}
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
                  {typeOptions.map((o) => <option key={o.value} value={o.value}>{t(o.labelKey)}</option>)}
                </select>
              </Field>
              <Field label={t('ai.duration')}>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="appearance-none w-full h-9 px-3 pr-8 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  {durationOptions.map((o) => <option key={o.value} value={o.value}>{t(o.labelKey)}</option>)}
                </select>
              </Field>
            </div>

            {/* JD mode input */}
            {selected === "jd" && (
              <div className="mt-5 pt-5 border-t border-border">
                <h4 className="text-sm font-semibold mb-1">{t("ai.jdInputTitle")}</h4>
                <p className="text-xs text-muted-foreground mb-3">{t("ai.jdInputDesc")}</p>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder={t("ai.jdPlaceholder")}
                  rows={6}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40 resize-y"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {t("ai.charCountPrefix")}{jdText.length}{t("ai.charCountSuffix")}
                </p>
              </div>
            )}

            {/* Full mode input */}
            {selected === "full" && (
              <div className="mt-5 pt-5 border-t border-border space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t("ai.fullInputTitle")}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{t("ai.fullInputDesc")}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">{t("ai.resumeLabel")}</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder={t("ai.resumePlaceholder")}
                    rows={6}
                    className="mt-1.5 w-full px-3 py-2 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40 resize-y"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("ai.resumeCharCountPrefix")}{resumeText.length}{t("ai.resumeCharCountSuffix")}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">{t("ai.jdLabel")}</label>
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder={t("ai.jdPlaceholder")}
                    rows={6}
                    className="mt-1.5 w-full px-3 py-2 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40 resize-y"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("ai.jdCharCountPrefix")}{jdText.length}{t("ai.jdCharCountSuffix")}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {t('ai.estimatedSession')}: <span className="text-foreground font-medium">~{t(durationOptions.find((o) => o.value === duration)?.labelKey || 'ai.duration30')}</span> · {questionCount} {t('interview.questions')} · {t('ai.voiceAnswers')}
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
              {recentSessions.map((s) => (
                <li key={s.dateKey} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t(s.nameKey)}</p>
                    <p className="text-xs text-muted-foreground">{t(s.dateKey)}</p>
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
