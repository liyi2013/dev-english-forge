export interface StarExample {
  id: string;
  title: string;
  titleZh: string;
  category: 'project-experience' | 'conflict-resolution' | 'leadership' | 'failure' | 'achievement';
  tags: string[];
  situation: string;
  situationZh: string;
  task: string;
  taskZh: string;
  action: string;
  actionZh: string;
  result: string;
  resultZh: string;
  keyTakeaway: string;
  keyTakeawayZh: string;
}

export const mockStarExamples: StarExample[] = [
  {
    id: 'star-1',
    title: 'Improving API Response Time',
    titleZh: '优化 API 响应速度',
    category: 'project-experience',
    tags: ['Performance', 'API', 'Backend'],
    situation: 'Our e-commerce platform had a product listing API that took 3 seconds to respond during peak traffic. Users were complaining about slow page loads, and our conversion rate was dropping.',
    situationZh: '我们的电商平台在产品列表 API 在高峰流量时需要 3 秒才能响应。用户抱怨页面加载缓慢，转化率持续下降。',
    task: 'I needed to identify the bottleneck and reduce API response time to under 500ms without changing the frontend code or adding significant infrastructure cost.',
    taskZh: '我需要找出瓶颈并将 API 响应时间降低到 500 毫秒以下，同时不需要修改前端代码或增加大量基础设施成本。',
    action: 'First, I profiled the API using distributed tracing and found that 80% of response time was from repeated database queries. I implemented a Redis cache-aside layer for product data with a 5-minute TTL. Then I optimized the SQL queries by adding composite indexes on frequently filtered columns. I also added connection pooling to reduce connection overhead. After the changes, I ran load tests to verify the improvement.',
    actionZh: '首先，我使用分布式追踪工具分析了 API，发现 80% 的响应时间来自重复的数据库查询。我实现了 Redis cache-aside 缓存层，为商品数据设置 5 分钟 TTL。然后我通过添加复合索引来优化 SQL 查询。我还增加了连接池以减少连接开销。改动之后，我运行了压力测试来验证效果。',
    result: 'API response time dropped from 3 seconds to 200ms (93% improvement). Server CPU usage decreased by 60%. The team adopted Redis caching as a standard pattern for read-heavy endpoints. Quarterly conversion rate improved by 15%, partly attributed to the faster page loads.',
    resultZh: 'API 响应时间从 3 秒降至 200 毫秒（提升 93%）。服务器 CPU 使用率降低 60%。团队将 Redis 缓存采纳为读取密集型接口的标准模式。季度转化率提升 15%，部分归功于更快的页面加载速度。',
    keyTakeaway: 'Always measure before optimizing. The database was the bottleneck, not the application code. A simple caching layer had outsized impact.',
    keyTakeawayZh: '优化前一定要做测量。数据库才是瓶颈，不是应用代码。一个简单的缓存层就能产生巨大的效果。',
  },
  {
    id: 'star-2',
    title: 'Resolving Architecture Disagreement',
    titleZh: '解决架构方案分歧',
    category: 'conflict-resolution',
    tags: ['Teamwork', 'Architecture', 'Communication'],
    situation: 'During the design of a new microservice, two senior engineers had a strong disagreement about whether to use event-driven architecture or RESTful APIs. The debate had been going on for two weeks with no resolution, blocking the project timeline.',
    situationZh: '在设计一个新的微服务时，两位高级工程师对于使用事件驱动架构还是 RESTful API 产生了严重分歧。争论持续了两周没有结果，导致项目进度受阻。',
    task: 'As the tech lead, I needed to facilitate a decision that the whole team could support, without creating resentment or slowing down the project further.',
    taskZh: '作为技术负责人，我需要引导团队做出所有人都能支持的决策，同时不引发负面情绪或进一步拖延项目进度。',
    action: 'I scheduled a structured decision-making meeting. First, I asked each engineer to prepare a one-page document comparing both approaches against our specific requirements: scalability, team expertise, and time-to-market. In the meeting, we evaluated each approach against these criteria. I encouraged both sides to acknowledge valid points from the other. We discovered that a hybrid approach — RESTful APIs for synchronous requests and event-driven for asynchronous processing — satisfied most requirements. We agreed to start with REST and add event-driven components incrementally.',
    actionZh: '我组织了一次结构化的决策会议。首先，我请两位工程师各准备一页纸的文档，根据我们的具体需求（可扩展性、团队经验、上市时间）对比两种方案。会议上，我们按照这些标准逐一评估。我鼓励双方承认对方方案的合理之处。最终我们发现混合方案 —— 同步请求用 REST、异步处理用事件驱动 —— 能满足大部分需求。我们决定先用 REST 实现，再逐步添加事件驱动组件。',
    result: 'The hybrid architecture was adopted. The first phase delivered on schedule. The event-driven component was added in the next sprint for the notification service. Both engineers felt heard, and the team established a structured decision-making process for future architecture discussions.',
    resultZh: '最终采用了混合架构。第一阶段按计划交付。事件驱动组件在下一个迭代中添加到了通知服务。两位工程师都觉得自己的意见被听取了，团队也建立了未来架构决策的结构化流程。',
    keyTakeaway: 'When technical disagreements stall progress, shift the conversation from opinions to measurable criteria. A hybrid compromise can often capture the best of both approaches.',
    keyTakeawayZh: '当技术分歧阻碍进度时，把对话从"观点"转向"可衡量的标准"。混合方案往往能兼顾两种方法的最佳部分。',
  },
  {
    id: 'star-3',
    title: 'Leading a Database Migration',
    titleZh: '主导数据库迁移项目',
    category: 'leadership',
    tags: ['Leadership', 'Database', 'Migration'],
    situation: 'Our team was using a legacy SQL database that was becoming expensive and hard to scale. The company decided to migrate to a cloud-native distributed database, but the team had no experience with the new technology.',
    situationZh: '我们团队使用的 legacy SQL 数据库越来越昂贵且难以扩展。公司决定迁移到云原生分布式数据库，但团队对新技术没有经验。',
    task: 'I volunteered to lead the migration. My task was to complete the migration with zero downtime, minimal performance impact, and ensure the team could maintain the new system afterward.',
    taskZh: '我主动请缨主导迁移工作。我的任务是在零停机、最小性能影响的前提下完成迁移，并确保团队后续能维护新系统。',
    action: 'I started by creating a detailed migration plan with rollback checkpoints. I set up a parallel-running phase where both databases served reads simultaneously. I organized knowledge-sharing sessions — I learned the new technology first, then taught three team members, who each taught two more. We used feature flags to gradually migrate traffic. Each migration step had automated validation scripts. I scheduled the final cutover for low-traffic hours with a 30-minute rollback window.',
    actionZh: '我首先制定了详细的迁移计划，包含回滚检查点。我搭建了并行运行阶段，两个数据库同时处理读取请求。我组织了知识分享会——我先学习新技术，然后教给三位团队成员，每人再教两个人。我们使用功能开关逐步迁移流量。每个迁移步骤都有自动验证脚本。我将最终切换安排在低峰时段，预留 30 分钟回滚窗口。',
    result: 'Migration completed in 6 weeks with zero downtime. Database costs reduced by 40%. All eight team members could independently operate the new database. The migration playbook was reused by two other teams.',
    resultZh: '迁移在 6 周内完成，零停机。数据库成本降低 40%。全部 8 名团队成员都能独立运维新数据库。迁移手册被另外两个团队复用。',
    keyTakeaway: 'A knowledge multiplier approach — teach a few who teach others — scales expertise faster than trying to train everyone yourself. Always have a rollback plan.',
    keyTakeawayZh: '"知识倍增"策略 —— 教几个人，让他们再教别人 —— 比一个人培训所有人更快地扩展团队 expertise。永远要有回滚计划。',
  },
  {
    id: 'star-4',
    title: 'Learning from a Deployment Failure',
    titleZh: '从部署失败中学习',
    category: 'failure',
    tags: ['Failure', 'CI/CD', 'Testing'],
    situation: 'I deployed a configuration change to production that accidentally disabled authentication for a public API endpoint. The issue went unnoticed for 45 minutes, during which unauthorized users could access sensitive data.',
    situationZh: '我向生产环境部署了一项配置变更，不小心禁用了某个公开 API 端点的认证功能。问题持续了 45 分钟未被发现，期间未授权用户可以访问敏感数据。',
    task: 'I needed to fix the issue immediately, assess the impact, and implement safeguards to prevent it from happening again. I also needed to maintain the team\'s trust in the deployment process.',
    taskZh: '我需要立即修复问题、评估影响，并实施防护措施防止再次发生。同时还要维护团队对部署流程的信任。',
    action: 'Immediately, I rolled back the change and verified authentication was restored. I ran a security audit to confirm no data was leaked (it wasn\'t — the endpoint returned cached data only). Then I added automated integration tests that verify authentication headers are enforced on every production deployment. I also implemented a canary deployment process — changes go to 5% of traffic first, with automatic rollback if error rates spike.',
    actionZh: '立即回滚变更并验证认证功能已恢复。我运行了安全审计确认没有数据泄露（只是返回了缓存数据）。然后我添加了自动化集成测试，每次生产部署都会验证认证头是否正确配置。我还实现了灰度部署流程 —— 变更先部署到 5% 的流量，如果错误率飙升则自动回滚。',
    result: 'The fix was applied within 10 minutes. No data breach occurred. Authentication integration tests caught a similar issue in a pull request two weeks later. The canary deployment process became the standard for all production changes.',
    resultZh: '10 分钟内完成修复。没有发生数据泄露。两周后，认证集成测试在一次 PR 中发现了类似问题。灰度部署流程成为所有生产变更的标准流程。',
    keyTakeaway: 'Every failure is an opportunity to improve your systems. The goal is not "zero failures" but "fail fast, recover quickly, and prevent recurrence."',
    keyTakeawayZh: '每次失败都是改进系统的机会。目标不是"零失败"，而是"快速失败、快速恢复、防止复发"。',
  },
  {
    id: 'star-5',
    title: 'Turning Around a Struggling Project',
    titleZh: '扭转陷入困境的项目',
    category: 'achievement',
    tags: ['Leadership', 'Project Management', 'Delivery'],
    situation: 'A critical project was two months behind schedule, the team was demoralized, and stakeholders were considering canceling it. The project aimed to rebuild our customer-facing analytics dashboard.',
    situationZh: '一个关键项目落后进度两个月，团队士气低落，利益相关方正在考虑取消项目。该项目旨在重建面向客户的分析仪表盘。',
    task: 'I was asked to take over as the new tech lead and deliver the project within three months — half the original remaining timeline.',
    taskZh: '我被任命为新的技术负责人，需要在三个月内交付项目 —— 是原计划剩余时间的一半。',
    action: 'First, I conducted a retrospective to understand what went wrong: unclear requirements, too many features in scope, and poor estimation. I worked with stakeholders to define an MVP with only the essential features. We adopted a two-week sprint cycle with demo at the end of each sprint. I protected the team from scope creep and removed blockers daily. I also introduced pair programming for complex modules to share knowledge and improve code quality.',
    actionZh: '首先，我做了 retrospect 来了解问题所在：需求不明确、功能范围过大、估算不准。我与利益相关方一起定义了只包含核心功能的 MVP。我们采用两周迭代周期，每个迭代末做演示。我保护团队免受需求变更干扰，每天处理阻塞项。我还引入了结对编程来处理复杂模块。',
    result: 'The MVP was delivered in 10 weeks — two weeks ahead of the revised schedule. User satisfaction score was 4.2/5. The team\'s morale improved significantly. Three out of five planned post-MVP features were built by the team voluntarily because they were motivated by the early success.',
    resultZh: 'MVP 在 10 周内交付 —— 比修订后的计划提前两周。用户满意度评分 4.2/5。团队士气大幅提升。五个计划中三个 MVP 后功能由团队自发完成，因为他们被早期成功所激励。',
    keyTakeaway: 'When a project is in trouble, narrow the scope to the essentials. Nothing builds momentum like a shipped product. Protect the team, not the original plan.',
    keyTakeawayZh: '当项目陷入困境时，把范围缩小到最核心的功能。没有什么比交付产品更能建立势头。保护团队，而不是保护原计划。',
  },
];

export function getStarExamples(): StarExample[] {
  return mockStarExamples;
}

export function getStarExampleById(id: string): StarExample | undefined {
  return mockStarExamples.find((e) => e.id === id);
}
