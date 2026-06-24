import { PageHeader, Panel, Progress, Button } from "@/components/ui-bits";
import { ScoreBreakdown } from "@/components/common/ScoreBreakdown";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getProfile, getCoreSkills, getDomainSkills, getActivities } from "@/data/mockProfile";
import { getStoredProfile } from "@/lib/mockStorage";

export default function Profile() {
  const { t } = useI18n();
  const storedProfileData = getStoredProfile();
  const defaultProfile = getProfile();
  const profile = storedProfileData ? { ...defaultProfile, ...storedProfileData } : defaultProfile;
  const coreSkills = getCoreSkills();
  const domainSkills = getDomainSkills();
  const activities = getActivities();

  const stats = [
    { label: t('profile.level'), value: profile.level },
    { label: t('profile.streak'), value: `${profile.streak} ${t('dash.days')}` },
    { label: t('profile.mockInterviews'), value: `${profile.mockInterviews}` },
    { label: t('profile.wordsMastered'), value: `${profile.wordsMastered}` },
  ];

  return (
    <div>
      <PageHeader title={t('profile.title')} subtitle={t('profile.desc')} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Panel padded={false}>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold border border-border">
                {profile.initials}
              </div>
              <h3 className="mt-3 text-base font-semibold">{profile.name}</h3>
              <p className="text-xs text-muted-foreground">{profile.role} · {profile.experience}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('profile.title')}: {profile.target}</p>
              <Link to="/profile/edit"><Button variant="outline" size="sm" className="mt-4">{t('profile.editProfile')}</Button></Link>
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

          <Panel title={t('profile.preferences')}>
            <ul className="text-sm space-y-3">
              <li className="flex justify-between">
                <span className="text-muted-foreground">{t('profile.dailyGoal')}</span>
                <span>{profile.dailyGoal} min</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('profile.interfaceLang')}</span>
                <LanguageSwitcher />
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">{t('profile.voiceAccent')}</span>
                <span>{profile.voiceAccent}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">{t('profile.notifications')}</span>
                <span>{profile.notifications}</span>
              </li>
            </ul>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Panel title={t('profile.skillProfile')} description={t('profile.skillDesc')}>
            <ScoreBreakdown scores={coreSkills.map((s) => ({ name: s.name, value: s.value }))} />
          </Panel>

          <Panel title={t('profile.domainSkill')} description={t('profile.domainDesc')}>
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

          <Panel title={t('profile.recentActivity')}>
            <ul className="divide-y divide-border -my-2">
              {activities.map((a) => (
                <li key={a.title + a.date} className="flex justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subtitle}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
