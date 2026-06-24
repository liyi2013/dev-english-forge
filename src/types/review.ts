export type ReviewItemType = "wrong_answer" | "vocabulary" | "sentence" | "interview_report";
export type ReviewItemStatus = "pending" | "reviewed" | "mastered";
export type WeakPointSeverity = "high" | "medium" | "low";

export interface ReviewItem {
  id: string;
  type: ReviewItemType;
  status: ReviewItemStatus;
  createdAt: string;
  source: string;
  title: string;
  content: string;
  userAnswer?: string;
  problem?: string;
  correctAnswer?: string;
  topicSlug?: string;
  tags: string[];
}

export interface WeakPoint {
  theme: string;
  severity: WeakPointSeverity;
  sources: string;
  detail: string;
  drillRoute: string;
}
