export interface TechnicalPath {
  slug: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  level: string;
  progress: number;
  outcome: string;
  outcomeZh: string;
  topicSlugs: string[];
}

export const mockTechnicalPaths: TechnicalPath[] = [
  {
    slug: 'backend-english',
    name: 'Backend English',
    nameZh: '后端英语',
    description: 'Talk about APIs, databases, and services in English.',
    descriptionZh: '学会用英语讨论 API、数据库和服务。',
    level: 'B1',
    progress: 48,
    outcome: 'Explain endpoints, status codes, and idempotency in English with confidence.',
    outcomeZh: '能够自信地用英语解释端点、状态码和幂等性。',
    topicSlugs: ['restful-api', 'database', 'redis-cache', 'rabbitmq'],
  },
  {
    slug: 'system-design-english',
    name: 'System Design English',
    nameZh: '系统设计英语',
    description: 'Architecture, scaling, trade-offs, and design discussions.',
    descriptionZh: '讨论架构、扩展、权衡和系统设计。',
    level: 'B2',
    progress: 22,
    outcome: 'Describe database sharding, caching strategies, and message queues professionally.',
    outcomeZh: '能够专业地描述数据库分片、缓存策略和消息队列。',
    topicSlugs: ['database', 'redis-cache', 'rabbitmq'],
  },
  {
    slug: 'devops-english',
    name: 'DevOps English',
    nameZh: 'DevOps 英语',
    description: 'CI/CD, Docker, Kubernetes, and infrastructure discussions.',
    descriptionZh: '讨论 CI/CD、Docker、Kubernetes 和基础设施。',
    level: 'B1',
    progress: 11,
    outcome: 'Explain containerization, pipeline automation, and deployment strategies in English.',
    outcomeZh: '能够用英语解释容器化、流水线自动化和部署策略。',
    topicSlugs: ['docker', 'cicd'],
  },
];

export function getTechnicalPaths(): TechnicalPath[] {
  return mockTechnicalPaths;
}

export function getTechnicalPathBySlug(slug: string): TechnicalPath | undefined {
  return mockTechnicalPaths.find((p) => p.slug === slug);
}
