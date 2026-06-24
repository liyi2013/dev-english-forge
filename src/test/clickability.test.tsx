import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import InterviewReport from "@/pages/InterviewReport";
import TechnicalEnglish from "@/pages/TechnicalEnglish";
import Profile from "@/pages/Profile";
import WorkplaceEnglish from "@/pages/WorkplaceEnglish";

// Mock sonner toast to avoid portal issues in test
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {
    devenglish_locale: "zh-CN",
    devenglish_reports: JSON.stringify([{ id: "report-1", date: "2026-06-21", overallScore: 78 }]),
    devenglish_generated_reports: JSON.stringify([{
      id: "report-1",
      sessionId: "session-1",
      date: "2026-06-21",
      config: { mode: "quick", role: "Backend Developer", difficulty: "Mid-level", language: "English", questionCount: 10, interviewType: "Mixed", duration: "30 minutes" },
      overallScore: 78,
      scores: { englishExpression: 80, technicalAccuracy: 75, answerStructure: 72, confidence: 82 },
      strongPoints: ["Clear opening statement", "Correct Redis concepts"],
      weakPoints: ["Answer was too short", "Missing troubleshooting steps"],
      questionDetails: [{
        questionIndex: 1,
        question: "Test question",
        type: "Technical",
        userAnswer: "Test answer",
        idealAnswer: "A strong answer",
        gapAnalysis: ["Answer is too short"],
        missingKeyPoints: ["Consider mentioning relevant technologies"],
        betterAnswerVersion: "To improve your answer, focus on structured reasoning",
        score: 72
      }],
      recommendedLearning: [{ tag: "Technical", title: "Technical Vocabulary", desc: "Improve", time: "10 min", to: "/technical-english" }]
    }]),
  };
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
})();

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nProvider>
      <MemoryRouter initialEntries={["/"]}>
        {ui}
      </MemoryRouter>
    </I18nProvider>
  );
}

describe("Button clickability — no crashes or missing handlers", () => {
  beforeAll(() => {
    vi.stubGlobal("localStorage", mockLocalStorage);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("InterviewReport - Export PDF button has onClick and does not crash", async () => {
    renderWithProviders(<InterviewReport />);
    // Wait for async content to render
    await waitFor(() => {
      expect(screen.getByText("78")).toBeDefined();
    });
    // Find Export PDF button
    const buttons = screen.getAllByRole("button");
    const exportBtn = buttons.find((b) => b.textContent?.includes("导出 PDF"));
    expect(exportBtn).toBeDefined();
    expect(exportBtn!.onclick).not.toBeNull();
    // Click should not throw
    expect(() => fireEvent.click(exportBtn!)).not.toThrow();
  });

  it("InterviewReport - New Session navigates to /ai-interview", async () => {
    renderWithProviders(<InterviewReport />);
    await waitFor(() => expect(screen.getByText("78")).toBeDefined());
    const links = screen.getAllByRole("link");
    const newSessionLink = links.find((l) => l.textContent?.includes("新面试"));
    expect(newSessionLink).toBeDefined();
    expect(newSessionLink!.getAttribute("href")).toBe("/ai-interview");
  });

  it("TechnicalEnglish - View Plan button has onClick", async () => {
    renderWithProviders(<TechnicalEnglish />);
    const viewPlanBtn = screen.getByText("查看计划");
    expect(viewPlanBtn).toBeDefined();
    expect(viewPlanBtn.onclick).not.toBeNull();
    expect(() => fireEvent.click(viewPlanBtn)).not.toThrow();
  });

  it("Profile - Edit Profile button has onClick", () => {
    renderWithProviders(<Profile />);
    const editBtn = screen.getByText("编辑资料");
    expect(editBtn).toBeDefined();
    expect(editBtn.onclick).not.toBeNull();
    expect(() => fireEvent.click(editBtn)).not.toThrow();
  });

  it("WorkplaceEnglish - Get AI Feedback button has onClick", async () => {
    renderWithProviders(<WorkplaceEnglish />);
    const feedbackBtn = screen.getByText("获取 AI 反馈");
    expect(feedbackBtn).toBeDefined();
    expect(feedbackBtn.onclick).not.toBeNull();
    expect(() => fireEvent.click(feedbackBtn)).not.toThrow();
  });
});
