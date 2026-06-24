import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";

const stats = [
  { label: "Level", value: "B1+" },
  { label: "Streak", value: "12 days" },
  { label: "Mock Interviews", value: "8" },
  { label: "Words Mastered", value: "342" },
];

const coreSkills = [
  { name: "Reading", value: 72, hint: "Understands most technical docs" },
  { name: "Vocabulary", value: 58, hint: "342 / 600 target words" },
  { name: "Speaking", value: 44, hint: "Fluency under pressure: weak" },
  { name: "Interview Answer", value: 51, hint: "Structure improving, depth low" },
];

const domainSkills = [
  { name: "Backend English", value: 62 },
  { name: "System Design English", value: 35 },
  { name: "Redis English", value: 48 },
  { name: "Docker English", value: 40 },
];

export default function Profile() {
  return (
    <div>
      <PageHeader title="Profile" subtitle="Your learning identity, skill profile, and preferences." />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Panel padded={false}>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold border border-border">JL</div>
              <h3 className="mt-3 text-base font-semibold">Jinlin Wang</h3>
              <p className="text-xs text-muted-foreground">Backend Engineer · 3 yrs experience</p>
              <p className="text-xs text-muted-foreground mt-1">Targeting: Senior Backend (overseas)</p>
              <Button variant="outline" size="sm" className="mt-4">Edit profile</Button>
            </div>
            <div className="grid grid-cols-2 border-t border-border">
              {stats.map((s, i) => (
                <div key={s.label} className={`p-4 ${i % 2 === 0 ? "border-r border-border" : ""} ${i < 2 ? "border-b border-border" : ""}`}>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</div>
                  <div className="text-base font-semibold mt-1">{s.value}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Preferences">
            <ul className="text-sm space-y-3">
              <li className="flex justify-between"><span className="text-muted-foreground">Daily goal</span><span>20 min</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Interface language</span><span>简体中文</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Voice accent</span><span>US English</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Notifications</span><span>Daily, 8:00 PM</span></li>
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Panel title="Skill Profile" description="Core English skills used across every interview and workplace conversation.">
            <ul className="space-y-4">
              {coreSkills.map((s) => (
                <li key={s.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <div>
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted-foreground ml-2">{s.hint}</span>
                    </div>
                    <span className="font-mono text-muted-foreground">{s.value}%</span>
                  </div>
                  <Progress value={s.value} />
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Domain Skill Profile" description="How well you can talk about each technical area in English.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {domainSkills.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium">{s.name}</span>
                    <span className="font-mono text-muted-foreground">{s.value}%</span>
                  </div>
                  <Progress value={s.value} tone={s.value >= 60 ? "success" : s.value >= 40 ? "primary" : "warning"} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Recent Activity">
            <ul className="divide-y divide-border -my-2">
              {[
                { t: "Completed Speaking Practice", s: "RESTful API Design · 60s answer", d: "Today" },
                { t: "Finished Mock Interview", s: "Backend · Mid-level · Score 78", d: "Jun 21" },
                { t: "Mastered 12 new words", s: "Cache & database vocabulary", d: "Jun 20" },
                { t: "Reviewed wrong answers", s: "3 items moved to mastered", d: "Jun 19" },
              ].map((a) => (
                <li key={a.t + a.d} className="flex justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{a.t}</p>
                    <p className="text-xs text-muted-foreground">{a.s}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.d}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
