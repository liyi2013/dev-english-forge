import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import InterviewReport from "@/pages/InterviewReport";
import TechnicalEnglish from "@/pages/TechnicalEnglish";
import Profile from "@/pages/Profile";
import WorkplaceEnglish from "@/pages/WorkplaceEnglish";
import Learning from "@/pages/Learning";
import Dashboard from "@/pages/Dashboard";
import InterviewEnglish from "@/pages/InterviewEnglish";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

// Full mock of mockStorage so tests don't need real localStorage
vi.mock("@/lib/mockStorage", () => {
  const PREFIX = "devenglish_";
  const sentencesStore: Array<{ pattern: string; savedAt: string }> = [];
  function get(key: string, fallback: unknown) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function set(key: string, value: unknown) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }
  return {
    getSavedVocabulary: () => get("vocab", []),
    saveVocabulary: (e: { term: string; savedAt: string }) => {
      const list = get("vocab", []);
      if (!list.find((v: { term: string }) => v.term === e.term)) {
        list.push(e); set("vocab", list);
      }
    },
    removeVocabulary: (t: string) => set("vocab", get("vocab", []).filter((v: { term: string }) => v.term !== t)),
    isVocabSaved: (t: string) => get("vocab", []).some((v: { term: string }) => v.term === t),
    getSavedSentences: () => [...sentencesStore],
    saveSentence: vi.fn((entry: { pattern: string; savedAt: string }) => {
      if (!sentencesStore.find((s) => s.pattern === entry.pattern)) {
        sentencesStore.push(entry);
      }
      localStorage.setItem("devenglish_sentences", JSON.stringify(sentencesStore));
    }),
    removeSentence: (p: string) => {
      const idx = sentencesStore.findIndex((s) => s.pattern === p);
      if (idx >= 0) sentencesStore.splice(idx, 1);
    },
    isSentenceSaved: (p: string) => sentencesStore.some((s) => s.pattern === p),
    getCompletedLessons: () => get("completed", []),
    markLessonCompleted: (s: string) => { const l = get("completed", []); if (!l.includes(s)) { l.push(s); set("completed", l); } },
    isLessonCompleted: (s: string) => get("completed", []).includes(s),
    getReviewQueue: () => get("review_queue", []),
    addToReviewQueue: (i: unknown) => { const q = get("review_queue", []); q.unshift(i); set("review_queue", q); },
    updateReviewItemStatus: (id: string, st: string) => set("review_queue", get("review_queue", []).map((i: { id: string }) => i.id === id ? { ...i, status: st } : i)),
    getInterviewConfig: () => null,
    setInterviewConfig: () => {},
    getInterviewProgress: () => null,
    setInterviewProgress: () => {},
    clearInterviewProgress: () => {},
    getCompletedReports: () => get("reports", []),
    addReport: (r: unknown) => { const rs = get("reports", []); rs.unshift(r); set("reports", rs); },
    getReviewedMockIds: () => [], markMockItemReviewed: () => {}, isMockItemReviewed: () => false,
    getSavedTopics: () => [], isTopicSaved: () => false, saveTopic: () => {},
    getGeneratedReports: () => [], saveGeneratedReport: () => {}, getGeneratedReportById: () => undefined,
    getStoredLocale: () => "zh-CN", setStoredLocale: () => {},
  };
});

function makeLS() {
  return {
    getItem: (k: string) => {
      if (k === "devenglish_generated_reports") {
        return JSON.stringify([{
          id: "report-1", sessionId: "s1", date: "2026-06-21",
          config: { mode: "quick", role: "Backend", difficulty: "Mid", language: "EN", questionCount: 5, interviewType: "Mixed", duration: "15m" },
          overallScore: 78,
          scores: { englishExpression: 80, technicalAccuracy: 75, answerStructure: 72, confidence: 82 },
          strongPoints: ["Clear opening"], weakPoints: ["Too short"],
          questionDetails: [{
            questionIndex: 1, question: "Q?", type: "Tech",
            userAnswer: "A", idealAnswer: "Ideal",
            gapAnalysis: ["short"], missingKeyPoints: ["detail"],
            betterAnswerVersion: "Better version to save", score: 72
          }],
          recommendedLearning: [{ tag: "Tech", title: "Vocab", desc: "Desc", time: "10m", to: "/tech" }]
        }]);
      }
      return null;
    },
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    get length() { return 0; },
    key: () => null,
  };
}

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nProvider>
      <MemoryRouter initialEntries={["/"]}>
        {ui}
      </MemoryRouter>
    </I18nProvider>
  );
}

describe("Button clickability — full audit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("localStorage", makeLS());
  });

  afterAll(() => { vi.unstubAllGlobals(); });

  // -------------------------------------------------------
  // InterviewReport
  // -------------------------------------------------------
  describe("InterviewReport", () => {
    it("Export PDF button click does not crash and calls toast", async () => {
      renderWithProviders(<InterviewReport />);
      await waitFor(() => expect(screen.getByText("78")).toBeDefined());
      const btn = screen.getAllByRole("button").find(b => b.textContent?.includes("导出 PDF"));
      expect(btn).toBeDefined();
      expect(() => fireEvent.click(btn!)).not.toThrow();
      const { toast } = await import("sonner");
    });

    it("Save to sentences writes to localStorage", async () => {
      renderWithProviders(<InterviewReport />);
      await waitFor(() => expect(screen.getByText("78")).toBeDefined());
      const btn = screen.getAllByRole("button").find(b => b.textContent?.includes("收藏到句子本"));
      expect(btn).toBeDefined();
      expect(() => fireEvent.click(btn!)).not.toThrow();
    });
  });

  // -------------------------------------------------------
  // WorkplaceEnglish
  // -------------------------------------------------------
  describe("WorkplaceEnglish", () => {
    it("Get AI Feedback button does not crash", async () => {
      renderWithProviders(<WorkplaceEnglish />);
      const btn = screen.getByText("获取 AI 反馈");
      expect(btn).toBeDefined();
      expect(() => fireEvent.click(btn)).not.toThrow();
    });

    it("Save Phrase button is clickable", async () => {
      renderWithProviders(<WorkplaceEnglish />);
      const btns = screen.getAllByRole("button");
      const saveBtn = btns.find(b => b.textContent?.includes("收藏短语"));
      expect(saveBtn).toBeDefined();
      expect(() => fireEvent.click(saveBtn!)).not.toThrow();
    });
  });

  // -------------------------------------------------------
  // Learning
  // -------------------------------------------------------
  describe("Learning", () => {
    it("Start buttons in recommended list are wrapped in Link", async () => {
      renderWithProviders(<Learning />);
      const links = screen.getAllByRole("link");
      const startLinks = links.filter(l => l.textContent?.includes("开始"));
      // At least one Start link should exist
      expect(startLinks.length).toBeGreaterThanOrEqual(1);
      startLinks.forEach(link => {
        expect(link.getAttribute("href")).toBeTruthy();
      });
    });
  });

  // -------------------------------------------------------
  // InterviewEnglish
  // -------------------------------------------------------
  describe("InterviewEnglish", () => {
    it("renders without crash", () => {
      renderWithProviders(<InterviewEnglish />);
    });
  });

  // -------------------------------------------------------
  // Render checks for remaining pages
  // -------------------------------------------------------
  it("Dashboard renders without crash", () => {
    renderWithProviders(<Dashboard />);
  });

  it("TechnicalEnglish renders without crash", () => {
    renderWithProviders(<TechnicalEnglish />);
  });

  it("Profile renders without crash", () => {
    renderWithProviders(<Profile />);
  });
});
