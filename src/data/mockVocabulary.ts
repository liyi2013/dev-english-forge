import type { VocabularyItem } from '@/types/learning';

export const mockVocabulary: VocabularyItem[] = [
  {
    term: 'deploy',
    pronunciation: '/dɪˈplɔɪ/',
    definitionEn: 'To release an application to a server or environment for use.',
    definitionZh: '将应用程序发布到服务器或环境以供使用。',
    exampleSentence: 'We deploy to production every Tuesday and Thursday.',
  },
  {
    term: 'scalability',
    pronunciation: '/ˌskeɪləˈbɪlɪti/',
    definitionEn: 'The ability of a system to handle increased load by adding resources.',
    definitionZh: '系统通过增加资源来处理更大负载的能力。',
    exampleSentence: 'Horizontal scalability allows us to add more servers as traffic grows.',
  },
  {
    term: 'latency',
    pronunciation: '/ˈleɪtənsi/',
    definitionEn: 'The time delay between a request and its response.',
    definitionZh: '请求和响应之间的时间延迟。',
    exampleSentence: 'We optimized the query to reduce latency from 200ms to 50ms.',
  },
  {
    term: 'throughput',
    pronunciation: '/ˈθruːpʊt/',
    definitionEn: 'The amount of data processed by a system in a given time period.',
    definitionZh: '系统在给定时间内处理的数据量。',
    exampleSentence: 'The new cache layer improved throughput by 300%.',
  },
  {
    term: 'fault tolerance',
    pronunciation: '/fɔːlt ˈtɒlərəns/',
    definitionEn: 'The ability of a system to continue operating after a failure.',
    definitionZh: '系统在发生故障后继续运行的能力。',
    exampleSentence: 'Our microservices architecture provides fault tolerance through redundancy.',
  },
  {
    term: 'load balancer',
    pronunciation: '/loʊd ˈbælənsər/',
    definitionEn: 'A device or service that distributes incoming traffic across multiple servers.',
    definitionZh: '将传入流量分发到多个服务器的设备或服务。',
    exampleSentence: 'The load balancer distributes requests across three application servers.',
  },
  {
    term: 'rate limiting',
    pronunciation: '/reɪt ˈlɪmɪtɪŋ/',
    definitionEn: 'A technique that controls the number of requests a client can make in a time window.',
    definitionZh: '控制在时间窗口内客户端可以发送的请求数量的技术。',
    exampleSentence: 'We implemented rate limiting to prevent API abuse.',
  },
  {
    term: 'migration',
    pronunciation: '/maɪˈɡreɪʃən/',
    definitionEn: 'The process of moving data or applications from one environment to another.',
    definitionZh: '将数据或应用从一个环境迁移到另一个环境的过程。',
    exampleSentence: 'The database migration was carefully planned to minimize downtime.',
  },
  {
    term: 'replica',
    pronunciation: '/ˈreplɪkə/',
    definitionEn: 'A copy of data or a service that provides redundancy and read scalability.',
    definitionZh: '提供冗余和读扩展的数据或服务副本。',
    exampleSentence: 'We use read replicas to handle the high volume of SELECT queries.',
  },
  {
    term: 'endpoint',
    pronunciation: '/ˈendpɔɪnt/',
    definitionEn: 'A URL where a specific API resource or service can be accessed.',
    definitionZh: '特定 API 资源或服务的访问地址。',
    exampleSentence: 'The /api/v1/orders endpoint returns all orders for the current user.',
  },
];

export function getMockVocabulary() {
  return mockVocabulary;
}
