export interface Notification {
  id: string;
  type: 'learning-reminder' | 'report-ready' | 'review-due' | 'streak-reminder';
  title: string;
  titleZh: string;
  message: string;
  messageZh: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'learning-reminder',
    title: 'Daily Learning Reminder',
    titleZh: '每日学习提醒',
    message: 'You have a technical English topic waiting: RESTful API Design. 15 minutes today keeps your skills sharp.',
    messageZh: '你有一个技术英语主题待学习：RESTful API 设计。每天 15 分钟，保持技能敏锐。',
    read: false,
    createdAt: '2026-06-24T08:00:00',
    link: '/technical-english/restful-api',
  },
  {
    id: 'notif-2',
    type: 'report-ready',
    title: 'Interview Report Ready',
    titleZh: '面试报告已生成',
    message: 'Your backend mock interview report is ready. Score: 72/100. Check your weak areas and practice.',
    messageZh: '你的后端模拟面试报告已生成。评分：72/100。查看薄弱环节并练习。',
    read: false,
    createdAt: '2026-06-23T14:30:00',
    link: '/ai-interview/report/report-1',
  },
  {
    id: 'notif-3',
    type: 'review-due',
    title: 'Review Items Due',
    titleZh: '复习到期提醒',
    message: '4 review items are due today. Spaced repetition helps you remember longer.',
    messageZh: '今天有 4 个复习项到期。间隔重复有助于长期记忆。',
    read: false,
    createdAt: '2026-06-24T06:00:00',
    link: '/review',
  },
  {
    id: 'notif-4',
    type: 'streak-reminder',
    title: '12-Day Streak!',
    titleZh: '连续学习 12 天！',
    message: 'Great job keeping your streak alive! You have studied for 12 consecutive days.',
    messageZh: '太棒了，继续保持连续学习！你已经连续学习 12 天了。',
    read: true,
    createdAt: '2026-06-23T20:00:00',
  },
  {
    id: 'notif-5',
    type: 'report-ready',
    title: 'Practice Result Saved',
    titleZh: '练习结果已保存',
    message: 'Your practice session for "Explain your recent project" has been saved. Check your progress in Review.',
    messageZh: '"解释你的最近项目" 的练习结果已保存。前往复盘查看进度。',
    read: true,
    createdAt: '2026-06-22T16:45:00',
    link: '/review',
  },
];

export function getNotifications(): Notification[] {
  return mockNotifications;
}
