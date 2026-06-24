export interface SkillProfile {
  coreSkills: CoreSkill[];
  domainSkills: DomainSkill[];
}

export interface CoreSkill {
  name: string;
  value: number;
  hint: string;
  hintZh: string;
}

export interface DomainSkill {
  name: string;
  value: number;
}

export interface UserProfile {
  name: string;
  nameZh: string;
  role: string;
  roleZh: string;
  experience: string;
  target: string;
  targetZh: string;
  level: string;
  streak: number;
  bestStreak: number;
  mockInterviews: number;
  wordsMastered: number;
  targetWords: number;
  dailyGoal: number;
  interfaceLanguage: string;
  voiceAccent: string;
  notifications: string;
  initials: string;
}

export interface ActivityItem {
  title: string;
  titleZh: string;
  subtitle: string;
  date: string;
}
