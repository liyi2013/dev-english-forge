export interface WorkplaceSentencePattern {
  pattern: string;
  meaningZh: string;
  example: string;
}

export interface WorkplacePhrase {
  en: string;
  zh: string;
  usage: string;
}

export interface WorkplaceMiniDrill {
  id: string;
  prompt: string;
  promptZh: string;
  sampleAnswer: string;
}

export interface WorkplaceToneTip {
  title: string;
  titleZh: string;
  detail: string;
  detailZh: string;
}

export interface WorkplaceScenario {
  slug: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  level: string;
  progress: number;
  estimatedTime: string;
  objective: string;
  objectiveZh: string;
  context: string;
  contextZh: string;
  sentencePatterns: WorkplaceSentencePattern[];
  usefulPhrases: WorkplacePhrase[];
  miniDrills: WorkplaceMiniDrill[];
  toneTips: WorkplaceToneTip[];
  commonMistakes: string[];
  relatedTopics: string[];
}
