import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
import { toast } from "sonner";

// Auto-mock sonner — we can spy via vi.mocked(toast.info) etc.
vi.mock("sonner");

// Real in-memory localStorage for testing
function createMemoryLS() {
  const store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
    _store: store,
  };
}

let memLS: ReturnType<typeof createMemoryLS>;

function renderWP(ui: React.ReactElement) {
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
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });

  afterEach(() => { vi.unstubAllGlobals(); });

  // =========== InterviewReport ===========
  describe("InterviewReport", () => {
    beforeEach(() => {
      // Seed localStorage with a generated report
      const report = {
        id: "report-1", sessionId: "s1", date: "2026-06-21",
        config: { mode: "quick", role: "Backend", difficulty: "Mid", language: "EN", questionCount: 5, interviewType: "Mixed", duration: "15m" },
        overallScore: 78,
        scores: { englishExpression: 80, technicalAccuracy: 75, answerStructure: 72, confidence: 82 },
        strongPoints: ["Clear opening"], weakPoints: ["Too short"],
        questionDetails: [{
          questionIndex: 1, question: "Explain PUT vs POST?", type: "Tech",
          userAnswer: "PUT is idempotent", idealAnswer: "Ideal answer here",
          gapAnalysis: ["short"], missingKeyPoints: ["detail"],
          betterAnswerVersion: "A better version to practice and save to sentences", score: 72
        }],
        recommendedLearning: [{ tag: "Tech", title: "Vocab", desc: "Desc", time: "10m", to: "/tech" }]
      };
      localStorage.setItem("devenglish_generated_reports", JSON.stringify([report]));
    });

    it("Export PDF button calls toast.success", async () => {
      renderWP(<InterviewReport />);
      await waitFor(() => expect(screen.getByText("78")).toBeDefined());
      const btn = screen.getAllByRole("button").find(b => b.textContent?.includes("导出 PDF"));
      expect(btn).toBeDefined();
      fireEvent.click(btn!);
      expect(vi.mocked(toast.success)).toHaveBeenCalled();
    });

    it("Save to sentences writes to localStorage devenglish_sentences", async () => {
      renderWP(<InterviewReport />);
      await waitFor(() => expect(screen.getByText("78")).toBeDefined());
      const btn = screen.getAllByRole("button").find(b => b.textContent?.includes("收藏到句子本"));
      expect(btn).toBeDefined();
      fireEvent.click(btn!);
      const stored = localStorage.getItem("devenglish_sentences");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThanOrEqual(1);
      expect(parsed[0].pattern).toContain("practice");
    });
  });

  // =========== WorkplaceEnglish ===========
  describe("WorkplaceEnglish", () => {
    it("Get AI Feedback button does not crash", async () => {
      renderWP(<WorkplaceEnglish />);
      const btn = screen.getByText("获取 AI 反馈");
      expect(btn).toBeDefined();
      fireEvent.click(btn);
      expect(vi.mocked(toast.info)).toHaveBeenCalled();
    });

    it("Save Phrase writes sentence to localStorage", async () => {
      renderWP(<WorkplaceEnglish />);
      const btns = screen.getAllByRole("button");
      const saveBtn = btns.find(b => b.textContent?.includes("收藏短语"));
      expect(saveBtn).toBeDefined();
      fireEvent.click(saveBtn!);
      const stored = localStorage.getItem("devenglish_sentences");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBeGreaterThanOrEqual(1);
    });

    it("Scenario cards are clickable and call toast.info", async () => {
      renderWP(<WorkplaceEnglish />);
      const cards = document.querySelectorAll('[class*="cursor-pointer"]');
      expect(cards.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(cards[0]);
      expect(vi.mocked(toast.info)).toHaveBeenCalled();
    });
  });

  // =========== InterviewEnglish ===========
  describe("InterviewEnglish", () => {
    it("Scenario cards are clickable and call toast.info", async () => {
      renderWP(<InterviewEnglish />);
      const cards = document.querySelectorAll('[class*="cursor-pointer"]');
      expect(cards.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(cards[0]);
      expect(vi.mocked(toast.info)).toHaveBeenCalled();
    });
  });

  // =========== Learning ===========
  describe("Learning", () => {
    it('Recommended Start links point to /technical-english/{slug}', async () => {
      renderWP(<Learning />);
      const links = screen.getAllByRole("link");
      const startLinks = links.filter(l => l.textContent?.includes("开始"));
      expect(startLinks.length).toBeGreaterThanOrEqual(1);
      startLinks.forEach(link => {
        const href = link.getAttribute("href");
        expect(href).toMatch(/^\/technical-english\//);
        expect(href).not.toBe("#");
      });
    });
  });

  // =========== Other pages ===========
  it("Dashboard renders without crash", () => { renderWP(<Dashboard />); });
  it("TechnicalEnglish renders without crash", () => { renderWP(<TechnicalEnglish />); });
  it("Profile renders without crash", () => { renderWP(<Profile />); });
});
