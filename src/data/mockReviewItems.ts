import type { ReviewItem, WeakPoint } from '@/types/review';

export const mockReviewItems: ReviewItem[] = [
  {
    id: 'review-1',
    type: 'wrong_answer',
    status: 'pending',
    createdAt: '2026-06-21',
    source: 'Interview · Backend',
    title: 'Redis cache hit rate troubleshooting',
    content: 'How would you troubleshoot Redis cache hit rate drops?',
    userAnswer: 'I would check the cache keys and the expiration time. Maybe the traffic pattern changed, so we need to update the cache configuration.',
    problem: 'Missing hot key analysis and monitoring metrics. Answer ended too quickly without a structured troubleshooting flow.',
    correctAnswer: 'I would start by checking our monitoring dashboard — specifically the hit rate, latency, and eviction count. Then identify hot keys or traffic spikes. Then review TTL and eviction policy.',
    topicSlug: 'redis-cache',
    tags: ['Redis cache', 'System design', 'Monitoring'],
  },
  {
    id: 'review-2',
    type: 'wrong_answer',
    status: 'pending',
    createdAt: '2026-06-20',
    source: 'Interview · System Design',
    title: 'URL shortener high read traffic',
    content: 'Design a URL shortener — how would you handle high read traffic?',
    userAnswer: 'Mentioned caching but did not compare CDN vs in-memory cache trade-offs.',
    problem: 'Mentioned caching but did not compare CDN vs in-memory cache trade-offs.',
    topicSlug: 'redis-cache',
    tags: ['System design', 'Caching', 'CDN'],
  },
  {
    id: 'review-3',
    type: 'wrong_answer',
    status: 'reviewed',
    createdAt: '2026-06-19',
    source: 'Interview · Technical',
    title: 'PUT vs POST difference',
    content: 'Can you explain the difference between PUT and POST?',
    userAnswer: 'PUT is for updating and POST is for creating.',
    problem: 'Answer was too brief. Missing explanation of idempotency and real-world usage.',
    correctAnswer: 'PUT is idempotent and replaces a resource at a specific URL. POST is not idempotent and creates subordinate resources.',
    topicSlug: 'restful-api',
    tags: ['RESTful API', 'HTTP methods', 'Idempotency'],
  },
];

export const mockWeakPoints: WeakPoint[] = [
  {
    theme: 'Cache troubleshooting structure',
    severity: 'high',
    sources: '3 wrong answers · 2 interview reports',
    detail: 'You jump to actions before observing metrics. Practice the "observe → narrow → act" pattern.',
    drillRoute: '/technical-english/redis-cache',
  },
  {
    theme: 'Vocabulary: eviction & TTL',
    severity: 'medium',
    sources: '6 vocab items · 1 wrong answer',
    detail: 'Terms like eviction policy, TTL, and hot key are not yet active recall.',
    drillRoute: '/technical-english/redis-cache',
  },
  {
    theme: 'Past-tense project storytelling',
    severity: 'medium',
    sources: '2 interview reports',
    detail: 'Tense slips when describing what you did last quarter (STAR · Action step).',
    drillRoute: '/interview-english',
  },
];

export const mockWeakTags = [
  'Redis cache', 'System design', 'Past-tense storytelling',
  'Idempotency', 'Hot key', 'Monitoring metrics', 'Eviction policy',
];

export function getReviewItems() {
  return mockReviewItems;
}

export function getWeakPoints() {
  return mockWeakPoints;
}

export function getWeakTags() {
  return mockWeakTags;
}
