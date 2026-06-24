export interface LearningTopic {
  slug: string;
  title: string;
  titleZh: string;
  explainGoal: string;
  explainGoalZh: string;
  level: string;
  progress: number;
  unit: number;
  totalUnits: number;
  readingParagraph: string;
  keyPoints: string[];
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePattern[];
  speakingPrompt: SpeakingPrompt;
  interviewQuestion: InterviewQuestion;
  commonMistakes: string[];
  understandingCheck: {
    question: string;
    questionZh: string;
    keywords: string[];
    successFeedback: string;
    failureHint: string;
  };
}

export interface VocabularyItem {
  term: string;
  pronunciation: string;
  definitionEn: string;
  definitionZh: string;
  exampleSentence: string;
}

export interface SentencePattern {
  pattern: string;
  meaningZh: string;
  example: string;
}

export interface SpeakingPrompt {
  prompt: string;
  promptZh: string;
  durationSeconds: number;
}

export interface InterviewQuestion {
  question: string;
  idealAnswer: string;
  commonMistakes: string[];
  keyPoints: string[];
}

export interface LearningPath {
  id: string;
  slug: string;
  icon: string;
  name: string;
  nameZh: string;
  desc: string;
  descZh: string;
  milestone: string;
  milestoneZh: string;
  modules: LearningModule[];
  topicSlugs: string[];
}

export interface LearningModule {
  name: string;
  nameZh: string;
  status: "completed" | "in_progress" | "next" | "locked";
  progress?: number;
}
