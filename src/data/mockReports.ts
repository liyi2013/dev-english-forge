import type { InterviewReport } from '@/types/interview';

export const mockReports: InterviewReport[] = [
  {
    id: 'report-1',
    sessionId: 'session-1',
    date: '2026-06-21',
    config: {
      mode: 'quick',
      role: 'Backend Developer',
      difficulty: 'Mid-level',
      language: 'English',
      questionCount: 10,
      interviewType: 'Mixed',
      duration: '30 minutes',
    },
    overallScore: 78,
    scores: {
      englishExpression: 80,
      technicalAccuracy: 75,
      answerStructure: 72,
      confidence: 82,
    },
    strongPoints: [
      'Clear opening statement',
      'Correct Redis concepts',
      'Good use of concrete examples',
    ],
    weakPoints: [
      'Answer was too short',
      'Missing troubleshooting steps',
      'Vocabulary was repetitive',
    ],
    questionDetails: [
      {
        questionIndex: 1,
        question: 'How would you troubleshoot a Redis cache hit rate drop?',
        type: 'Technical',
        userAnswer: 'I would check the cache keys and the expiration time. Maybe the traffic pattern changed, so we need to update the cache configuration.',
        idealAnswer: "I'd start by checking our monitoring dashboard — specifically the hit rate, latency, and eviction count — to see when the drop began. Once I know the timing, I'd look for hot keys or a traffic spike that could explain it. Then I'd review the TTL and eviction policy in case useful keys are being dropped too aggressively. If the cluster itself looks unhealthy, I'd verify replication and have a fallback path to the database with rate limiting, so we degrade gracefully instead of overloading the DB.",
        gapAnalysis: [
          'Your answer jumps straight to actions. The ideal answer starts by observing metrics, then narrows down.',
          'You mention "update the cache" but do not explain eviction, TTL, or hot keys.',
          '"traffic pattern" was used twice; missing terms like eviction, TTL, hot key, fallback.',
        ],
        missingKeyPoints: [
          'Monitoring hit rate and latency metrics first',
          'Identifying hot keys vs cold keys',
          'Eviction policy and TTL review',
          'Fallback strategy when cache is down',
        ],
        betterAnswerVersion: "I'd start by checking our monitoring dashboard — specifically the hit rate, latency, and eviction count — to see when the drop began. Once I know the timing, I'd look for hot keys or a traffic spike that could explain it. Then I'd review the TTL and eviction policy in case useful keys are being dropped too aggressively. If the cluster itself looks unhealthy, I'd verify replication and have a fallback path to the database with rate limiting, so we degrade gracefully instead of overloading the DB.",
        score: 72,
      },
      {
        questionIndex: 2,
        question: 'Can you explain the difference between PUT and POST?',
        type: 'Technical',
        userAnswer: 'PUT is for updating and POST is for creating. PUT is idempotent and POST is not.',
        idealAnswer: 'PUT and POST are both HTTP methods used to send data to a server, but they differ in idempotency and intent. PUT is idempotent — calling it multiple times produces the same result. It is typically used to update an existing resource or create one at a specific URL. POST is not idempotent — calling it multiple times may create multiple resources. It is typically used to submit new data, such as creating a new order or user.',
        gapAnalysis: [
          'Your answer is correct but too brief. Expand with examples.',
          'Missing explanation of when to use each in practice.',
          'No real-world scenario mentioned.',
        ],
        missingKeyPoints: [
          'PUT replaces a resource at a specific URL',
          'POST creates a subordinate resource',
          'Real-world usage examples',
        ],
        betterAnswerVersion: 'PUT and POST are both HTTP methods used to send data to a server, but they differ in idempotency and intent. PUT is idempotent — calling it multiple times produces the same result. It is typically used to update an existing resource or create one at a specific URL. POST is not idempotent — calling it multiple times may create multiple resources. It is typically used to submit new data, such as creating a new order or user. In RESTful design, PUT replaces a resource, while POST creates a subordinate resource.',
        score: 78,
      },
      {
        questionIndex: 3,
        question: 'What is the CAP theorem and how does it apply to distributed databases?',
        type: 'System Design',
        userAnswer: 'CAP theorem says you can only have two of consistency, availability, and partition tolerance. Most systems choose consistency and partition tolerance.',
        idealAnswer: 'The CAP theorem states that a distributed data store can only provide two of three guarantees simultaneously: Consistency, Availability, and Partition Tolerance. Consistency means every read receives the most recent write. Availability means every request receives a response. Partition Tolerance means the system continues to operate despite network failures. In practice, since network partitions are unavoidable, we must choose between CP and AP. For example, banking systems prioritize consistency, while social media platforms may prioritize availability.',
        gapAnalysis: [
          'The statement "choose consistency and partition tolerance" needs more nuance.',
          'Missing explanation of why partition tolerance is mandatory.',
          'No real-world examples of CP vs AP systems.',
        ],
        missingKeyPoints: [
          'Partition tolerance is mandatory in distributed systems',
          'CP vs AP trade-off with real examples',
          'PACELC extension to CAP',
        ],
        betterAnswerVersion: 'The CAP theorem states that a distributed data store can only provide two of three guarantees simultaneously: Consistency, Availability, and Partition Tolerance. In practice, since network partitions are unavoidable, we must choose between CP and AP. For example, banking systems prioritize consistency, while social media platforms may prioritize availability. There is also the PACELC extension which adds latency considerations.',
        score: 70,
      },
    ],
    recommendedLearning: [
      { tag: 'Technical', title: 'Redis Cache 缓存', desc: 'Learn to explain cache hit rate, eviction, hot keys, and cache penetration in English.', time: '10 min', to: '/technical-english/redis-cache' },
      { tag: 'Interview', title: 'STAR Answer Structure', desc: 'Structure project stories clearly using the STAR pattern.', time: '8 min', to: '/interview-english' },
      { tag: 'Technical', title: 'RESTful API Design', desc: 'Explain endpoints, status codes, and idempotency confidently.', time: '12 min', to: '/technical-english/restful-api' },
    ],
  },
  {
    id: 'report-2',
    sessionId: 'session-2',
    date: '2026-06-18',
    config: {
      mode: 'quick',
      role: 'System Design',
      difficulty: 'Mid-level',
      language: 'English',
      questionCount: 5,
      interviewType: 'System Design',
      duration: '15 minutes',
    },
    overallScore: 64,
    scores: {
      englishExpression: 68,
      technicalAccuracy: 60,
      answerStructure: 55,
      confidence: 70,
    },
    strongPoints: [
      'Clear understanding of basic concepts',
      'Good enthusiasm',
    ],
    weakPoints: [
      'Missing system design structure',
      'Not comparing trade-offs',
      'Vocabulary needs improvement',
    ],
    questionDetails: [
      {
        questionIndex: 1,
        question: 'Design a rate limiter',
        type: 'System Design',
        userAnswer: 'I would use Redis to count requests per user and reject if over the limit.',
        idealAnswer: 'I would design a rate limiter using the token bucket algorithm. Each user gets a bucket with a fixed capacity. Tokens are added at a fixed rate. When a request comes in, it consumes a token. If no tokens are available, the request is rejected with a 429 status code. Redis is a good choice for storing the bucket state because of its atomic operations and TTL support.',
        gapAnalysis: [
          'The answer is too short and lacks structure.',
          'No mention of specific algorithms like token bucket or sliding window.',
          'No discussion of distributed rate limiting challenges.',
        ],
        missingKeyPoints: [
          'Token bucket vs sliding window algorithm',
          'Redis atomic operations for counters',
          'Handling distributed rate limiting',
        ],
        betterAnswerVersion: 'I would design a rate limiter using the token bucket algorithm. Each user gets a bucket with a fixed capacity. Tokens are added at a fixed rate. When a request comes in, it consumes a token. If no tokens are available, the request is rejected with a 429 status code. Redis is a good choice because of its atomic operations and TTL support. For distributed scenarios, we need to consider clock drift and consistency.',
        score: 60,
      },
    ],
    recommendedLearning: [
      { tag: 'Technical', title: 'Redis Cache 缓存', desc: 'Understand rate limiting with Redis.', time: '10 min', to: '/technical-english/redis-cache' },
      { tag: 'Technical', title: 'Database', desc: 'Learn CAP theorem and distributed systems.', time: '8 min', to: '/technical-english/database' },
    ],
  },
  {
    id: 'report-3',
    sessionId: 'session-3',
    date: '2026-06-15',
    config: {
      mode: 'quick',
      role: 'Junior Developer',
      difficulty: 'Junior',
      language: 'English',
      questionCount: 5,
      interviewType: 'Behavioral',
      duration: '15 minutes',
    },
    overallScore: 81,
    scores: {
      englishExpression: 78,
      technicalAccuracy: 85,
      answerStructure: 76,
      confidence: 84,
    },
    strongPoints: [
      'Clear self-introduction',
      'Well-structured answers',
      'Good confidence level',
    ],
    weakPoints: [
      'Stories lack measurable results',
      'Some tense errors when describing past work',
    ],
    questionDetails: [
      {
        questionIndex: 1,
        question: 'Tell me about yourself.',
        type: 'Behavioral',
        userAnswer: 'I am a backend engineer with 3 years of experience. I have worked on e-commerce platforms and payment systems. I enjoy solving technical problems.',
        idealAnswer: 'I am a backend engineer with 3 years of experience building scalable e-commerce platforms. In my current role at XYZ Company, I lead the order service redesign that improved throughput by 40%. I am particularly interested in distributed systems and database optimization. Outside of work, I contribute to open-source projects and write technical blog posts.',
        gapAnalysis: [
          'Good opening but lacks measurable achievements.',
          'Missing current role and specific contributions.',
          'No mention of interests or growth direction.',
        ],
        missingKeyPoints: [
          'Specific role and company',
          'Measurable achievements',
          'Career interests and growth',
        ],
        betterAnswerVersion: 'I am a backend engineer with 3 years of experience building scalable e-commerce platforms. In my current role at XYZ Company, I lead the order service redesign that improved throughput by 40%. I am particularly interested in distributed systems and database optimization.',
        score: 82,
      },
    ],
    recommendedLearning: [
      { tag: 'Interview', title: 'Project Story (STAR)', desc: 'Learn to structure project stories with measurable results.', time: '8 min', to: '/interview-english' },
      { tag: 'Vocabulary', title: 'Technical Vocabulary', desc: 'Expand your technical English vocabulary.', time: '6 min', to: '/technical-english/restful-api' },
    ],
  },
];

export function getReportById(id: string): InterviewReport | undefined {
  return mockReports.find((r) => r.id === id);
}

export function getReports() {
  return mockReports;
}

export function getLatestReport(): InterviewReport {
  return mockReports[0];
}
