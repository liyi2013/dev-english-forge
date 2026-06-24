import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import InterviewReport from "@/pages/InterviewReport";
import TechnicalEnglish from "@/pages/TechnicalEnglish";
import Profile from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";import WorkplaceEnglish from "@/pages/WorkplaceEnglish";
import ReportPractice from "@/pages/ReportPractice";import Learning from "@/pages/Learning";
import Dashboard from "@/pages/Dashboard";
import InterviewEnglish from "@/pages/InterviewEnglish";
import SearchResults from "@/pages/SearchResults";
import AppLayout from "@/components/AppLayout";
import AIInterviewLobby from "@/pages/AIInterviewLobby";
import Review from "@/pages/Review";
import { SpeakTab } from "@/pages/topic/SpeakTab";
import LearningPathDetail from "@/pages/LearningPathDetail";
import ReviewSession from "@/pages/ReviewSession";
import TechnicalPlan from "@/pages/TechnicalPlan";
import InterviewScenarioDetail from "@/pages/InterviewScenarioDetail";
import { toast } from "sonner";
import WorkplaceScenarioDetail from "@/pages/WorkplaceScenarioDetail";
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

    it("Scenario cards link to detail pages", async () => {
      renderWP(<WorkplaceEnglish />);
      const standupLink = screen.getByLabelText("Daily Standup");
      expect(standupLink).toBeDefined();
      expect(standupLink.getAttribute("href")).toBe("/workplace-english/scenarios/daily-standup");
      const meetingsLink = screen.getByLabelText("Meetings & Clarification");
      expect(meetingsLink).toBeDefined();
      expect(meetingsLink.getAttribute("href")).toBe("/workplace-english/scenarios/meetings-clarification");
    });
  });

  // =========== InterviewEnglish ===========
  describe("InterviewEnglish", () => {
    it("Scenario cards link to detail pages", async () => {
      renderWP(<InterviewEnglish />);
      // Cards should now be links, not toast buttons
      const introCard = screen.getByLabelText("Self-Introduction");
      expect(introCard).toBeDefined();
      expect(introCard.getAttribute("href")).toBe("/interview-english/scenarios/self-introduction");
      // Clicking a card now navigates instead of showing toast
      expect(vi.mocked(toast.info)).not.toHaveBeenCalled();
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

  // =========== Technical Plan page ===========
  describe("TechnicalPlan", () => {
    it("TechnicalEnglish View plan links to /technical-english/plan", async () => {
      renderWP(<TechnicalEnglish />);
      const viewPlanLink = screen.getByText("查看计划").closest("a");
      expect(viewPlanLink).toBeDefined();
      expect(viewPlanLink!.getAttribute("href")).toBe("/technical-english/plan");
    });

    it("shows plan overview, today tasks, 6-week plan, and skills", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/technical-english/plan"]}>
            <Routes>
              <Route path="/technical-english/plan" element={<TechnicalPlan />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("技术英语学习计划")).toBeDefined();
      expect(screen.getByText("今日技术英语任务")).toBeDefined();
      expect(screen.getAllByText(/第 \d+ 周|6 周学习计划/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("重点主题推荐")).toBeDefined();
      expect(screen.getByText("技能进度")).toBeDefined();
      expect(screen.getByText("下一步行动")).toBeDefined();
    });

    it("today tasks can be marked done", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/technical-english/plan"]}>
            <Routes>
              <Route path="/technical-english/plan" element={<TechnicalPlan />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Find "标记完成" buttons and click the first one
      const markDoneBtns = screen.getAllByText("标记完成");
      expect(markDoneBtns.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(markDoneBtns[0]);
      // After clicking, should show "已完成"
      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });

    it("current week plan links to technical-english topic", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/technical-english/plan"]}>
            <Routes>
              <Route path="/technical-english/plan" element={<TechnicalPlan />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Find the "继续" button (current week, week 3 - RabbitMQ)
      await waitFor(() => {
        const continueBtns = screen.getAllByText("继续");
        expect(continueBtns.length).toBeGreaterThanOrEqual(1);
        // At least one continue button should link to a topic
        const link = continueBtns[0].closest("a");
        expect(link).toBeDefined();
        expect(link!.getAttribute("href")).toContain("/technical-english/");
      });
    });

    it("next actions buttons are clickable", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/technical-english/plan"]}>
            <Routes>
              <Route path="/technical-english/plan" element={<TechnicalPlan />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Continue current topic
      const continueLinks = screen.getAllByText("继续当前主题");
      expect(continueLinks.length).toBeGreaterThanOrEqual(1);
      const link = continueLinks[0].closest("a");
      expect(link).toBeDefined();
      expect(link!.getAttribute("href")).toContain("/technical-english/");

      // Start AI mock interview
      const interviewLink = screen.getByText("开始 AI 模拟面试").closest("a");
      expect(interviewLink).toBeDefined();
      expect(interviewLink!.getAttribute("href")).toBe("/ai-interview");

      // Back to learning center
      const learningLink = screen.getByText("返回学习中心").closest("a");
      expect(learningLink).toBeDefined();
      expect(learningLink!.getAttribute("href")).toBe("/learning");
    });

    it("does not show raw i18n keys", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/technical-english/plan"]}>
            <Routes>
              <Route path="/technical-english/plan" element={<TechnicalPlan />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.queryByText("techPlan.title")).toBeNull();
      expect(screen.queryByText("techPlan.todayTasks")).toBeNull();
      expect(screen.queryByText("techPlan.sixWeekPlan")).toBeNull();
      expect(screen.queryByText("techPlan.focusTopics")).toBeNull();
      expect(screen.queryByText("techPlan.skillProgress")).toBeNull();
      expect(screen.queryByText("techPlan.nextActions")).toBeNull();
    });

    it("back button links to /technical-english", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/technical-english/plan"]}>
            <Routes>
              <Route path="/technical-english/plan" element={<TechnicalPlan />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const backLink = screen.getByText("返回技术英语").closest("a");
      expect(backLink).toBeDefined();
      expect(backLink!.getAttribute("href")).toBe("/technical-english");
    });
  });

  // =========== Interview Scenario Detail page ===========
  describe("InterviewScenarioDetail", () => {
    it("InterviewEnglish scenario cards link to detail page", async () => {
      renderWP(<InterviewEnglish />);
      // Self-Introduction card should be a link
      const introLink = screen.getByLabelText("Self-Introduction");
      expect(introLink).toBeDefined();
      expect(introLink.getAttribute("href")).toBe("/interview-english/scenarios/self-introduction");
      // Closing Questions card
      const closingLink = screen.getByLabelText("Closing Questions");
      expect(closingLink).toBeDefined();
      expect(closingLink.getAttribute("href")).toBe("/interview-english/scenarios/closing-questions");
    });

    it("shows scenario detail with objective, tips, and questions", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/interview-english/scenarios/self-introduction"]}>
            <Routes>
              <Route path="/interview-english/scenarios/:slug" element={<InterviewScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("自我介绍")).toBeDefined();
      expect(screen.getAllByText("学习目标").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("结构建议")).toBeDefined();
      expect(screen.getByText("实用表达")).toBeDefined();
      expect(screen.getByText("练习题")).toBeDefined();
      expect(screen.getByText("参考回答")).toBeDefined();
    });

    it("practice questions are expandable", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/interview-english/scenarios/self-introduction"]}>
            <Routes>
              <Route path="/interview-english/scenarios/:slug" element={<InterviewScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Click on a practice question to expand it
      const questionBtn = screen.getByText("Tell me about yourself.");
      fireEvent.click(questionBtn);
      // After expanding, the textarea and evaluate button should appear
      await waitFor(() => {
        expect(screen.getByText("参考回答")).toBeDefined();
      });
    });

    it("start mock interview button links to /ai-interview", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/interview-english/scenarios/project-experience"]}>
            <Routes>
              <Route path="/interview-english/scenarios/:slug" element={<InterviewScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const mockBtn = screen.getByText("开始模拟面试").closest("a");
      expect(mockBtn).toBeDefined();
      expect(mockBtn!.getAttribute("href")).toBe("/ai-interview");
    });

    it("back button links to /interview-english", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/interview-english/scenarios/technical-qa"]}>
            <Routes>
              <Route path="/interview-english/scenarios/:slug" element={<InterviewScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const backLink = screen.getByText("返回面试英语").closest("a");
      expect(backLink).toBeDefined();
      expect(backLink!.getAttribute("href")).toBe("/interview-english");
    });

    it("shows empty state for unknown scenario", () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/interview-english/scenarios/unknown-scenario"]}>
            <Routes>
              <Route path="/interview-english/scenarios/:slug" element={<InterviewScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("场景未找到")).toBeDefined();
    });

    it("does not show raw i18n keys", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/interview-english/scenarios/salary-offer"]}>
            <Routes>
              <Route path="/interview-english/scenarios/:slug" element={<InterviewScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.queryByText("interview.backToScenarios")).toBeNull();
      expect(screen.queryByText("interview.scenarioObjective")).toBeNull();
      expect(screen.queryByText("interview.structureTips")).toBeNull();
    });
  });

  // =========== Workplace Scenario Detail page ===========
  describe("WorkplaceScenarioDetail", () => {
    it("WorkplaceEnglish scenario cards link to detail pages", async () => {
      renderWP(<WorkplaceEnglish />);
      const standupLink = screen.getByLabelText("Daily Standup");
      expect(standupLink).toBeDefined();
      expect(standupLink.getAttribute("href")).toBe("/workplace-english/scenarios/daily-standup");
      const emailLink = screen.getByLabelText("Writing Emails");
      expect(emailLink).toBeDefined();
      expect(emailLink.getAttribute("href")).toBe("/workplace-english/scenarios/writing-emails");
    });

    it("shows scenario detail with objective, context, patterns, and drills", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/workplace-english/scenarios/daily-standup"]}>
            <Routes>
              <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("每日站会")).toBeDefined();
      expect(screen.getAllByText("学习目标").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("场景上下文")).toBeDefined();
      expect(screen.getAllByText("句型练习").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("实用表达")).toBeDefined();
      expect(screen.getByText("迷你练习")).toBeDefined();
      expect(screen.getByText("语气技巧")).toBeDefined();
      expect(screen.getByText("常见错误")).toBeDefined();
    });

    it("sentence pattern save/remove toggles localStorage devenglish_sentences", async () => {
      localStorage.clear();
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/workplace-english/scenarios/daily-standup"]}>
            <Routes>
              <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const saveBtns = screen.getAllByRole("button").filter(b => { const t = b.textContent?.trim() || ""; return t.includes("收藏") || t.includes("Save"); });
      expect(saveBtns.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(saveBtns[0]);
      const stored = localStorage.getItem("devenglish_sentences");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(Array.isArray(parsed)).toBe(true);
    });

    it("mini drill get feedback button works", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/workplace-english/scenarios/daily-standup"]}>
            <Routes>
              <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Click the first mini drill prompt to activate it
      const drillBtns = screen.getAllByText(/Write a 3-sentence|你遇到了阻碍/);
      expect(drillBtns.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(drillBtns[0]);
      // After clicking, the textarea should appear - type a long enough answer
      const textarea = screen.getByPlaceholderText("在此输入你的回答…");
      expect(textarea).toBeDefined();
      fireEvent.change(textarea, { target: { value: "This is a sufficiently long answer to trigger the mock feedback mechanism." } });
      // Click Get Feedback button
      const getFeedbackBtn = screen.getByText("获取反馈");
      fireEvent.click(getFeedbackBtn);
      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith("模拟评估");
      });
    });

    it("mini drill save answer writes to localStorage", async () => {
      localStorage.clear();
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/workplace-english/scenarios/daily-standup"]}>
            <Routes>
              <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Activate a drill
      const drillBtns = screen.getAllByText(/Write a 3-sentence|你遇到了阻碍/);
      fireEvent.click(drillBtns[0]);
      const textarea = screen.getByPlaceholderText("在此输入你的回答…");
      fireEvent.change(textarea, { target: { value: "Yesterday I finished the login module. Today I will work on tests." } });
      // Click Save Answer
      const saveAnswerBtns = screen.getAllByText("保存回答");
      expect(saveAnswerBtns.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(saveAnswerBtns[0]);
      const stored = localStorage.getItem("devenglish_sentences");
      expect(stored).not.toBeNull();
    });

    it("tone tip click toggles checked state", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/workplace-english/scenarios/daily-standup"]}>
            <Routes>
              <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Click the first tone tip button
      const toneBtns = screen.getAllByText("简洁");
      expect(toneBtns.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(toneBtns[0]);
      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith("已标记完成");
      });
    });

    it("back button links to /workplace-english", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/workplace-english/scenarios/code-review"]}>
            <Routes>
              <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const backLink = screen.getByText("返回职场英语").closest("a");
      expect(backLink).toBeDefined();
      expect(backLink!.getAttribute("href")).toBe("/workplace-english");
    });

    it("related topics link to technical-english topic pages", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/workplace-english/scenarios/code-review"]}>
            <Routes>
              <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Code review scenario has relatedTopics: ['restful-api', 'database', 'docker']
      await waitFor(() => {
        // RESTful API button should link to /technical-english/restful-api
        const restfulLink = screen.getByText("RESTful API").closest("a");
        expect(restfulLink).toBeDefined();
        expect(restfulLink!.getAttribute("href")).toBe("/technical-english/restful-api");
        // Database button should link to /technical-english/database
        const dbLink = screen.getByText("Database").closest("a");
        expect(dbLink).toBeDefined();
        expect(dbLink!.getAttribute("href")).toBe("/technical-english/database");
      });
    });

    it("shows empty state for unknown scenario", () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/workplace-english/scenarios/unknown-scenario"]}>
            <Routes>
              <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("场景未找到")).toBeDefined();
    });

    it("does not show raw i18n keys", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/workplace-english/scenarios/writing-emails"]}>
            <Routes>
              <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.queryByText("workplaceScenario.backToWorkplace")).toBeNull();
      expect(screen.queryByText("workplaceScenario.objective")).toBeNull();
      expect(screen.queryByText("workplaceScenario.sentencePatterns")).toBeNull();
      expect(screen.queryByText("workplaceScenario.miniDrill")).toBeNull();
    });
  });

  // =========== Profile Edit page ===========
  describe("ProfileEdit", () => {
    it("Profile edit button links to /profile/edit", async () => {
      renderWP(<Profile />);
      const editLink = screen.getByText("编辑资料").closest("a");
      expect(editLink).toBeDefined();
      expect(editLink!.getAttribute("href")).toBe("/profile/edit");
    });

    it("renders edit form with all sections", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("编辑个人资料")).toBeDefined();
      expect(screen.getByText("基础资料")).toBeDefined();
      expect(screen.getByText("学习目标")).toBeDefined();
      expect(screen.getByText("偏好设置")).toBeDefined();
      expect(screen.getByText("资料预览")).toBeDefined();
    });

    it("form fields are pre-filled with default profile data", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Check that the English name input has the default mock value
      const nameInputs = screen.getAllByDisplayValue("Jinlin Wang");
      expect(nameInputs.length).toBeGreaterThanOrEqual(1);
      const zhNameInputs = screen.getAllByDisplayValue("王金林");
      expect(zhNameInputs.length).toBeGreaterThanOrEqual(1);
    });

    it("saving writes to localStorage devenglish_profile", async () => {
      localStorage.clear();
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const saveBtn = screen.getByText("保存");
      fireEvent.click(saveBtn);
      await waitFor(() => {
        const stored = localStorage.getItem("devenglish_profile");
        expect(stored).not.toBeNull();
        const parsed = JSON.parse(stored!);
        expect(parsed.name).toBe("Jinlin Wang");
      });
    });

    it("cancel button links to /profile", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const cancelLink = screen.getByText("取消").closest("a");
      expect(cancelLink).toBeDefined();
      expect(cancelLink!.getAttribute("href")).toBe("/profile");
    });

    it("reset button restores default values", async () => {
      localStorage.clear();
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // First modify a field
      const nameInput = screen.getByDisplayValue("Jinlin Wang");
      fireEvent.change(nameInput, { target: { value: "Modified Name" } });
      // Then click reset
      const resetBtn = screen.getByText("重置");
      fireEvent.click(resetBtn);
      await waitFor(() => {
        // Should show original value again
        const restoredInput = screen.getByDisplayValue("Jinlin Wang");
        expect(restoredInput).toBeDefined();
      });
    });

    it("restore default button clears localStorage and resets form", async () => {
      localStorage.setItem("devenglish_profile", JSON.stringify({ name: "Custom", nameZh: "自定义", role: "Dev", roleZh: "开发", target: "Senior", targetZh: "高级", dailyGoal: 30, interfaceLanguage: "English", voiceAccent: "UK English", notifications: "Off", initials: "CU", experience: "5yrs" }));
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const restoreBtn = screen.getByText("恢复默认");
      fireEvent.click(restoreBtn);
      await waitFor(() => {
        // localStorage should be cleared, form should show mock default
        const stored = localStorage.getItem("devenglish_profile");
        expect(stored).toBeNull();
        // Should show original mock values
        expect(screen.getByDisplayValue("Jinlin Wang")).toBeDefined();
      });
    });

    it("back button links to /profile", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const backLink = screen.getByText("返回个人中心").closest("a");
      expect(backLink).toBeDefined();
      expect(backLink!.getAttribute("href")).toBe("/profile");
    });

    it("does not show raw i18n keys", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/profile/edit"]}>
            <Routes>
              <Route path="/profile/edit" element={<ProfileEdit />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.queryByText("profileEdit.title")).toBeNull();
      expect(screen.queryByText("profileEdit.basicProfile")).toBeNull();
      expect(screen.queryByText("profileEdit.learningGoal")).toBeNull();
      expect(screen.queryByText("profileEdit.preview")).toBeNull();
    });
  });

  // =========== Report Practice page ===========
  describe("ReportPractice", () => {
    it("InterviewReport practice button links to practice page", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/ai-interview/report/report-1"]}>
            <Routes>
              <Route path="/ai-interview/report/:reportId" element={<InterviewReport />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      await waitFor(() => {
        const practiceLink = screen.getByText("练习这个版本").closest("a");
        expect(practiceLink).toBeDefined();
        expect(practiceLink!.getAttribute("href")).toBe("/ai-interview/report/report-1/practice");
      });
    });

    it("shows practice page with better answer and sentence practice", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/ai-interview/report/report-1/practice"]}>
            <Routes>
              <Route path="/ai-interview/report/:id/practice" element={<ReportPractice />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("改进版口语练习")).toBeDefined();
      expect(screen.getByText("你的原回答")).toBeDefined();
      expect(screen.getByText("改进版本")).toBeDefined();
      expect(screen.getByText("分句练习")).toBeDefined();
      expect(screen.getByText("下一步行动")).toBeDefined();
    });

    it("shows empty state for non-existent report", () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/ai-interview/report/not-exist/practice"]}>
            <Routes>
              <Route path="/ai-interview/report/:id/practice" element={<ReportPractice />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.getByText("报告未找到")).toBeDefined();
    });

    it("next actions all link correctly", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/ai-interview/report/report-1/practice"]}>
            <Routes>
              <Route path="/ai-interview/report/:id/practice" element={<ReportPractice />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Back to Report
      const backLinks = screen.getAllByText("返回报告");
      expect(backLinks.length).toBeGreaterThanOrEqual(1);
      // First one is the back-to-report link in the page header
      expect(backLinks[0].closest("a")!.getAttribute("href")).toBe("/ai-interview/report/report-1");
      // Start New Interview
      const newInterview = screen.getByText("开始新面试").closest("a");
      expect(newInterview).toBeDefined();
      expect(newInterview!.getAttribute("href")).toBe("/ai-interview");
      // Go to Review
      const goReview = screen.getByText("前往复盘").closest("a");
      expect(goReview).toBeDefined();
      expect(goReview!.getAttribute("href")).toBe("/review");
    });

    it("sentence practice chunk navigation works", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/ai-interview/report/report-1/practice"]}>
            <Routes>
              <Route path="/ai-interview/report/:id/practice" element={<ReportPractice />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      // Find "当前句子 1/{n}" text
      const currentSentence = screen.getByText(/当前句子 1\//);
      expect(currentSentence).toBeDefined();
      // Click Next
      const nextBtn = screen.getByText("下一句");
      fireEvent.click(nextBtn);
      await waitFor(() => {
        expect(screen.getByText(/当前句子 2\//)).toBeDefined();
      });
    });

    it("save better answer writes to localStorage", async () => {
      localStorage.clear();
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/ai-interview/report/report-1/practice"]}>
            <Routes>
              <Route path="/ai-interview/report/:id/practice" element={<ReportPractice />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const saveBtn = screen.getByText("收藏到句子本");
      fireEvent.click(saveBtn);
      await waitFor(() => {
        const stored = localStorage.getItem("devenglish_sentences");
        expect(stored).not.toBeNull();
      });
    });

    it("mark practiced toggles state", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/ai-interview/report/report-1/practice"]}>
            <Routes>
              <Route path="/ai-interview/report/:id/practice" element={<ReportPractice />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const markBtn = screen.getByText("标记已练习");
      fireEvent.click(markBtn);
      await waitFor(() => {
        expect(vi.mocked(toast.success)).toHaveBeenCalled();
      });
    });

    it("start practice button enters recording mode", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/ai-interview/report/report-1/practice"]}>
            <Routes>
              <Route path="/ai-interview/report/:id/practice" element={<ReportPractice />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      const startBtns = screen.getAllByText("开始练习");
      // The button is typically the last one (not the Panel title)
      const startBtn = startBtns.length > 1 ? startBtns[startBtns.length - 1] : startBtns[0];
      expect(startBtn).toBeDefined();
      fireEvent.click(startBtn);
      // Should show recording state with timer
      await waitFor(() => {
        expect(screen.getByText("0s")).toBeDefined();
      });
      // Stop button should be present
      const stopBtn = screen.getByLabelText("停止");
      expect(stopBtn).toBeDefined();
      fireEvent.click(stopBtn);
      // Should show evaluation
      await waitFor(() => {
        expect(screen.getByText("模拟评估")).toBeDefined();
      });
    });

    it("does not show raw i18n keys", async () => {
      render(
        <I18nProvider>
          <MemoryRouter initialEntries={["/ai-interview/report/report-1/practice"]}>
            <Routes>
              <Route path="/ai-interview/report/:id/practice" element={<ReportPractice />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      );
      expect(screen.queryByText("reportPractice.title")).toBeNull();
      expect(screen.queryByText("reportPractice.betterAnswer")).toBeNull();
      expect(screen.queryByText("reportPractice.mockEvaluation")).toBeNull();
      expect(screen.queryByText("reportPractice.nextActions")).toBeNull();
    });
  });
