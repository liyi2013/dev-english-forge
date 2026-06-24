import type { LearningTopic } from '@/types/learning';

export const mockTopics: LearningTopic[] = [
  {
    slug: 'restful-api',
    title: 'RESTful API',
    titleZh: 'RESTful API 设计',
    explainGoal: 'Explain endpoints, status codes, and idempotency in English.',
    explainGoalZh: '学会用英语解释端点、状态码和幂等性。',
    level: 'B1',
    progress: 65,
    unit: 4,
    totalUnits: 8,
    readingParagraph: `A RESTful API uses HTTP methods to expose resources. Each endpoint represents a resource, such as users, orders, or products. A good API should return clear status codes and keep operations predictable.
For example, GET retrieves data, POST creates a new resource, PUT updates a resource in an idempotent way, and DELETE removes a resource. Status codes like 200 OK, 201 Created, 400 Bad Request, and 404 Not Found help clients understand the result of their requests.
Idempotency means that making the same request multiple times produces the same result. PUT and DELETE are idempotent, while POST is not. This is important when building reliable distributed systems.`,
    keyPoints: [
      'endpoint',
      'status code',
      'idempotent',
      'HTTP methods (GET/POST/PUT/DELETE)',
    ],
    vocabulary: [
      {
        term: 'endpoint',
        pronunciation: '/ˈendpɔɪnt/',
        definitionEn: 'A URL where an API resource can be accessed.',
        definitionZh: 'API 的资源访问入口。',
        exampleSentence: 'The /users endpoint returns a list of all registered users.',
      },
      {
        term: 'idempotent',
        pronunciation: '/ˌaɪdɛmˈpoʊtənt/',
        definitionEn: 'An operation that produces the same result no matter how many times it is executed.',
        definitionZh: '无论执行多少次，结果都相同的操作。',
        exampleSentence: 'PUT requests are idempotent, so sending the same update twice is safe.',
      },
      {
        term: 'status code',
        pronunciation: '/ˈsteɪtəs koʊd/',
        definitionEn: 'A three-digit number returned by the server indicating the result of a request.',
        definitionZh: '服务器返回的三位数代码，表示请求的处理结果。',
        exampleSentence: 'A 404 status code means the requested resource was not found.',
      },
      {
        term: 'resource',
        pronunciation: '/ˈriːsɔːrs/',
        definitionEn: 'An object or representation of data that can be accessed via an API.',
        definitionZh: '可以通过 API 访问的数据对象或表示。',
        exampleSentence: 'Each resource in the API has a unique identifier.',
      },
    ],
    sentencePatterns: [
      {
        pattern: 'This endpoint is used to ___ .',
        meaningZh: '这个端点的作用是 ___ 。',
        example: 'This endpoint is used to fetch user profile data.',
      },
      {
        pattern: 'The API returns a ___ status code when ___ .',
        meaningZh: '当 ___ 时，API 返回 ___ 状态码。',
        example: 'The API returns a 201 status code when a new resource is created.',
      },
      {
        pattern: '___ is idempotent, which means ___ .',
        meaningZh: '___ 是幂等的，这意味着 ___ 。',
        example: 'PUT is idempotent, which means calling it multiple times has the same effect as calling it once.',
      },
    ],
    speakingPrompt: {
      prompt: 'Explain what a RESTful API is in 60 seconds. Include what endpoints, HTTP methods, and status codes are.',
      promptZh: '用 60 秒解释什么是 RESTful API，包括端点、HTTP 方法和状态码。',
      durationSeconds: 60,
    },
    interviewQuestion: {
      question: 'Can you explain the difference between PUT and POST?',
      idealAnswer: 'PUT and POST are both HTTP methods used to send data to a server, but they differ in idempotency and intent. PUT is idempotent — calling it multiple times produces the same result. It is typically used to update an existing resource or create one at a specific URL. POST is not idempotent — calling it multiple times may create multiple resources. It is typically used to submit new data, such as creating a new order or user. In RESTful design, PUT replaces a resource, while POST creates a subordinate resource.',
      commonMistakes: [
        'Confusing PUT with POST on idempotency',
        'Saying PUT always creates (it updates by default)',
        'Not mentioning idempotency at all',
      ],
      keyPoints: [
        'PUT is idempotent, POST is not',
        'PUT replaces a resource, POST creates a subordinate',
        'Use PUT for updates, POST for new resources',
      ],
    },
    commonMistakes: [
      'Calling every API endpoint a "route" in conversation',
      'Forgetting to mention status codes when describing API behavior',
      'Confusing idempotency with safety',
    ],
    understandingCheck: {
      question: "What does idempotent mean in RESTful API design?",
      questionZh: "在 RESTful API 设计中，幂等是什么意思？",
      keywords: ["same", "multiple", "request", "result", "repeat"],
      successFeedback: "Great. Idempotency means repeated requests produce the same result.",
      failureHint: "Hint: Think about what happens when the same request is sent multiple times."
    },
  },
  {
    slug: 'redis-cache',
    title: 'Redis Cache',
    titleZh: 'Redis Cache 缓存',
    explainGoal: 'Explain cache hit rate, eviction, hot keys, and cache penetration in English.',
    explainGoalZh: '学会用英语解释缓存命中率、淘汰策略、热键和缓存穿透。',
    level: 'B2',
    progress: 30,
    unit: 3,
    totalUnits: 6,
    readingParagraph: `Redis is an in-memory data store commonly used as a cache to improve application performance. When a client requests data, the application first checks Redis. If the data exists — a cache hit — it is returned immediately. If not — a cache miss — the application fetches the data from the database and stores it in Redis for future requests.
The cache hit rate is the percentage of requests served directly from the cache. A high hit rate means the cache is working well. When the hit rate drops, you need to investigate: Are keys expiring too quickly? Is there a hot key receiving too much traffic? Is the eviction policy discarding useful data?
Redis supports several eviction policies like LRU (Least Recently Used) and LFU (Least Frequently Used). These determine which keys to remove when memory is full. Understanding these policies helps you design a cache that performs well under load.`,
    keyPoints: [
      'cache hit / cache miss',
      'cache hit rate',
      'eviction policy (LRU, LFU)',
      'hot key',
      'cache penetration',
    ],
    vocabulary: [
      {
        term: 'cache hit rate',
        pronunciation: '/kæʃ hɪt reɪt/',
        definitionEn: 'The percentage of requests served directly from the cache.',
        definitionZh: '直接从缓存中处理的请求百分比。',
        exampleSentence: 'Our cache hit rate dropped to 60% after the traffic spike.',
      },
      {
        term: 'eviction policy',
        pronunciation: '/ɪˈvɪkʃən ˈpɑləsi/',
        definitionEn: 'The rule that decides which keys to remove when the cache is full.',
        definitionZh: '当缓存满时决定移除哪些键的规则。',
        exampleSentence: 'We use an LRU eviction policy so the least recently used data is removed first.',
      },
      {
        term: 'hot key',
        pronunciation: '/hɒt kiː/',
        definitionEn: 'A single key that receives a disproportionately large share of traffic.',
        definitionZh: '接收不成比例的大量流量访问的单个键。',
        exampleSentence: 'The trending products key became a hot key and caused a bottleneck.',
      },
      {
        term: 'cache penetration',
        pronunciation: '/kæʃ ˌpenɪˈtreɪʃən/',
        definitionEn: 'When requests repeatedly query data that does not exist, bypassing the cache.',
        definitionZh: '请求反复查询不存在的数据，绕过缓存直达数据库。',
        exampleSentence: 'We use a Bloom filter to prevent cache penetration attacks.',
      },
      {
        term: 'TTL',
        pronunciation: '/tiː tiː ɛl/',
        definitionEn: 'Time To Live — how long a cached value stays valid before it expires.',
        definitionZh: '存活时间 —— 缓存值在过期前保持有效的时长。',
        exampleSentence: 'Setting a reasonable TTL prevents stale data from being served.',
      },
    ],
    sentencePatterns: [
      {
        pattern: 'The cache hit rate dropped because ___ .',
        meaningZh: '缓存命中率下降是因为 ___ 。',
        example: 'The cache hit rate dropped because many keys expired at the same time.',
      },
      {
        pattern: 'We use ___ eviction policy to ___ .',
        meaningZh: '我们使用 ___ 淘汰策略来 ___ 。',
        example: 'We use LRU eviction policy to keep frequently accessed data in memory.',
      },
      {
        pattern: 'To prevent cache penetration, we ___ .',
        meaningZh: '为了防止缓存穿透，我们 ___ 。',
        example: 'To prevent cache penetration, we validate the request before querying the cache.',
      },
    ],
    speakingPrompt: {
      prompt: 'Explain how you would troubleshoot a Redis cache hit rate drop. What steps would you take?',
      promptZh: '解释你会如何排查 Redis 缓存命中率下降的问题。你会采取哪些步骤？',
      durationSeconds: 90,
    },
    interviewQuestion: {
      question: 'If Redis cache hit rate drops, how would you investigate it?',
      idealAnswer: "I would start by checking our monitoring dashboard — specifically the hit rate, latency, and eviction count — to see when the drop began. Once I know the timing, I would look for hot keys or a traffic spike that could explain it. Then I would review the TTL and eviction policy in case useful keys are being dropped too aggressively. If the cluster itself looks unhealthy, I would verify replication and have a fallback path to the database with rate limiting, so we degrade gracefully instead of overloading the DB.",
      commonMistakes: [
        'Jumping to solutions before observing metrics',
        'Not mentioning hot keys or traffic patterns',
        'Forgetting to discuss fallback strategy',
      ],
      keyPoints: [
        'Check monitoring metrics first',
        'Identify hot keys and traffic spikes',
        'Review TTL and eviction policy',
        'Plan fallback to database',
      ],
    },
    commonMistakes: [
      'Using cache as the primary data store',
      'Setting TTL too short or too long without analysis',
      'Not monitoring cache hit rate in production',
    ],
    understandingCheck: {
      question: "Why does cache hit rate matter?",
      questionZh: "为什么缓存命中率很重要？",
      keywords: ["hit rate", "performance", "cache", "efficient"],
      successFeedback: "Correct! Cache hit rate directly impacts application performance.",
      failureHint: "Think about the cost of cache misses vs hits."
    },
  },
  {
    slug: 'database',
    title: 'Database',
    titleZh: '数据库',
    explainGoal: 'Discuss indexes, transactions, and join trade-offs in a design review.',
    explainGoalZh: '学会在设计评审中用英语讨论索引、事务和表连接的权衡。',
    level: 'B2',
    progress: 40,
    unit: 2,
    totalUnits: 6,
    readingParagraph: `Databases are at the core of most backend systems. When designing a database schema, you need to consider indexes, transactions, and query performance.
An index is a data structure that speeds up data retrieval. However, indexes come with a trade-off: they make read operations faster but write operations slower, because the index must also be updated on every insert or update.
Transactions ensure that a group of database operations either all succeed or all fail. The ACID properties — Atomicity, Consistency, Isolation, Durability — define how transactions behave. In distributed systems, you may also encounter the CAP theorem, which states that you can only have two of Consistency, Availability, and Partition Tolerance at any given time.`,
    keyPoints: [
      'index',
      'transaction',
      'ACID',
      'CAP theorem',
      'read vs write trade-off',
    ],
    vocabulary: [
      {
        term: 'index',
        pronunciation: '/ˈɪndeks/',
        definitionEn: 'A data structure that improves the speed of data retrieval operations.',
        definitionZh: '一种提高数据检索速度的数据结构。',
        exampleSentence: 'Adding an index on the email column improved query performance significantly.',
      },
      {
        term: 'transaction',
        pronunciation: '/trænˈzækʃən/',
        definitionEn: 'A group of database operations that execute as a single unit.',
        definitionZh: '一组作为单个单元执行的数据库操作。',
        exampleSentence: 'The transaction ensures that the payment and order creation either both succeed or both fail.',
      },
      {
        term: 'ACID',
        pronunciation: '/ˈeɪsɪd/',
        definitionEn: 'A set of properties — Atomicity, Consistency, Isolation, Durability — that guarantee reliable transaction processing.',
        definitionZh: '保证可靠事务处理的一组属性。',
        exampleSentence: 'Relational databases like PostgreSQL provide ACID compliance for transactions.',
      },
      {
        term: 'normalization',
        pronunciation: '/ˌnɔːrmələˈzeɪʃən/',
        definitionEn: 'The process of organizing data to reduce redundancy and improve integrity.',
        definitionZh: '组织数据以减少冗余并提高完整性的过程。',
        exampleSentence: 'Third normal form is a common level of normalization in relational databases.',
      },
    ],
    sentencePatterns: [
      {
        pattern: 'Adding an index on ___ improves ___ .',
        meaningZh: '在 ___ 上添加索引可以提高 ___ 。',
        example: 'Adding an index on the user_id column improves join performance.',
      },
      {
        pattern: 'The trade-off of using an index is ___ .',
        meaningZh: '使用索引的代价是 ___ 。',
        example: 'The trade-off of using an index is slower write operations.',
      },
      {
        pattern: 'We use transactions to ensure ___ .',
        meaningZh: '我们使用事务来确保 ___ 。',
        example: 'We use transactions to ensure data consistency across multiple tables.',
      },
    ],
    speakingPrompt: {
      prompt: 'Explain the trade-off between read performance and write performance when adding database indexes.',
      promptZh: '解释添加数据库索引时读性能和写性能之间的权衡。',
      durationSeconds: 60,
    },
    interviewQuestion: {
      question: 'Can you explain the CAP theorem and how it applies to distributed databases?',
      idealAnswer: 'The CAP theorem states that a distributed data store can only provide two of three guarantees simultaneously: Consistency, Availability, and Partition Tolerance. Consistency means every read receives the most recent write. Availability means every request receives a response. Partition Tolerance means the system continues to operate despite network failures. In practice, since network partitions are unavoidable, we must choose between CP and AP. For example, banking systems prioritize consistency, while social media platforms may prioritize availability.',
      commonMistakes: [
        'Misunderstanding partition tolerance as optional',
        'Not giving real-world examples',
        'Confusing CAP with ACID',
      ],
      keyPoints: [
        'Consistency, Availability, Partition Tolerance',
        'Partition tolerance is mandatory in distributed systems',
        'CP vs AP trade-off with examples',
      ],
    },
    commonMistakes: [
      'Over-indexing without considering write performance',
      'Not using transactions for related operations',
      'Ignoring connection pooling in production',
    ],
    understandingCheck: {
      question: "What is the difference between SQL and NoSQL databases?",
      questionZh: "SQL 和 NoSQL 数据库有什么区别？",
      keywords: ["schema", "scalable", "structured", "flexible"],
      successFeedback: "Good! SQL uses structured schemas, NoSQL offers flexibility.",
      failureHint: "Consider data structure and scalability requirements."
    },
  },
  {
    slug: 'rabbitmq',
    title: 'RabbitMQ',
    titleZh: 'RabbitMQ 消息队列',
    explainGoal: 'Talk through queues, consumers, and retry strategies in standup.',
    explainGoalZh: '学会在站会用英语讨论队列、消费者和重试策略。',
    level: 'B2',
    progress: 12,
    unit: 1,
    totalUnits: 5,
    readingParagraph: `RabbitMQ is a message broker that enables asynchronous communication between services. Producers send messages to exchanges, which route them to queues based on routing rules. Consumers then process messages from these queues.
The main advantage of using a message queue is decoupling: the producer and consumer do not need to be available at the same time. If the consumer is down, messages wait in the queue until it recovers.
Key concepts include exchanges (direct, topic, fanout), queues, bindings, and acknowledgments. Consumers send acknowledgments back to RabbitMQ to confirm that a message has been processed successfully. If a consumer fails to acknowledge, the message is re-queued for another consumer to process.`,
    keyPoints: [
      'producer / consumer',
      'exchange',
      'queue',
      'acknowledgment',
      'retry strategy',
    ],
    vocabulary: [
      {
        term: 'message broker',
        pronunciation: '/ˈmesɪdʒ ˈbroʊkər/',
        definitionEn: 'A middleware component that handles message routing between services.',
        definitionZh: '在服务之间处理消息路由的中间件组件。',
        exampleSentence: 'RabbitMQ acts as a message broker between our order service and notification service.',
      },
      {
        term: 'exchange',
        pronunciation: '/ɪksˈtʃeɪndʒ/',
        definitionEn: 'A component that receives messages from producers and routes them to queues.',
        definitionZh: '从生产者接收消息并将其路由到队列的组件。',
        exampleSentence: 'We use a topic exchange to route messages based on routing keys.',
      },
      {
        term: 'acknowledgment',
        pronunciation: '/əkˈnɒlɪdʒmənt/',
        definitionEn: 'A signal sent by a consumer to confirm that a message has been processed.',
        definitionZh: '消费者发送的信号，确认消息已处理完成。',
        exampleSentence: 'If the consumer crashes before sending an acknowledgment, the message is re-queued.',
      },
      {
        term: 'dead letter queue',
        pronunciation: '/ded ˈletər kjuː/',
        definitionEn: 'A queue that stores messages that could not be processed successfully.',
        definitionZh: '存储无法成功处理的消息的队列。',
        exampleSentence: 'Messages are moved to a dead letter queue after three failed retry attempts.',
      },
    ],
    sentencePatterns: [
      {
        pattern: 'The producer sends messages to ___ exchange, which routes them to ___ .',
        meaningZh: '生产者将消息发送到 ___ 交换机，它会将消息路由到 ___ 。',
        example: 'The producer sends messages to a topic exchange, which routes them to the appropriate queues.',
      },
      {
        pattern: 'If the consumer fails to process the message, it ___ .',
        meaningZh: '如果消费者处理消息失败，它 ___ 。',
        example: 'If the consumer fails to process the message, it sends a negative acknowledgment and the message is retried.',
      },
    ],
    speakingPrompt: {
      prompt: 'Explain how RabbitMQ ensures reliable message delivery. Include exchanges, queues, and acknowledgments.',
      promptZh: '解释 RabbitMQ 如何确保可靠消息传递，包括交换机、队列和确认机制。',
      durationSeconds: 60,
    },
    interviewQuestion: {
      question: 'How do you handle message retries in RabbitMQ?',
      idealAnswer: 'There are several strategies for handling message retries in RabbitMQ. The most common approach is to use a dead letter queue. When a consumer fails to process a message, it sends a negative acknowledgment (nack) and the message is routed to a dead letter exchange after a configured number of retries. Alternatively, you can use a delayed retry queue: failed messages are published to a retry queue with a TTL, and after the TTL expires, they are routed back to the original queue. This approach prevents tight retry loops from overwhelming the system.',
      commonMistakes: [
        'Not implementing a retry limit',
        'Creating tight retry loops without delays',
        'Losing messages when all retries are exhausted',
      ],
      keyPoints: [
        'Dead letter queue for failed messages',
        'Delayed retry with TTL',
        'Always set a maximum retry count',
      ],
    },
    commonMistakes: [
      'Forgetting to handle unacknowledged messages',
      'Not monitoring queue depth in production',
      'Using too many queues without proper naming convention',
    ],
    understandingCheck: {
      question: "What is a message queue used for?",
      questionZh: "消息队列是用来做什么的？",
      keywords: ["decouple", "async", "buffer", "reliable"],
      successFeedback: "Correct! Message queues decouple services and handle async tasks.",
      failureHint: "Think about service-to-service communication patterns."
    },
  },
  {
    slug: 'docker',
    title: 'Docker',
    titleZh: 'Docker 容器',
    explainGoal: 'Explain images, containers, volumes, and deployment isolation in English.',
    explainGoalZh: '学会用英语解释镜像、容器、数据卷和部署隔离。',
    level: 'B1',
    progress: 55,
    unit: 3,
    totalUnits: 5,
    readingParagraph: `Docker is a containerization platform that packages applications and their dependencies into lightweight, portable units called containers. Unlike virtual machines, containers share the host operating system kernel, making them more resource-efficient.
A Docker image is a read-only template that contains the application code, runtime, libraries, and dependencies. When you run an image, it becomes a container. Images are built using Dockerfiles, which define the steps to assemble the image.
Volumes are used to persist data generated by containers. When a container is removed, any data written to its writable layer is lost. Volumes provide a way to store data outside the container's lifecycle, which is essential for stateful applications like databases.`,
    keyPoints: [
      'image vs container',
      'Dockerfile',
      'volume',
      'port mapping',
      'container isolation',
    ],
    vocabulary: [
      {
        term: 'container',
        pronunciation: '/kənˈteɪnər/',
        definitionEn: 'A lightweight, standalone package that includes everything needed to run an application.',
        definitionZh: '一个轻量级、独立的包，包含运行应用所需的一切。',
        exampleSentence: 'Each microservice runs in its own Docker container.',
      },
      {
        term: 'image',
        pronunciation: '/ˈɪmɪdʒ/',
        definitionEn: 'A read-only template with instructions for creating a container.',
        definitionZh: '包含创建容器指令的只读模板。',
        exampleSentence: 'The Docker image is built from a Dockerfile and pushed to a registry.',
      },
      {
        term: 'volume',
        pronunciation: '/ˈvɒljuːm/',
        definitionEn: 'A persistent storage mechanism for data generated and used by Docker containers.',
        definitionZh: '用于持久化 Docker 容器生成和使用的数据的存储机制。',
        exampleSentence: 'We mounted a volume to persist the database files outside the container.',
      },
      {
        term: 'orchestration',
        pronunciation: '/ˌɔːrkɪˈstreɪʃən/',
        definitionEn: 'The automated management of containers, including deployment, scaling, and networking.',
        definitionZh: '容器的自动化管理，包括部署、扩缩容和网络。',
        exampleSentence: 'Kubernetes provides container orchestration across a cluster of machines.',
      },
    ],
    sentencePatterns: [
      {
        pattern: 'A Docker ___ is different from a virtual machine because ___ .',
        meaningZh: 'Docker ___ 和虚拟机的区别在于 ___ 。',
        example: 'A Docker container is different from a virtual machine because it shares the host OS kernel.',
      },
      {
        pattern: 'We use volumes to ___ .',
        meaningZh: '我们使用数据卷来 ___ 。',
        example: 'We use volumes to persist database data across container restarts.',
      },
      {
        pattern: 'The Dockerfile defines ___ .',
        meaningZh: 'Dockerfile 定义了 ___ 。',
        example: 'The Dockerfile defines the steps to build the application image.',
      },
    ],
    speakingPrompt: {
      prompt: 'Explain the difference between a Docker image and a container. When would you use each?',
      promptZh: '解释 Docker 镜像和容器的区别。分别在什么情况下使用？',
      durationSeconds: 60,
    },
    interviewQuestion: {
      question: 'What is the difference between a Docker container and a virtual machine?',
      idealAnswer: 'The main difference is that containers share the host operating system kernel, while virtual machines include a full guest OS. Containers are lightweight — they start in seconds and use less memory. Virtual machines provide stronger isolation because each VM runs its own OS. For microservices, containers are usually preferred because of efficiency and fast startup. For scenarios requiring strong security isolation or running different OS kernels, virtual machines are more appropriate.',
      commonMistakes: [
        'Saying containers are always better than VMs',
        'Not understanding OS-level virtualization',
        'Confusing images with containers',
      ],
      keyPoints: [
        'Containers share host kernel, VMs have guest OS',
        'Containers are lighter and faster to start',
        'VMs provide stronger isolation',
      ],
    },
    commonMistakes: [
      'Treating containers like VMs with SSH',
      'Not using .dockerignore',
      'Running containers as root in production',
    ],
    understandingCheck: {
      question: "What is the difference between a Docker container and a virtual machine?",
      questionZh: "Docker 容器和虚拟机有什么区别？",
      keywords: ["kernel", "shared", "lightweight", "OS"],
      successFeedback: "Great! Containers share the host OS kernel, VMs have their own.",
      failureHint: "Think about resource efficiency and OS-level virtualization."
    },
  },
  {
    slug: 'cicd',
    title: 'CI/CD',
    titleZh: 'CI/CD 流水线',
    explainGoal: 'Describe a deployment pipeline and roll-back plan clearly.',
    explainGoalZh: '学会清晰描述部署流水线和回滚计划。',
    level: 'B1+',
    progress: 25,
    unit: 2,
    totalUnits: 6,
    readingParagraph: `CI/CD stands for Continuous Integration and Continuous Deployment. It is a practice that automates the process of building, testing, and deploying code changes.
Continuous Integration means that developers merge their code changes to the main branch frequently, and each merge triggers an automated build and test process. This helps catch integration issues early.
Continuous Deployment extends CI by automatically deploying every change that passes the tests to production. Some teams use Continuous Delivery instead, where the code is automatically deployed to a staging environment and requires manual approval for production deployment.
A typical CI/CD pipeline includes stages: lint, build, unit test, integration test, deploy to staging, and deploy to production. Each stage should fail fast and provide clear feedback to the developer.`,
    keyPoints: [
      'Continuous Integration',
      'Continuous Deployment',
      'pipeline stages',
      'roll-back strategy',
      'fail fast',
    ],
    vocabulary: [
      {
        term: 'pipeline',
        pronunciation: '/ˈpaɪpˌlaɪn/',
        definitionEn: 'An automated sequence of steps that code changes go through from commit to deployment.',
        definitionZh: '代码变更从提交到部署所经历的自动化步骤序列。',
        exampleSentence: 'Our CI/CD pipeline runs linting, tests, and deployment automatically.',
      },
      {
        term: 'rollback',
        pronunciation: '/ˈroʊlˌbæk/',
        definitionEn: 'The process of reverting a deployment to a previous stable version.',
        definitionZh: '将部署回滚到之前稳定版本的过程。',
        exampleSentence: 'We have an automated rollback that triggers if the health check fails after deployment.',
      },
      {
        term: 'artifact',
        pronunciation: '/ˈɑːrtɪfækt/',
        definitionEn: 'A deployable package produced by the build process.',
        definitionZh: '构建过程产生的可部署包。',
        exampleSentence: 'The build stage produces a Docker image as the deployment artifact.',
      },
    ],
    sentencePatterns: [
      {
        pattern: 'The pipeline consists of ___ stages: ___ .',
        meaningZh: '流水线包含 ___ 个阶段： ___ 。',
        example: 'The pipeline consists of four stages: lint, build, test, and deploy.',
      },
      {
        pattern: 'If the deployment fails, we ___ .',
        meaningZh: '如果部署失败，我们 ___ 。',
        example: 'If the deployment fails, we automatically roll back to the previous version.',
      },
      {
        pattern: 'Continuous Integration helps us ___ .',
        meaningZh: '持续集成帮助我们 ___ 。',
        example: 'Continuous Integration helps us catch integration bugs early.',
      },
    ],
    speakingPrompt: {
      prompt: 'Describe your ideal CI/CD pipeline for a microservice. What stages would you include?',
      promptZh: '描述你理想中的微服务 CI/CD 流水线，包括哪些阶段？',
      durationSeconds: 60,
    },
    interviewQuestion: {
      question: 'How would you design a deployment pipeline with rollback capability?',
      idealAnswer: 'I would design a multi-stage pipeline. First, the lint and build stage ensures code quality and compiles the application. Second, automated tests run — including unit, integration, and end-to-end tests. Third, the build artifact (such as a Docker image) is pushed to a registry. For deployment, I would use a blue-green or canary strategy. After deploying to production, automated health checks verify the deployment. If the health checks fail or error rates increase beyond a threshold, an automated rollback is triggered to revert to the last known good version. All deployments are version-tagged so we can quickly identify and revert to any previous version.',
      commonMistakes: [
        'Not including automated rollback',
        'Skipping integration tests in the pipeline',
        'Deploying directly without staging verification',
      ],
      keyPoints: [
        'Multi-stage pipeline with gates',
        'Blue-green or canary deployment',
        'Automated health checks and rollback',
      ],
    },
    commonMistakes: [
      'Skipping the linting stage',
      'Not versioning deployment artifacts',
      'Manual deployment without automation',
    ],
    understandingCheck: {
      question: "Why is CI/CD important in software development?",
      questionZh: "为什么 CI/CD 在软件开发中很重要？",
      keywords: ["automated", "quality", "deploy", "feedback"],
      successFeedback: "Good! CI/CD automates testing and deployment, improving quality.",
      failureHint: "Consider development speed and code quality benefits."
    },
  },
];

export function getTopicBySlug(slug: string): LearningTopic | undefined {
  return mockTopics.find((t) => t.slug === slug);
}

export function getMockTopics() {
  return mockTopics;
}
