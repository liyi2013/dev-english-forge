export interface ScenarioQuestion {
  id: string;
  question: string;
  questionZh: string;
  idealAnswer: string;
  keyPoints: string[];
  commonMistakes: string[];
}

export interface InterviewScenario {
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
  structureTips: string[];
  structureTipsZh: string[];
  usefulPhrases: Array<{ en: string; zh: string }>;
  questions: ScenarioQuestion[];
  sampleAnswer: string;
  relatedTopics: string[];
}
