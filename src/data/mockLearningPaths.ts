import type { LearningPath } from '@/types/learning';

export const mockLearningPaths: LearningPath[] = [
  {
    id: 'backend-english',
    slug: 'backend-english',
    icon: 'Code2',
    name: 'Backend English',
    nameZh: '后端英语',
    desc: 'Talk about APIs, databases, and services in English.',
    descZh: '学会用英语讨论 API、数据库和服务。',
    milestone: 'Explain a backend project end-to-end in 3 min.',
    milestoneZh: '里程碑：用 3 分钟从头到尾解释一个后端项目。',
    modules: [
      { name: 'RESTful API', nameZh: 'RESTful API', status: 'completed' },
      { name: 'Database', nameZh: '数据库', status: 'completed' },
      { name: 'Redis Cache', nameZh: 'Redis 缓存', status: 'in_progress', progress: 50 },
      { name: 'RabbitMQ', nameZh: 'RabbitMQ 消息队列', status: 'locked' },
    ],
    topicSlugs: ['restful-api', 'database', 'redis-cache', 'rabbitmq'],
  },
  {
    id: 'interview-english',
    slug: 'interview-english',
    icon: 'MessageSquareCode',
    name: 'Interview English',
    nameZh: '面试英语',
    desc: 'Self-introduction, project stories, technical Q&A.',
    descZh: '自我介绍、项目经验、技术问答。',
    milestone: 'Pass a mid-level mock interview with score ≥ 80.',
    milestoneZh: '里程碑：通过中级模拟面试，分数 80 以上。',
    modules: [
      { name: 'Self-introduction', nameZh: '自我介绍', status: 'completed' },
      { name: 'Project story (STAR)', nameZh: '项目经历 (STAR)', status: 'in_progress', progress: 35 },
      { name: 'System design Q&A', nameZh: '系统设计问答', status: 'next' },
      { name: 'Behavioral deep dive', nameZh: '行为问题深挖', status: 'locked' },
    ],
    topicSlugs: ['restful-api', 'redis-cache', 'database'],
  },
  {
    id: 'workplace-english',
    slug: 'workplace-english',
    icon: 'Briefcase',
    name: 'Workplace English',
    nameZh: '职场英语',
    desc: 'Emails, standups, code review, daily collaboration.',
    descZh: '邮件、站会、代码评审、日常协作。',
    milestone: 'Run a 15-min standup in English.',
    milestoneZh: '里程碑：用英语主持 15 分钟站会。',
    modules: [
      { name: 'Daily standup', nameZh: '每日站会', status: 'in_progress', progress: 20 },
      { name: 'Code review comments', nameZh: '代码评审评论', status: 'next' },
      { name: 'Async writing (Slack/email)', nameZh: '异步写作 (Slack/邮件)', status: 'locked' },
      { name: 'Disagree politely', nameZh: '礼貌表达反对意见', status: 'locked' },
    ],
    topicSlugs: [],
  },
];

export function getLearningPaths() {
  return mockLearningPaths;
}
