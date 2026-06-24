export type InterviewMode = "quick" | "jd" | "full";

export interface InterviewConfig {
  mode: InterviewMode;
  role: string;
  difficulty: string;
  language: string;
  questionCount: number;
  interviewType: string;
  duration: string;
}

export interface InterviewSession {
  id: string;
  date: string;
  config: InterviewConfig;
  questions: InterviewQuestionItem[];
  currentQuestionIndex: number;
  status: "in_progress" | "completed";
}

export interface InterviewQuestionItem {
  type: string;
  question: string;
  hint: string;
  userAnswer?: string;
  recordingDuration?: number;
}

export interface InterviewReport {
  id: string;
  sessionId: string;
  date: string;
  config: InterviewConfig;
  overallScore: number;
  scores: InterviewScores;
  strongPoints: string[];
  weakPoints: string[];
  questionDetails: InterviewQuestionDetail[];
  recommendedLearning: RecommendedLearning[];
}

export interface InterviewScores {
  englishExpression: number;
  technicalAccuracy: number;
  answerStructure: number;
  confidence: number;
}

export interface InterviewQuestionDetail {
  questionIndex: number;
  question: string;
  type: string;
  userAnswer: string;
  idealAnswer: string;
  gapAnalysis: string[];
  missingKeyPoints: string[];
  betterAnswerVersion: string;
  score: number;
}

export interface RecommendedLearning {
  tag: string;
  title: string;
  desc: string;
  time: string;
  to: string;
}
