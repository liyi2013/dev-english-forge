export interface Question {
  id: string;
  question: string;
  questionZh: string;
  type: 'technical' | 'behavioral' | 'system-design';
  difficulty: 'easy' | 'medium' | 'hard';
  answerStructure: string;
  answerStructureZh: string;
  idealAnswer: string;
  keyPoints: string[];
  commonMistakes: string[];
  relatedTopics: string[];
}

export interface QuestionBank {
  slug: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  level: string;
  estimatedTime: string;
  questions: Question[];
}

export const mockQuestionBanks: QuestionBank[] = [
  {
    slug: 'backend',
    title: 'Backend',
    titleZh: '后端',
    description: 'Core backend development concepts including databases, APIs, caching, and distributed systems.',
    descriptionZh: '后端开发核心概念，包括数据库、API、缓存和分布式系统。',
    level: 'B2',
    estimatedTime: '45 min',
    questions: [
      {
        id: 'be-1',
        question: "Explain the difference between SQL and NoSQL databases. When would you choose each?",
        questionZh: "请解释 SQL 和 NoSQL 数据库的区别。什么情况下你会选择哪种？",
        type: 'technical',
        difficulty: 'medium',
        answerStructure: "Define both, compare key characteristics (schema, scalability, consistency), give use-case examples.",
        answerStructureZh: "先定义两者，比较关键特性（ schema、可扩展性、一致性），给出使用场景示例。",
        idealAnswer: "SQL databases use structured schemas with tables and relationships, enforcing ACID transactions. NoSQL databases offer flexible schemas, horizontal scaling, and various data models (document, key-value, column-family). I would choose SQL when data consistency and complex joins matter — for example, financial systems. I would choose NoSQL when we need rapid iteration, flexible data structures, or massive horizontal scaling — for example, real-time analytics or user session stores.",
        keyPoints: ["ACID vs BASE", "Schema flexibility", "Scaling approach", "Use-case driven choice"],
        commonMistakes: ["Calling NoSQL 'better' without context", "Ignoring consistency trade-offs", "Not mentioning specific NoSQL types"],
        relatedTopics: ["Database indexing", "CAP theorem", "Sharding strategies"],
      },
      {
        id: 'be-2',
        question: "How does Redis cache work? Describe a scenario where you'd use it.",
        questionZh: "Redis 缓存是如何工作的？描述一个你会使用它的场景。",
        type: 'technical',
        difficulty: 'medium',
        answerStructure: "Explain in-memory key-value store, TTL/expiration, common patterns (cache-aside, write-through). Give a concrete scenario.",
        answerStructureZh: "解释内存键值存储、TTL/过期机制、常见模式(cache-aside, write-through)。给出具体场景。",
        idealAnswer: "Redis is an in-memory data store that can be used as a cache. It supports various data structures (strings, hashes, lists, sets) and features like TTL expiration, persistence, and pub/sub. A common pattern is cache-aside: the application checks Redis first; on a miss, it loads from the database and populates the cache. I would use Redis to cache frequent database queries — for example, caching user profiles in a social media app to reduce database load from 10,000 QPS to a few hundred writes.",
        keyPoints: ["In-memory storage", "TTL and eviction policies", "Cache-aside pattern", "Concrete QPS improvement"],
        commonMistakes: ["Not mentioning eviction policy", "Confusing Redis with a primary database", "Missing TTL strategy"],
        relatedTopics: ["Cache invalidation", "Redis persistence", "Distributed caching"],
      },
      {
        id: 'be-3',
        question: "What is idempotency in REST APIs? Why does it matter?",
        questionZh: "REST API 中的幂等性是什么？为什么它很重要？",
        type: 'technical',
        difficulty: 'easy',
        answerStructure: "Define idempotency, classify HTTP methods, explain importance in distributed systems.",
        answerStructureZh: "定义幂等性，分类 HTTP 方法，解释在分布式系统中的重要性。",
        idealAnswer: "Idempotency means that making the same request multiple times produces the same result as making it once. In REST APIs, GET, PUT, DELETE, HEAD, OPTIONS are idempotent; POST is not. Idempotency matters in distributed systems because network failures can cause retries — without idempotency, a user might be charged twice or a resource duplicated. For example, a PUT request to update a user's email is idempotent — sending it twice just sets the same email again.",
        keyPoints: ["Definition of idempotency", "HTTP method classification", "Retry safety in distributed systems"],
        commonMistakes: ["Saying POST is idempotent", "Confusing idempotency with safety", "Not giving a concrete example"],
        relatedTopics: ["HTTP methods", "API design", "Distributed transactions"],
      },
      {
        id: 'be-4',
        question: "Describe how you would design a rate limiter for a high-traffic API.",
        questionZh: "请描述如何为高流量 API 设计一个限流器。",
        type: 'system-design',
        difficulty: 'hard',
        answerStructure: "Clarify requirements, propose algorithms (token bucket, sliding window), discuss distributed considerations, mention trade-offs.",
        answerStructureZh: "明确需求，提出算法（令牌桶、滑动窗口），讨论分布式考虑因素，提及权衡。",
        idealAnswer: "I would design a rate limiter using a sliding window log or token bucket algorithm. For a single-server setup, an in-memory counter works well. For distributed systems, I would use Redis with sorted sets or the sliding window counter pattern. Key decisions include: what to limit by (user ID, IP, API key), what response to return (429 with Retry-After header), and how to handle bursts. The token bucket algorithm is a good default because it allows bursts within limits. For example, 100 requests per minute with a bucket size of 20 allows short spikes.",
        keyPoints: ["Algorithm choice (token bucket, sliding window)", "Distributed vs single-server", "HTTP 429 response", "Burst handling"],
        commonMistakes: ["Ignoring distributed race conditions", "Not handling bursts", "Using exact counters without performance consideration"],
        relatedTopics: ["Redis sorted sets", "API gateway patterns", "Throttling vs rate limiting"],
      },
    ],
  },
  {
    slug: 'system-design',
    title: 'System Design',
    titleZh: '系统设计',
    description: 'Architecture and design of large-scale systems — scalability, reliability, and trade-offs.',
    descriptionZh: '大规模系统的架构与设计 — 可扩展性、可靠性和权衡。',
    level: 'B2+',
    estimatedTime: '60 min',
    questions: [
      {
        id: 'sd-1',
        question: "Design a URL shortener like TinyURL. How would you handle high read traffic?",
        questionZh: "设计一个类似 TinyURL 的短链接服务。如何处理高读取流量？",
        type: 'system-design',
        difficulty: 'hard',
        answerStructure: "Scope the system, propose data model, discuss read/write ratio, caching strategy, and database sharding.",
        answerStructureZh: "界定系统范围，提出数据模型，讨论读写比例、缓存策略和数据库分片。",
        idealAnswer: "A URL shortener needs to handle a high read-to-write ratio (often 100:1). For writes: generate a unique short key (base62 encoding of a distributed ID). For reads: use a cache-aside pattern with Redis — on a cache miss, look up the database and populate the cache. To handle high read traffic, I would use a CDN to cache redirect responses at edge locations, and add a Redis cluster with read replicas. The database could be sharded by the short key hash. TTL for cached entries should align with the expected access pattern.",
        keyPoints: ["Read-to-write ratio awareness", "Key generation (base62, distributed ID)", "Multi-layer caching (CDN, Redis)", "Database sharding"],
        commonMistakes: ["Not mentioning read-heavy nature", "Ignoring cache invalidation", "Single point of failure in key generation"],
        relatedTopics: ["Consistent hashing", "CDN architecture", "Distributed ID generation"],
      },
      {
        id: 'sd-2',
        question: "How would you design a real-time chat system for 10 million users?",
        questionZh: "如何设计一个支持 1000 万用户的实时聊天系统？",
        type: 'system-design',
        difficulty: 'hard',
        answerStructure: "Discuss WebSocket connections, message delivery, offline storage, and horizontal scaling approach.",
        answerStructureZh: "讨论 WebSocket 连接、消息投递、离线存储和水平扩展方案。",
        idealAnswer: "I would use WebSocket for real-time bidirectional communication, with a connection manager layer to handle millions of persistent connections. Messages go through a message queue (Kafka) for durability and ordered processing. For offline messages, store them in a time-series database (Cassandra). For horizontal scaling: use a load balancer to distribute WebSocket connections across servers, and a pub/sub system (Redis pub/sub or Kafka) to fan out messages to the correct server that holds the recipient's connection. Each chat room or conversation would be mapped to a partition key for consistent routing.",
        keyPoints: ["WebSocket connection management", "Message queue for durability", "Offline message storage", "Pub/sub for fan-out"],
        commonMistakes: ["Not handling reconnection gracefully", ["Ignoring message ordering guarantees", "Missing offline message strategy"]],
        relatedTopics: ["WebSocket scaling", "Kafka for messaging", "Eventually consistent systems"],
      },
      {
        id: 'sd-3',
        question: "Explain the CAP theorem. How does it affect distributed database design?",
        questionZh: "解释 CAP 定理。它如何影响分布式数据库设计？",
        type: 'system-design',
        difficulty: 'medium',
        answerStructure: "Define CAP (Consistency, Availability, Partition Tolerance), explain that you can only pick two, and discuss real-world trade-offs.",
        answerStructureZh: "定义 CAP（一致性、可用性、分区容错性），解释只能选两个，讨论实际权衡。",
        idealAnswer: "The CAP theorem states that a distributed system can only guarantee two of three properties: Consistency (every read returns the latest write), Availability (every request gets a response), and Partition Tolerance (the system continues despite network failures). In practice, partition tolerance is non-negotiable because networks fail. So the real trade-off is between CP and AP. CP systems (like traditional relational databases with strong consistency) sacrifice availability during a partition. AP systems (like Cassandra or DynamoDB) sacrifice consistency but remain available. The choice depends on the use case — financial transactions prefer CP, while social media feeds prefer AP.",
        keyPoints: ["CAP defined clearly", "Partition tolerance is mandatory", "CP vs AP trade-off", "Real-world examples"],
        commonMistakes: ["Saying you can have all three", "Not explaining why P is required", "Confusing CAP with ACID"],
        relatedTopics: ["PACELC theorem", "Consistency models", "Distributed consensus"],
      },
    ],
  },
  {
    slug: 'behavioral',
    title: 'Behavioral',
    titleZh: '行为面试',
    description: 'Answer behavioral questions using the STAR method — conflict, leadership, failure, and teamwork stories.',
    descriptionZh: '使用 STAR 法则回答行为面试问题 — 冲突、领导力、失败和团队合作故事。',
    level: 'B1',
    estimatedTime: '30 min',
    questions: [
      {
        id: 'bh-1',
        question: "Tell me about a time you disagreed with a teammate. How did you handle it?",
        questionZh: "请讲一个你与团队成员意见不合的经历。你是如何处理的分歧？",
        type: 'behavioral',
        difficulty: 'medium',
        answerStructure: "Use STAR: Situation (project context), Task (decision needed), Action (listened, proposed data-driven approach), Result (resolution and improved process).",
        answerStructureZh: "使用 STAR：Situation（项目背景）、Task（需要做的决策）、Action（倾听、提出数据驱动方案）、Result（解决结果和改进流程）。",
        idealAnswer: "Situation: Our team was debating whether to use MongoDB or PostgreSQL for a new analytics service. I preferred PostgreSQL for structured data, while a teammate advocated for MongoDB for faster iteration. Task: We needed to make a decision within a week. Action: I proposed we each write a small proof-of-concept with our preferred database and measure performance against our key queries. We spent two days prototyping and compared results. Result: PostgreSQL performed 40% better for our use case, so we chose it. More importantly, we agreed to use data-driven POCs for future technology decisions, which improved our team's decision-making process.",
        keyPoints: ["STAR structure", "Active listening", "Data-driven resolution", "Improved team process"],
        commonMistakes: ["Turning it into a complaint about the teammate", "Not mentioning your specific contribution", "Vague result without measurable outcome"],
        relatedTopics: ["Conflict resolution", "Team collaboration", "Technical decision-making"],
      },
      {
        id: 'bh-2',
        question: "Describe a project that failed. What did you learn?",
        questionZh: "描述一个失败的项目。你从中学到了什么？",
        type: 'behavioral',
        difficulty: 'easy',
        answerStructure: "Use STAR: Situation (project scope), Task (your responsibility), Action (what went wrong and why), Result (what you learned and applied).",
        answerStructureZh: "使用 STAR：Situation（项目范围）、Task（你的职责）、Action（哪里出了问题）、Result（学到的教训和后续应用）。",
        idealAnswer: "Situation: I led a feature to migrate our legacy API to a new stack, estimated at 4 weeks. Task: Coordinate migration with zero downtime. Action: We underestimated the data migration complexity, and testing was insufficient because we didn't set up a proper staging environment. The migration caused a 2-hour downtime. Result: We rolled back and re-planned with a proper staging environment, incremental migration strategy, and automated testing. The second attempt succeeded with zero downtime. I learned to always validate assumptions with a spike first, and never skip staging environment testing.",
        keyPoints: ["Own the failure", ["Specific lessons learned", "Applied improvement"]],
        commonMistakes: ["Blaming others", ["Not taking responsibility", "Vague lessons"]],
        relatedTopics: ["Project management", "Risk mitigation", "Post-mortem culture"],
      },
      {
        id: 'bh-3',
        question: "Give an example of when you had to learn a new technology quickly. How did you approach it?",
        questionZh: "请举例说明你何时需要快速学习一项新技术。你是怎么做的？",
        type: 'behavioral',
        difficulty: 'easy',
        answerStructure: "Use STAR: Situation (project requirement), Task (learn new tech fast), Action (structured learning plan), Result (successful delivery).",
        answerStructureZh: "使用 STAR：Situation（项目需求）、Task（快速学习新技术）、Action（结构化学习计划）、Result（成功交付）。",
        idealAnswer: "Situation: Our team needed to implement a real-time notification system using WebSockets, but no one had experience with it. Task: I volunteered to learn and build the prototype in two weeks. Action: I spent the first 3 days on fundamentals (tutorials, MDN docs), then built a small proof-of-concept with a simple chat app. I paired with a senior engineer for code review on the WebSocket handling. Result: I delivered the notification system on schedule — it handled 5,000 concurrent connections in production. Learning a new tech quickly taught me to focus on fundamentals first, then build iteratively.",
        keyPoints: ["Clear learning strategy", "Hands-on POC", "Seeking mentorship", "On-time delivery"],
        commonMistakes: ["Claiming you learned it overnight", ["Not mentioning specific resources or methods", "No measurable outcome"]],
        relatedTopics: ["Learning strategies", ["Rapid prototyping", "Technical mentorship"]] as unknown as string[],
      },
    ],
  },
];

export function getQuestionBanks(): QuestionBank[] {
  return mockQuestionBanks;
}

export function getQuestionBankBySlug(slug: string): QuestionBank | undefined {
  return mockQuestionBanks.find((b) => b.slug === slug);
}
