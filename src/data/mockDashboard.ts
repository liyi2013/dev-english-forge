export interface DashboardData {
  greetingName: string;
  todayFocus: {
    title: string;
    titleZh: string;
    description: string;
    descriptionZh: string;
    duration: string;
    route: string;
  };
  continueLearning: {
    path: string;
    pathZh: string;
    unit: string;
    title: string;
    titleZh: string;
    next: string;
    nextZh: string;
    progress: number;
    route: string;
  };
  todayPlan: {
    items: Array<{
      label: string;
      labelZh: string;
      done: boolean;
    }>;
  };
  weakSkills: Array<{
    tag: string;
    level: number;
  }>;
  recommended: Array<{
    tag: string;
    tagZh: string;
    title: string;
    titleZh: string;
    time: string;
    route: string;
    isPromoted?: boolean;
  }>;
  streak: {
    current: number;
    best: number;
    weekActive: number;
    weekTotal: number;
    daily: number[];
  };
  level: {
    current: string;
    next: string;
    progress: number;
    improvement: string;
  };
  upcoming: {
    title: string;
    titleZh: string;
    subtitle: string;
    subtitleZh: string;
    route: string;
  };
}

export const mockDashboard: DashboardData = {
  greetingName: 'Jinlin',
  todayFocus: {
    title: 'Explain Redis cache problems in English.',
    titleZh: '用英语解释 Redis 缓存问题',
    description: 'Speaking + Vocabulary',
    descriptionZh: '口语 + 词汇',
    duration: '~12 分钟',
    route: '/technical-english/redis-cache',
  },
  continueLearning: {
    path: 'Technical English',
    pathZh: '技术英语',
    unit: 'Unit 4 of 8',
    title: 'RESTful API Design',
    titleZh: 'RESTful API 设计',
    next: 'Speaking Practice — Explain endpoints in 60 seconds.',
    nextZh: '下一个：口语练习 —— 用 60 秒解释端点。',
    progress: 65,
    route: '/technical-english/restful-api',
  },
  todayPlan: {
    items: [
      { label: 'Review 10 technical words', labelZh: '复习 10 个技术词汇', done: true },
      { label: 'Practice 1 interview answer', labelZh: '练习 1 个面试回答', done: false },
      { label: 'Read 1 short technical paragraph', labelZh: '阅读 1 段技术短文', done: false },
    ],
  },
  weakSkills: [
    { tag: 'System Design vocabulary', level: 38 },
    { tag: 'Past tense in project stories', level: 52 },
    { tag: 'Cache & database terms', level: 44 },
  ],
  recommended: [
    {
      tag: 'AI Interview',
      tagZh: 'AI 面试',
      title: 'Practice a backend mock interview',
      titleZh: '练习后端模拟面试',
      time: '30 min',
      route: '/ai-interview',
      isPromoted: true,
    },
    {
      tag: 'Workplace',
      tagZh: '职场',
      title: 'Daily Standup Expressions',
      titleZh: '每日站会表达',
      time: '6 min',
      route: '/workplace-english',
    },
    {
      tag: 'Technical',
      tagZh: '技术',
      title: 'Redis Cache 缓存',
      titleZh: 'Redis 缓存',
      time: '10 min',
      route: '/technical-english/redis-cache',
    },
  ],
  streak: {
    current: 12,
    best: 21,
    weekActive: 5,
    weekTotal: 7,
    daily: [1, 1, 1, 1, 1, 0.4, 0],
  },
  level: {
    current: 'B1+',
    next: 'B2',
    progress: 68,
    improvement: '+6% from last month',
  },
  upcoming: {
    title: 'Mock interview — Backend',
    titleZh: '模拟面试 — 后端',
    subtitle: 'Tomorrow · 8:00 PM · 30 min',
    subtitleZh: '明天 · 晚上 8:00 · 30 分钟',
    route: '/ai-interview',
  },
};

export function getDashboardData() {
  return mockDashboard;
}
