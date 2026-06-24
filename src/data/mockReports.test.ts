import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateMockReport, getReportById, getMockReports } from "./mockReports";

const baseConfig = {
  mode: "quick",
  role: "Backend Developer",
  difficulty: "Mid-level",
  language: "English",
  questionCount: 3,
  interviewType: "Mixed",
  duration: "15 minutes",
};

const baseQuestions = [
  { question: "What is the CAP theorem?", type: "Technical", hint: "Think about consistency" },
  { question: "Explain PUT vs POST", type: "Technical", hint: "Think about idempotency" },
  { question: "Tell me about yourself", type: "Behavioral", hint: "Keep it professional" },
];

const baseAnswers: Record<number, { text: string; duration: number }> = {
  0: { text: "CAP theorem is about consistency, availability, and partition tolerance.", duration: 30 },
  1: { text: "PUT is idempotent, POST is not.", duration: 25 },
};


beforeEach(() => {
  // Mock localStorage
  const store: Record<string, string> = {};
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    length: 0,
    key: () => null,
  });
});

describe("generateMockReport", () => {
  it("is deterministic - same inputs produce same scores", () => {
    const report1 = generateMockReport(baseConfig, baseAnswers, baseQuestions);
    const report2 = generateMockReport(baseConfig, baseAnswers, baseQuestions);

    expect(report1.overallScore).toBe(report2.overallScore);
    expect(report1.scores.englishExpression).toBe(report2.scores.englishExpression);
    expect(report1.scores.technicalAccuracy).toBe(report2.scores.technicalAccuracy);
    expect(report1.scores.answerStructure).toBe(report2.scores.answerStructure);
    expect(report1.scores.confidence).toBe(report2.scores.confidence);
    expect(report1.strongPoints).toEqual(report2.strongPoints);
    expect(report1.weakPoints).toEqual(report2.weakPoints);
  });

  it("uses the provided config role and difficulty", () => {
    const report = generateMockReport(baseConfig, baseAnswers, baseQuestions);
    expect(report.config.role).toBe("Backend Developer");
    expect(report.config.difficulty).toBe("Mid-level");
    expect(report.config.questionCount).toBe(3);
  });

  it("includes user answers in questionDetails", () => {
    const report = generateMockReport(baseConfig, baseAnswers, baseQuestions);
    expect(report.questionDetails.length).toBeGreaterThanOrEqual(1);
    const detail = report.questionDetails.find((d) => d.questionIndex === 1);
    expect(detail).toBeDefined();
    expect(detail!.userAnswer).toBe("CAP theorem is about consistency, availability, and partition tolerance.");
  });

  it("shows [Not answered] for unanswered questions", () => {
    const report = generateMockReport(baseConfig, baseAnswers, baseQuestions);
    const unanswered = report.questionDetails.find((d) => d.questionIndex === 3);
    expect(unanswered).toBeDefined();
    expect(unanswered!.userAnswer).toBe("[Not answered]");
  });

  it("produces different scores for different configs", () => {
    const seniorConfig = { ...baseConfig, role: "Senior Engineer", difficulty: "Senior" };
    const reportJunior = generateMockReport(baseConfig, baseAnswers, baseQuestions);
    const reportSenior = generateMockReport(seniorConfig, baseAnswers, baseQuestions);

    // Different configs should produce different scores
    const scoresMatch = 
      reportJunior.overallScore === reportSenior.overallScore &&
      reportJunior.scores.englishExpression === reportSenior.scores.englishExpression &&
      reportJunior.scores.technicalAccuracy === reportSenior.scores.technicalAccuracy &&
      reportJunior.scores.answerStructure === reportSenior.scores.answerStructure &&
      reportJunior.scores.confidence === reportSenior.scores.confidence;
    expect(scoresMatch).toBe(false);
  });

  it("different answer texts can produce different scores", () => {
    const shortAnswers: Record<number, { text: string; duration: number }> = {
      0: { text: "CAP theorem.", duration: 5 },
      1: { text: "PUT vs POST.", duration: 4 },
    };
    const longAnswers: Record<number, { text: string; duration: number }> = {
      0: { text: "CAP theorem means consistency, availability, and partition tolerance. You can only pick two of three.", duration: 30 },
      1: { text: "PUT is idempotent which means calling it multiple times gives the same result, while POST is not.", duration: 35 },
    };
    const reportShort = generateMockReport(baseConfig, shortAnswers, baseQuestions);
    const reportLong = generateMockReport(baseConfig, longAnswers, baseQuestions);

    expect(reportShort.overallScore).not.toBe(reportLong.overallScore);
  });

  it("does not use Math.random for scoring", () => {
    const spy = vi.spyOn(Math, "random");
    generateMockReport(baseConfig, baseAnswers, baseQuestions);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("getReportById", () => {
  it("finds static mock reports by id", () => {
    const report = getReportById("report-1");
    expect(report).toBeDefined();
    expect(report!.id).toBe("report-1");
  });

  it("returns undefined for non-existent id", () => {
    const report = getReportById("non-existent-id");
    expect(report).toBeUndefined();
  });

  it("reads generated reports from localStorage", () => {
    const generatedReport = generateMockReport(baseConfig, baseAnswers, baseQuestions);
    const reportId = generatedReport.id;

    // Store in localStorage
    localStorage.setItem("devenglish_generated_reports", JSON.stringify([generatedReport]));

    const found = getReportById(reportId);
    expect(found).toBeDefined();
    expect(found!.id).toBe(reportId);
  });
});
