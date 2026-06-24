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

// Must use inline factory to avoid hoisting issues
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/mockStorage", () => {
  const PREFIX = "devenglish_";
  function get(key: string, fallback: unknown) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function set(key: string, value: unknown) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }
  function makeSaveSentence() {
    return vi.fn((entry: { pattern: string; savedAt: string }) => {
      const list = get("sentences", []);
      if (!list.find((s: { pattern: string }) => s.pattern === entry.pattern)) {
        list.push(entry);
        set("sentences", list);
      }
    });
  }
  return {
    getSavedVocabulary: () => get("vocab", []),
    saveVocabulary: (entry: { term: string; savedAt: string }) => {
      const list = get("vocab", []);
      if (!list.find((v: { term: string }) => v.term === entry.term)) {
        list.push(entry);
        set("vocab", list);
      }
    },
    removeVocabulary: (term: string) => set("vocab", get("vocab", []).filter((v: { term: string }) => v.term !== term)),
    isVocabSaved: (term: string) => get("vocab", []).some((v: { term: string }) => v.term === term),
    getSavedSentences: () => get("sentences", []),
    saveSentence: makeSaveSentence(),
    removeSentence: (pattern: string) => set("sentences", get("sentences", []).filter((s: { pattern: string }) => s.pattern !== pattern)),
    isSentenceSaved: (pattern: string) => get("sentences", []).some((s: { pattern: string }) => s.pattern === pattern),
    getCompletedLessons: () => get("completed", []),
    markLessonCompleted: (slug: string) => { const list = get("completed", []); if (!list.includes(slug)) { list.push(slug); set("completed", list); } },
    isLessonCompleted: (slug: string) => get("completed", []).includes(slug),
    getReviewQueue: () => get("review_queue", []),
    addToReviewQueue: (item: unknown) => { const q = get("review_queue", []); q.unshift(item); set("review_queue", q); },
    updateReviewItemStatus: (id: string, st: string) => set("review_queue", get("review_queue", []).map((i: { id: string }) => i.id === id ? { ...i, status: st } : i)),
    getInterviewConfig: () => null,
    setInterviewConfig: () => {},
    getInterviewProgress: () => null,
    setInterviewProgress: () => {},
    clearInterviewProgress: () => {},
    getCompletedReports: () => get("reports", []),
    addReport: (report: unknown) => { const r = get("reports", []); r.unshift(report); set("reports", r); },
    getReviewedMockIds: () => [],
    markMockItemReviewed: () => {},
    isMockItemReviewed: () => false,
    getSavedTopics: () => [],
    isTopicSaved: () => false,
    saveTopic: () => {},
    getGeneratedReports: () => [],
    saveGeneratedReport: () => {},
    getGeneratedReportById: () => undefined,
    getStoredLocale: () => "zh-CN",
    setStoredLocale: () => {},
  };
});

// Minimal localStorage stub
const lsData: Record<string, string> = {
  devenglish_locale: "zh-CN",
};
function makeLS() {
  const store = { ...lsData };
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    get length() { return Object.keys(store).length; },
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

describe("Button clickability", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeLS());
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("Dashboard renders without crash", () => {
    renderWithProviders(<Dashboard />);
  });

  it("TechnicalEnglish renders without crash", () => {
    renderWithProviders(<TechnicalEnglish />);
  });

  it("InterviewEnglish renders without crash", () => {
    renderWithProviders(<InterviewEnglish />);
  });

  it("WorkplaceEnglish renders without crash", () => {
    renderWithProviders(<WorkplaceEnglish />);
  });

  it("Profile renders without crash", () => {
    renderWithProviders(<Profile />);
  });

  it("Learning renders without crash", () => {
    renderWithProviders(<Learning />);
  });

  /** InterviewReport needs specific localStorage data to render */
  describe("InterviewReport", () => {
    beforeEach(() => {
      vi.stubGlobal("localStorage", makeLS());
      localStorage.setItem("devenglish_generated_reports", JSON.stringify([{
        id: "report-1", sessionId: "s1", date: "2026-06-21",
        config: { mode: "quick", role: "Backend", difficulty: "Mid", language: "EN", questionCount: 5, interviewType: "Mixed", duration: "15m" },
        overallScore: 78,
        scores: { englishExpression: 80, technicalAccuracy: 75, answerStructure: 72, confidence: 82 },
        strongPoints: ["Clear opening"], weakPoints: ["Too short"],
        questionDetails: [{
          questionIndex: 1, question: "Q?", type: "Tech",
          userAnswer: "A", idealAnswer: "Ideal",
          gapAnalysis: ["short"], missingKeyPoints: ["detail"],
          betterAnswerVersion: "Better version", score: 72
        }],
        recommendedLearning: [{ tag: "Tech", title: "Vocab", desc: "Desc", time: "10m", to: "/tech" }]
      }]));
    });

    it("Export PDF button exists and is clickable", async () => {
      renderWithProviders(<InterviewReport />);
      await waitFor(() => expect(screen.getByText("78")).toBeDefined());
      const btns = screen.getAllByRole("button");
      const exportBtn = btns.find(b => b.textContent?.includes("导出 PDF"));
      expect(exportBtn).toBeDefined();
      expect(() => fireEvent.click(exportBtn!)).not.toThrow();
    });

    it("New Session links to /ai-interview", async () => {
      renderWithProviders(<InterviewReport />);
      await waitFor(() => expect(screen.getByText("78")).toBeDefined());
      const links = screen.getAllByRole("link");
      const nl = links.find(l => l.textContent?.includes("新面试"));
      expect(nl).toBeDefined();
      expect(nl!.getAttribute("href")).toBe("/ai-interview");
    });
  });
});
