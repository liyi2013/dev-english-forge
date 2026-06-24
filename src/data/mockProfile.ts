import type { UserProfile, CoreSkill, DomainSkill, ActivityItem } from '@/types/profile';

export const mockProfile: UserProfile = {
  name: 'Jinlin Wang',
  nameZh: '王金林',
  role: 'Backend Engineer',
  roleZh: '后端工程师',
  experience: '3 yrs experience',
  target: 'Senior Backend (overseas)',
  targetZh: '高级后端（海外）',
  level: 'B1+',
  streak: 12,
  bestStreak: 21,
  mockInterviews: 8,
  wordsMastered: 342,
  targetWords: 600,
  dailyGoal: 20,
  interfaceLanguage: '简体中文',
  voiceAccent: 'US English',
  notifications: 'Daily, 8:00 PM',
  initials: 'JL',
};

export const mockCoreSkills: CoreSkill[] = [
  { name: 'Reading', value: 72, hint: 'Understands most technical docs', hintZh: '能理解大部分技术文档' },
  { name: 'Vocabulary', value: 58, hint: '342 / 600 target words', hintZh: '已掌握 342 / 600 个目标单词' },
  { name: 'Speaking', value: 44, hint: 'Fluency under pressure: weak', hintZh: '压力下的流利度：较弱' },
  { name: 'Interview Answer', value: 51, hint: 'Structure improving, depth low', hintZh: '结构在进步，深度不足' },
];

export const mockDomainSkills: DomainSkill[] = [
  { name: 'Backend English', value: 62 },
  { name: 'System Design English', value: 35 },
  { name: 'Redis English', value: 48 },
  { name: 'Docker English', value: 40 },
];

export const mockActivities: ActivityItem[] = [
  { title: 'Completed Speaking Practice', titleZh: '完成口语练习', subtitle: 'RESTful API Design · 60s answer', date: 'Today' },
  { title: 'Finished Mock Interview', titleZh: '完成模拟面试', subtitle: 'Backend · Mid-level · Score 78', date: 'Jun 21' },
  { title: 'Mastered 12 new words', titleZh: '掌握 12 个新单词', subtitle: 'Cache & database vocabulary', date: 'Jun 20' },
  { title: 'Reviewed wrong answers', titleZh: '复习错题', subtitle: '3 items moved to mastered', date: 'Jun 19' },
];

export function getProfile() {
  return mockProfile;
}

export function getCoreSkills() {
  return mockCoreSkills;
}

export function getDomainSkills() {
  return mockDomainSkills;
}

export function getActivities() {
  return mockActivities;
}
