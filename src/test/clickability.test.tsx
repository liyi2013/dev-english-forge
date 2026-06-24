import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import InterviewReport from "@/pages/InterviewReport";
import TechnicalEnglish from "@/pages/TechnicalEnglish";
import Profile from "@/pages/Profile";
import WorkplaceEnglish from "@/pages/WorkplaceEnglish";
import Learning from "@/pages/Learning";
import Dashboard from "@/pages/Dashboard";
import InterviewEnglish from "@/pages/InterviewEnglish";
import SearchResults from "@/pages/SearchResults";
import AppLayout from "@/components/AppLayout";
import AIInterviewLobby from "@/pages/AIInterviewLobby";
import Review from "@/pages/Review";
import { SpeakTab } from "@/pages/topic/SpeakTab";
import LearningPathDetail from "@/pages/LearningPathDetail";
import ReviewSession from "@/pages/ReviewSession";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

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

const mockTopic = {
  slug: "restful-api",
  title: "RESTful API",
  titleZh: "RESTful API 设计",
  explainGoal: "Explain endpoints, status codes, and idempotency in English.",
  explainGoalZh: "学会用英语解释端点、状态码和幂等性。",
  level: "B1",
  progress: 65,
  unit: 4,
  totalUnits: 8,
  readingParagraph: "A RESTful API uses HTTP methods to expose resources.",
  keyPoints: ["endpoint", "status code"],
  vocabulary: [{ term: "endpoint", pronunciation: "/ˈendpɔɪnt/", definitionEn: "A URL where an API resource can be accessed.", definitionZh: "API 的资源访问入口。", exampleSentence: "The /users endpoint returns a list." }],
  sentencePatterns: [{ pattern: "The API returns...", meaningZh: "API 返回...", example: "The API returns a 200 status." }],
  speakingPrompt: { prompt: "Explain RESTful API", promptZh: "解释 RESTful API", durationSeconds: 30 },
  interviewQuestion: { question: "What is REST?", idealAnswer: "REST is an architectural style.", commonMistakes: ["Confusing REST with HTTP"], keyPoints: ["stateless"] },
  commonMistakes: ["Missing status codes"],
};

describe("Button clickability — full audit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });

  afterEach(() => { vi.unstubAllGlobals(); });

  // =========== SpeakTab ===========
  describe("SpeakTab", () => {
    it("Record Answer button starts speaking mode", async () => {
      renderWP(<SpeakTab topic={mockTopic} />);
      const recordBtn = screen.getByText("录制回答");
      expect(recordBtn).toBeDefined();
      fireEvent.click(recordBtn);
      // After clicking Record, speaking UI should appear with the large mic button
      await waitFor(() => {
        // The stop button should appear
        expect(screen.getByText("00:00")).toBeDefined();
      });
    });

    it("Large mic button during recording is clickable and shows evaluation", async () => {
      renderWP(<SpeakTab topic={mockTopic} />);
      const recordBtn = screen.getByText("录制回答");
      expect(recordBtn).toBeDefined();
      fireEvent.click(recordBtn);
      await waitFor(() => expect(screen.getByText("00:00")).toBeDefined());
      // Assert the mic button exists and click it
      const micBtn = screen.getByLabelText("停止回答");
      fireEvent.click(micBtn);
      // After stopping, evaluation should appear
      await waitFor(() => {
        expect(screen.getByText("模拟评估")).toBeDefined();
        expect(screen.getByText("流利度")).toBeDefined();
      });
    });
  });

  // =========== AIInterviewLobby ===========
  describe("AIInterviewLobby", () => {
    it("Start Interview button writes config to localStorage", async () => {
      renderWP(<AIInterviewLobby />);
      const startLink = screen.getByText("开始面试").closest("a");
      expect(startLink).toBeDefined();
      expect(startLink!.getAttribute("href")).toBe("/ai-interview/room");
      // Click the start link
      fireEvent.click(startLink!);
      // After click, config should be in localStorage
      const stored = localStorage.getItem("devenglish_interview_config");
      expect(stored).not.toBeNull();
      const config = JSON.parse(stored!);
      expect(config.mode).toBeDefined();
      expect(config.role).toBeDefined();
      expect(config.difficulty).toBeDefined();
      expect(config.language).toBeDefined();
      expect(config.questionCount).toBeDefined();
      expect(config.interviewType).toBeDefined();
      expect(config.duration).toBeDefined();
    });
  });

  // =========== Review ===========
  describe("Review", () => {
    it("Speak again link points to /ai-interview lobby", async () => {
      localStorage.setItem("devenglish_reviewed_mock_item_ids", JSON.stringify([]));
      localStorage.setItem("devenglish_review_queue", JSON.stringify([]));
      renderWP(<Review />);
      const links = screen.getAllByRole("link");
      // Check for "再说一遍" in DOM
      const speakAgainTexts = links.filter(l => (l.textContent || "").includes("再说一遍"));
      expect(speakAgainTexts.length).toBeGreaterThanOrEqual(1);
      speakAgainTexts.forEach(link => {
        const href = link.getAttribute("href");
        expect(href).toBe("/ai-interview");
      });
    });
  });

  // =========== InterviewReport ===========
  describe("InterviewReport", () => {
    beforeEach(() => {
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
      const cards = screen.getAllByRole("button", { name: /即将推出|Coming soon/i });
      expect(cards.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(cards[0]);
      expect(vi.mocked(toast.info)).toHaveBeenCalled();
    });
  });

  // =========== InterviewEnglish ===========
  describe("InterviewEnglish", () => {
    it("Scenario cards are clickable and call toast.info", async () => {
      renderWP(<InterviewEnglish />);
      const cards = screen.getAllByRole("button", { name: /即将推出|Coming soon/i });
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

  // =========== AppLayout search & notifications ===========
  describe("AppLayout", () => {
    it("search form navigates to /search?q=...", () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<AppLayout />} />
              <Route path="/search" element={<div data-testid="search-page" />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Find the input and submit a search
      const input = screen.getByPlaceholderText(/搜索|Search/i);
      expect(input).toBeDefined();
      fireEvent.change(input, { target: { value: "Redis" } });
      fireEvent.submit(input.closest("form")!);
      // After submit, the search page element should appear
      expect(screen.getByTestId("search-page")).toBeDefined();
    });

    it("notification bell calls toast.info", () => {
      renderWP(<AppLayout />);
      const bellBtn = screen.getByLabelText("通知");
      fireEvent.click(bellBtn);
      expect(vi.mocked(toast.info)).toHaveBeenCalled();
    });
  });

  // =========== LanguageSwitcher ===========
  describe("LanguageSwitcher", () => {
    it("toggles locale and persists to localStorage", () => {
      renderWP(<AppLayout />);
      // Find the language switch button (shows "EN" when locale is zh-CN)
      const langBtn = screen.getByText("EN");
      expect(langBtn).toBeDefined();
      fireEvent.click(langBtn);
      // After clicking, button should show 中文
      expect(screen.getByText("中文")).toBeDefined();
      const stored = localStorage.getItem("devenglish_locale");
      expect(stored).toBe("en-US");
    });
  });

  // =========== AppLayout i18n ===========
  describe("AppLayout i18n", () => {
    it("shows Chinese streak text and no raw keys on initial zh-CN render", async () => {
      // Clear localStorage locale to ensure default zh-CN
      localStorage.removeItem("devenglish_locale");
      renderWP(<AppLayout />);
      // Should see Chinese streak text
      expect(screen.getByText("12 天连续学习")).toBeDefined();
      // Should NOT see raw i18n keys
      expect(screen.queryByText("nav.streak")).toBeNull();
      expect(screen.queryByText("nav.streakHint")).toBeNull();
      expect(screen.queryByText("common.notifications")).toBeNull();
      // On zh-CN, notification aria-label should be 通知
      const bellBtn = screen.getByLabelText("通知");
      expect(bellBtn).toBeDefined();
    });

    it("switches to English and shows English streak text", async () => {
      localStorage.removeItem("devenglish_locale");
      renderWP(<AppLayout />);
      // Switch language
      const langBtn = screen.getByText("EN");
      fireEvent.click(langBtn);
      // After switching to en-US, the streak text should be English
      // en-US is async-loaded, so waitFor is needed
      await waitFor(() => {
        expect(screen.getByText("12-day streak")).toBeDefined();
      });
      // Language switcher button should now show 中文
      expect(screen.getByText("中文")).toBeDefined();
      const stored = localStorage.getItem("devenglish_locale");
      expect(stored).toBe("en-US");
    });
  });

  // =========== SearchResults ===========
  describe("SearchResults", () => {
    it("renders without crash with search query", () => {
      expect(() => {
        render(
          <I18nProvider>
            <MemoryRouter initialEntries={["/search?q=latency"]}>
              <SearchResults />
            </MemoryRouter>
          </I18nProvider>
        );
      }).not.toThrow();
    });

    it("vocab save button writes to localStorage", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/search?q=latency"]}>
            <SearchResults />
          </MemoryRouter>
        </I18nProvider>
      );
      // Wait for the component to render content
      await waitFor(() => {
        // Check for the input field (search box)
        expect(screen.getByPlaceholderText(/搜索|search/i)).toBeDefined();
      });
      // Find save buttons that say "收藏"
      const saveBtns = screen.getAllByRole("button").filter(b => b.textContent?.trim() === "收藏");
      expect(saveBtns.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(saveBtns[0]);
      const stored = localStorage.getItem("devenglish_vocab");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0].term).toContain("latency");
    });
  });

  // =========== Other pages ===========
  it("Dashboard renders without crash", () => { renderWP(<Dashboard />); });
  it("TechnicalEnglish path cards link to paths detail", async () => {
    renderWP(<TechnicalEnglish />);
    // Backend English card should be a link, not a coming-soon button
    const backendLink = screen.getByText("后端英语").closest("a");
    expect(backendLink).toBeDefined();
    expect(backendLink!.getAttribute("href")).toBe("/technical-english/paths/backend-english");
    // System Design English
    const systemLink = screen.getByText("系统设计英语").closest("a");
    expect(systemLink).toBeDefined();
    expect(systemLink!.getAttribute("href")).toBe("/technical-english/paths/system-design-english");
    // DevOps English
    const devopsLink = screen.getByText("DevOps 英语").closest("a");
    expect(devopsLink).toBeDefined();
    expect(devopsLink!.getAttribute("href")).toBe("/technical-english/paths/devops-english");
  });
  it("Profile renders without crash", () => { renderWP(<Profile />); });
});

  // =========== Learning Path Detail page ===========
  describe("LearningPathDetail", () => {
    it("Learning page path cards link to learning path detail", async () => {
      renderWP(<Learning />);
      // Find the Continue buttons wrapped in Link - each should link to /learning/{slug}
      const continueLinks = screen.getAllByText("继续");
      expect(continueLinks.length).toBeGreaterThanOrEqual(3);
      // First Continue should link to /learning/backend-english
      const link1 = continueLinks[0].closest("a");
      expect(link1).toBeDefined();
      expect(link1!.getAttribute("href")).toBe("/learning/backend-english");
      // Second Continue should link to /learning/interview-english
      const link2 = continueLinks[1].closest("a");
      expect(link2).toBeDefined();
      expect(link2!.getAttribute("href")).toBe("/learning/interview-english");
      // Third Continue should link to /learning/workplace-english
      const link3 = continueLinks[2].closest("a");
      expect(link3).toBeDefined();
      expect(link3!.getAttribute("href")).toBe("/learning/workplace-english");
    });

    it("shows path detail with modules for backend-english", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/learning/backend-english"]}>
            <Routes>
              <Route path="/learning/:pathSlug" element={<LearningPathDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Should show path name
      expect(screen.getByText("后端英语")).toBeDefined();
      // Should show milestone
      expect(screen.getAllByText(/里程碑：用 3 分钟/i).length).toBeGreaterThanOrEqual(1);
      // Should show modules
      expect(screen.getAllByText("RESTful API").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("数据库").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Redis 缓存").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("RabbitMQ 消息队列").length).toBeGreaterThanOrEqual(1);
    });

    it("shows recommended topics for backend-english", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/learning/backend-english"]}>
            <Routes>
              <Route path="/learning/:pathSlug" element={<LearningPathDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Should show recommended topics section
      await waitFor(() => {
        expect(screen.getByText("推荐主题")).toBeDefined();
      });
      // RESTful API topic card should be visible
      await waitFor(() => {
        // Find the RESTful API text that's inside a TopicCard link
        const topicCard = screen.getByText("RESTful API 设计");
        expect(topicCard).toBeDefined();
      });
    });

    it("topic card links to technical-english topic page", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/learning/backend-english"]}>
            <Routes>
              <Route path="/learning/:pathSlug" element={<LearningPathDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      await waitFor(() => {
        const restfulCards = screen.getAllByText("RESTful API");
        // Find the one that's inside a link to /technical-english/restful-api
        const cardLink = restfulCards.find(el => el.closest("a")?.getAttribute("href")?.includes("/technical-english/restful-api"));
        expect(cardLink).toBeDefined();
        expect(cardLink!.closest("a")!.getAttribute("href")).toContain("/technical-english/restful-api");
      });
    });

    it("shows empty state for unknown path", () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/learning/nonexistent-path"]}>
            <Routes>
              <Route path="/learning/:pathSlug" element={<LearningPathDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("路径未找到")).toBeDefined();
    });
  });

  // =========== Review Session page ===========
  describe("ReviewSession", () => {
    it("Review page has link to /review/session", () => {
      renderWP(<Review />);
      const sessionLink = screen.getByText("开始复习").closest("a");
      expect(sessionLink).toBeDefined();
      expect(sessionLink!.getAttribute("href")).toBe("/review/session");
    });

    it("shows mode selection cards", () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/review/session"]}>
            <Routes>
              <Route path="/review/session" element={<ReviewSession />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("错题复习")).toBeDefined();
      expect(screen.getByText("词汇复习")).toBeDefined();
      expect(screen.getByText("句型复习")).toBeDefined();
      expect(screen.getByText("混合复习")).toBeDefined();
    });

    it("clicking wrong answers mode starts session", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/review/session"]}>
            <Routes>
              <Route path="/review/session" element={<ReviewSession />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const wrongModeBtn = screen.getByText("错题复习");
      fireEvent.click(wrongModeBtn);
      // Should enter session mode with progress bar
      await waitFor(() => {
        expect(screen.getByText("下一题")).toBeDefined();
      });
    });

    it("back link goes to /review", () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/review/session"]}>
            <Routes>
              <Route path="/review/session" element={<ReviewSession />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const backLink = screen.getByText("返回复盘").closest("a");
      expect(backLink).toBeDefined();
      expect(backLink!.getAttribute("href")).toBe("/review");
    });

    it("shows empty state when no review items exist", () => {
      // Clear localStorage to ensure no items
      localStorage.clear();
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/review/session"]}>
            <Routes>
              <Route path="/review/session" element={<ReviewSession />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Still in mode selection, should see the modes
      expect(screen.getByText("错题复习")).toBeDefined();
    });
  });
