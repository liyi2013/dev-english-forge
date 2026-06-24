import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, Panel, Button } from "@/components/ui-bits";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { getProfile } from "@/data/mockProfile";
import {
  getStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
  StoredProfileDraft,
} from "@/lib/mockStorage";
import { ArrowLeft } from "lucide-react";

const defaultProfile = (): StoredProfileDraft => {
  const stored = getStoredProfile();
  if (stored) return { ...stored };
  const mock = getProfile();
  return {
    name: mock.name,
    nameZh: mock.nameZh,
    role: mock.role,
    roleZh: mock.roleZh,
    experience: mock.experience,
    target: mock.target,
    targetZh: mock.targetZh,
    dailyGoal: mock.dailyGoal,
    interfaceLanguage: mock.interfaceLanguage,
    voiceAccent: mock.voiceAccent,
    notifications: mock.notifications,
    initials: mock.initials,
  };
};


const roleOptions = [
  { value: "backend-engineer", zh: "后端工程师", en: "Backend Engineer" },
  { value: "frontend-engineer", zh: "前端工程师", en: "Frontend Engineer" },
  { value: "fullstack-engineer", zh: "全栈工程师", en: "Full-stack Engineer" },
  { value: "java-backend-engineer", zh: "Java 后端工程师", en: "Java Backend Engineer" },
  { value: "dotnet-backend-engineer", zh: ".NET 后端工程师", en: ".NET Backend Engineer" },
  { value: "python-backend-engineer", zh: "Python 后端工程师", en: "Python Backend Engineer" },
  { value: "go-backend-engineer", zh: "Go 后端工程师", en: "Go Backend Engineer" },
  { value: "devops-engineer", zh: "DevOps 工程师", en: "DevOps Engineer" },
  { value: "data-engineer", zh: "数据工程师", en: "Data Engineer" },
  { value: "ai-engineer", zh: "AI 应用工程师", en: "AI Application Engineer" },
  { value: "custom", zh: "自定义角色", en: "Custom role" },
];

const targetRoleOptions = [
  { value: "junior-backend", zh: "初级后端工程师", en: "Junior Backend Engineer" },
  { value: "mid-backend", zh: "中级后端工程师", en: "Mid-level Backend Engineer" },
  { value: "senior-backend", zh: "高级后端工程师", en: "Senior Backend Engineer" },
  { value: "senior-backend-overseas", zh: "高级后端工程师（海外方向）", en: "Senior Backend Engineer (Overseas)" },
  { value: "backend-lead", zh: "后端技术负责人", en: "Backend Tech Lead" },
  { value: "fullstack-overseas", zh: "全栈工程师（海外方向）", en: "Full-stack Engineer (Overseas)" },
  { value: "ai-application-engineer", zh: "AI 应用工程师", en: "AI Application Engineer" },
  { value: "solution-architect", zh: "解决方案架构师", en: "Solution Architect" },
  { value: "custom", zh: "自定义目标岗位", en: "Custom target role" },
];

function findRoleOption(zh: string, en: string) {
  return roleOptions.find((o) => o.zh === zh && o.en === en) || null;
}

function findTargetRoleOption(zh: string, en: string) {
  return targetRoleOptions.find((o) => o.zh === zh && o.en === en) || null;
}

export default function ProfileEdit() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState<StoredProfileDraft>(defaultProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Role selection state
  const [selectedRoleValue, setSelectedRoleValue] = useState(() => {
    const opt = findRoleOption(form.roleZh, form.role);
    return opt ? opt.value : "custom";
  });
  const [isRoleCustom, setIsRoleCustom] = useState(() => {
    return findRoleOption(form.roleZh, form.role) === null;
  });

  // Target role selection state
  const [selectedTargetValue, setSelectedTargetValue] = useState(() => {
    const opt = findTargetRoleOption(form.targetZh, form.target);
    return opt ? opt.value : "custom";
  });
  const [isTargetCustom, setIsTargetCustom] = useState(() => {
    return findTargetRoleOption(form.targetZh, form.target) === null;
  });


  const update = <K extends keyof StoredProfileDraft>(
    key: K,
    value: StoredProfileDraft[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t("common.required");
    if (!form.nameZh.trim()) errs.nameZh = t("common.required");
    if (!form.role.trim()) errs.role = t("common.required");
    if (!form.roleZh.trim()) errs.roleZh = t("common.required");
    if (!form.target.trim()) errs.target = t("common.required");
    if (!form.targetZh.trim()) errs.targetZh = t("common.required");
    if (form.dailyGoal < 5 || form.dailyGoal > 180) {
      errs.dailyGoal = t("profileEdit.invalidDailyGoal");
    }
    if (!form.initials.trim() || form.initials.length > 4) {
      errs.initials = t("common.required");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    saveStoredProfile(form);
    toast.success(t("profileEdit.saved"));
    navigate("/profile");
  };

  const handleReset = () => {
    const mock = getProfile();
    setForm({
      name: mock.name,
      nameZh: mock.nameZh,
      role: mock.role,
      roleZh: mock.roleZh,
      experience: mock.experience,
      target: mock.target,
      targetZh: mock.targetZh,
      dailyGoal: mock.dailyGoal,
      interfaceLanguage: mock.interfaceLanguage,
      voiceAccent: mock.voiceAccent,
      notifications: mock.notifications,
      initials: mock.initials,
    });
    setErrors({});
    toast.success(t("profileEdit.resetDone"));
  };

  const handleRestoreDefault = () => {
    clearStoredProfile();
    const mock = getProfile();
    setForm({
      name: mock.name,
      nameZh: mock.nameZh,
      role: mock.role,
      roleZh: mock.roleZh,
      experience: mock.experience,
      target: mock.target,
      targetZh: mock.targetZh,
      dailyGoal: mock.dailyGoal,
      interfaceLanguage: mock.interfaceLanguage,
      voiceAccent: mock.voiceAccent,
      notifications: mock.notifications,
      initials: mock.initials,
    });
    setErrors({});
    toast.success(t("profileEdit.restoreDone"));
  };

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t("profileEdit.backToProfile")}
        </Link>
      </div>

      <PageHeader title={t("profileEdit.title")} subtitle={t("profileEdit.desc")} />

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Form */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Basic Profile */}
          <Panel title={t("profileEdit.basicProfile")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.nameZh")} <span className="text-destructive">*</span>
                </label>
                <input
                  value={form.nameZh}
                  onChange={(e) => update("nameZh", e.target.value)}
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                {errors.nameZh && (
                  <p className="text-xs text-destructive mt-0.5">{errors.nameZh}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.name")} <span className="text-destructive">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-0.5">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.roleZh")} <span className="text-destructive">*</span>
                </label>
                <select
                  value={selectedRoleValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedRoleValue(val);
                    if (val === "custom") {
                      setIsRoleCustom(true);
                    } else {
                      setIsRoleCustom(false);
                      const opt = roleOptions.find((o) => o.value === val);
                      if (opt) {
                        update("roleZh", opt.zh);
                        update("role", opt.en);
                        update("roleKey" as keyof StoredProfileDraft, opt.value);
                      }
                    }
                  }}
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  <option value="">{t("profileEdit.selectRole")}</option>
                  {roleOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.zh}</option>
                  ))}
                </select>
                {isRoleCustom && (
                  <input
                    value={form.roleZh}
                    onChange={(e) => update("roleZh", e.target.value)}
                    placeholder={t("profileEdit.roleZh")}
                    className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                )}
                {errors.roleZh && (
                  <p className="text-xs text-destructive mt-0.5">{errors.roleZh}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.role")} <span className="text-destructive">*</span>
                </label>
                {isRoleCustom ? (
                  <input
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    placeholder={t("profileEdit.role")}
                    className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                ) : (
                  <input
                    value={form.role}
                    readOnly
                    className="w-full text-sm bg-muted/50 border border-border rounded-md px-3 py-2 text-muted-foreground cursor-default"
                  />
                )}
                {errors.role && (
                  <p className="text-xs text-destructive mt-0.5">{errors.role}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.experience")}
                </label>
                <input
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.initials")} (1-4)
                </label>
                <input
                  value={form.initials}
                  onChange={(e) => update("initials", e.target.value.slice(0, 4))}
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                {errors.initials && (
                  <p className="text-xs text-destructive mt-0.5">{errors.initials}</p>
                )}
              </div>
            </div>
          </Panel>

          {/* Learning Goal */}
          <Panel title={t("profileEdit.learningGoal")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.targetZh")} <span className="text-destructive">*</span>
                </label>
                <select
                  value={selectedTargetValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedTargetValue(val);
                    if (val === "custom") {
                      setIsTargetCustom(true);
                    } else {
                      setIsTargetCustom(false);
                      const opt = targetRoleOptions.find((o) => o.value === val);
                      if (opt) {
                        update("targetZh", opt.zh);
                        update("target", opt.en);
                        update("targetRoleKey" as keyof StoredProfileDraft, opt.value);
                      }
                    }
                  }}
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  <option value="">{t("profileEdit.selectTargetRole")}</option>
                  {targetRoleOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.zh}</option>
                  ))}
                </select>
                {isTargetCustom && (
                  <input
                    value={form.targetZh}
                    onChange={(e) => update("targetZh", e.target.value)}
                    placeholder={t("profileEdit.targetZh")}
                    className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                )}
                {errors.targetZh && (
                  <p className="text-xs text-destructive mt-0.5">{errors.targetZh}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.target")} <span className="text-destructive">*</span>
                </label>
                {isTargetCustom ? (
                  <input
                    value={form.target}
                    onChange={(e) => update("target", e.target.value)}
                    placeholder={t("profileEdit.target")}
                    className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                ) : (
                  <input
                    value={form.target}
                    readOnly
                    className="w-full text-sm bg-muted/50 border border-border rounded-md px-3 py-2 text-muted-foreground cursor-default"
                  />
                )}
                {errors.target && (
                  <p className="text-xs text-destructive mt-0.5">{errors.target}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.dailyGoal")} ({t("profileEdit.minutes")}, 5-180){" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={form.dailyGoal}
                  onChange={(e) =>
                    update("dailyGoal", Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
                {errors.dailyGoal && (
                  <p className="text-xs text-destructive mt-0.5">{errors.dailyGoal}</p>
                )}
              </div>
            </div>
          </Panel>

          {/* Preferences */}
          <Panel title={t("profileEdit.preferences")}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.interfaceLanguage")}
                </label>
                <select
                  value={form.interfaceLanguage}
                  onChange={(e) => update("interfaceLanguage", e.target.value)}
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  <option>简体中文</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.voiceAccent")}
                </label>
                <select
                  value={form.voiceAccent}
                  onChange={(e) => update("voiceAccent", e.target.value)}
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  <option>US English</option>
                  <option>UK English</option>
                  <option>Global English</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t("profileEdit.notifications")}
                </label>
                <select
                  value={form.notifications}
                  onChange={(e) => update("notifications", e.target.value)}
                  className="w-full text-sm bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring/40"
                >
                  <option>Daily, 8:00 PM</option>
                  <option>Daily, 9:00 AM</option>
                  <option>Weekdays only</option>
                  <option>Off</option>
                </select>
              </div>
            </div>
          </Panel>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave}>{t("profileEdit.save")}</Button>
            <Link to="/profile">
              <Button variant="outline">{t("profileEdit.cancel")}</Button>
            </Link>
            <Button variant="ghost" onClick={handleReset}>
              {t("profileEdit.reset")}
            </Button>
            <Button variant="ghost" onClick={handleRestoreDefault}>
              {t("profileEdit.restoreDefault")}
            </Button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Panel title={t("profileEdit.profilePreview")}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold border border-border">
                {form.initials || "?"}
              </div>
              <h3 className="mt-3 text-base font-semibold">
                {form.nameZh} / {form.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {form.roleZh} / {form.role} · {form.experience}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {form.targetZh} / {form.target}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("profileEdit.dailyGoal")}: {form.dailyGoal} {t("profileEdit.minutes")}
              </p>
            </div>
          </Panel>

          <Panel title={t("profileEdit.unsavedHint")}>
            <p className="text-xs text-muted-foreground">
              {t("profileEdit.unsavedHint")}
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
