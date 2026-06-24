import type { InterviewSession, InterviewQuestionItem } from '@/types/interview';

const quickQuestions: InterviewQuestionItem[] = [
  { type: 'Technical', question: 'Can you explain the difference between PUT and POST?', hint: 'Think about idempotency and when to use each.' },
  { type: 'Technical', question: 'How would you troubleshoot a Redis cache hit rate drop?', hint: 'Talk through your investigation steps.' },
  { type: 'Behavioral', question: 'Tell me about a project where you had to make a technical trade-off.', hint: 'Use STAR: Situation, Task, Action, Result.' },
  { type: 'Technical', question: 'What is the CAP theorem and how does it apply to distributed databases?', hint: 'Think about consistency, availability, partition tolerance.' },
  { type: 'System Design', question: 'Design a URL shortener. How would you handle high read traffic?', hint: 'Consider caching, database sharding, and CDN.' },
  { type: 'Technical', question: 'Explain the difference between a Docker container and a virtual machine.', hint: 'Think about OS kernel sharing and resource efficiency.' },
  { type: 'Behavioral', question: 'Describe a time you had to disagree with a team member.', hint: 'Focus on communication and resolution.' },
  { type: 'Technical', question: 'How do indexes work in a relational database?', hint: 'Talk about B-tree, read/write trade-off.' },
  { type: 'System Design', question: 'How would you design a rate limiter for a public API?', hint: 'Consider token bucket, sliding window, Redis.' },
  { type: 'Technical', question: 'What is the difference between SQL and NoSQL databases?', hint: 'Compare schema, scalability, consistency models.' },
];

const jdQuestions: InterviewQuestionItem[] = [
  { type: 'Technical', question: 'Walk me through your experience with microservices architecture.', hint: 'Focus on your hands-on experience.' },
  { type: 'System Design', question: 'Design an order processing system that handles high traffic.', hint: 'Consider message queues, caching, idempotency.' },
  { type: 'Technical', question: 'How do you ensure data consistency across multiple services?', hint: 'Think about distributed transactions, saga pattern.' },
  { type: 'Behavioral', question: 'Tell me about a challenging bug you fixed in production.', hint: 'Use STAR format with measurable results.' },
  { type: 'Technical', question: 'Explain how you would optimize a slow API endpoint.', hint: 'Consider caching, query optimization, indexing.' },
];

export const mockInterviewSessions: InterviewSession[] = [
  {
    id: 'session-1',
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
    questions: quickQuestions,
    currentQuestionIndex: 0,
    status: 'completed',
  },
  {
    id: 'session-2',
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
    questions: [
      { type: 'System Design', question: 'Design a rate limiter', hint: 'Token bucket algorithm' },
      { type: 'System Design', question: 'Design a URL shortener', hint: 'Base62 encoding, caching' },
      { type: 'System Design', question: 'Design a chat system', hint: 'WebSocket, message queue' },
      { type: 'System Design', question: 'Design a key-value store', hint: 'Consistent hashing, replication' },
      { type: 'System Design', question: 'Design a notification system', hint: 'Push vs pull, event-driven' },
    ],
    currentQuestionIndex: 0,
    status: 'completed',
  },
  {
    id: 'session-3',
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
    questions: [
      { type: 'Behavioral', question: 'Tell me about yourself.', hint: 'Keep it professional and relevant.' },
      { type: 'Behavioral', question: 'Why do you want to work here?', hint: 'Research the company first.' },
      { type: 'Behavioral', question: 'Tell me about a team project.', hint: 'Highlight your contribution.' },
      { type: 'Behavioral', question: 'How do you handle deadlines?', hint: 'Give a concrete example.' },
      { type: 'Behavioral', question: 'Where do you see yourself in 5 years?', hint: 'Be ambitious but realistic.' },
    ],
    currentQuestionIndex: 0,
    status: 'completed',
  },
];

export function getQuestionsByMode(mode: string): InterviewQuestionItem[] {
  if (mode === 'jd') return jdQuestions;
  return quickQuestions;
}

export function getRecentSessions() {
  return mockInterviewSessions;
}
