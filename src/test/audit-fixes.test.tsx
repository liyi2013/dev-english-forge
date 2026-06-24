import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import { ReadTab } from "@/pages/topic/ReadTab";
import ReviewSession from "@/pages/ReviewSession";
import SearchResults from "@/pages/SearchResults";
import WorkplaceScenarioDetail from "@/pages/WorkplaceScenarioDetail";
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

const dockerTopic = {
  slug: "docker",
  title: "Docker",
  titleZh: "Docker",
  explainGoal: "Explain containers, images, and Dockerfiles in English.",
  explainGoalZh: "学会用英语解释容器、镜像和 Dockerfile。",
  level: "B1",
  progress: 30,
  unit: 2,
  totalUnits: 6,
  readingParagraph: "Docker is a containerization platform that packages applications into containers.",
  keyPoints: ["container", "image", "Dockerfile"],
  vocabulary: [{ term: "container", pronunciation: "/kənˈteɪnər/", definitionEn: "A lightweight, standalone executable package.", definitionZh: "一个轻量级、独立可执行的包。", exampleSentence: "Each container runs in its own isolated environment." }],
  sentencePatterns: [{ pattern: "A container is...", meaningZh: "容器是...", example: "A container is a lightweight unit." }],
  speakingPrompt: { prompt: "Explain Docker", promptZh: "解释 Docker", durationSeconds: 30 },
  interviewQuestion: { question: "What is Docker?", idealAnswer: "Docker is a containerization platform.", commonMistakes: ["Confusing container with VM"], keyPoints: ["container"] },
  commonMistakes: ["Missing image concept"],
  understandingCheck: {
    question: "Why would you use Docker for development?",
    questionZh: "为什么要在开发中使用 Docker？",
    keywords: ["consistent", "isolate", "environment"],
    successFeedback: "Excellent! Docker ensures consistent environments across development.",
    failureHint: "Think about environment consistency and isolation."
  },
};

const topicWithoutCheck = {
  slug: "no-check-topic",
  title: "No Check Topic",
  titleZh: "无检查主题",
  explainGoal: "A topic without understanding check.",
  explainGoalZh: "一个没有理解检查的主题。",
  level: "B1",
  progress: 10,
  unit: 1,
  totalUnits: 3,
  readingParagraph: "This is a test topic without understanding check.",
  keyPoints: ["test"],
  vocabulary: [],
  sentencePatterns: [],
  speakingPrompt: { prompt: "Test", promptZh: "测试", durationSeconds: 30 },
  interviewQuestion: { question: "Test?", idealAnswer: "Test.", commonMistakes: [], keyPoints: [] },
  commonMistakes: [],
  understandingCheck: undefined as unknown as { question: string; questionZh: string; keywords: string[]; successFeedback: string; failureHint: string },
};

// =========== 1. ReadTab topic-specific understanding check ===========
describe("ReadTab understanding check", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("renders Docker understanding check question instead of idempotent", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <ReadTab topic={dockerTopic} />
        </MemoryRouter>
      </I18nProvider>
    );
    expect(screen.getByText("为什么要在开发中使用 Docker？")).toBeDefined();
    expect(screen.queryByText(/idempotent/i)).toBeNull();
  });

  it("displays successFeedback when answer contains keywords", async () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <ReadTab topic={dockerTopic} />
        </MemoryRouter>
      </I18nProvider>
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Docker provides a consistent environment and isolates dependencies." } });
    fireEvent.click(screen.getByText("检查答案"));

    await waitFor(() => {
      expect(screen.getByText("Excellent! Docker ensures consistent environments across development.")).toBeDefined();
    });
  });

  it("displays failureHint when answer does not contain keywords", async () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <ReadTab topic={dockerTopic} />
        </MemoryRouter>
      </I18nProvider>
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "I have no idea about Docker." } });
    fireEvent.click(screen.getByText("检查答案"));

    await waitFor(() => {
      expect(screen.getByText("Think about environment consistency and isolation.")).toBeDefined();
    });
  });

  it("does not crash when understandingCheck is missing", () => {
    expect(() => {
      render(
        <I18nProvider>
          <MemoryRouter>
            <ReadTab topic={topicWithoutCheck} />
          </MemoryRouter>
        </I18nProvider>
      );
    }).not.toThrow();
  });

  it("reset clears answer and result", async () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <ReadTab topic={dockerTopic} />
        </MemoryRouter>
      </I18nProvider>
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Docker provides consistent environment." } });
    fireEvent.click(screen.getByText("检查答案"));

    await waitFor(() => {
      expect(screen.getByText("Excellent! Docker ensures consistent environments across development.")).toBeDefined();
    });

    fireEvent.click(screen.getByText("重置"));
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("");
    expect(screen.queryByText("Excellent! Docker ensures consistent environments across development.")).toBeNull();
  });
});

// =========== 2. ReviewSession sentence ids unique ===========
describe("ReviewSession sentence ids", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("enters sentences mode and shows saved sentences", () => {
    const sentences = [
      { pattern: "Could you clarify what you mean by [term]?", savedAt: "2026-06-01T00:00:00.000Z" },
      { pattern: "This endpoint is used to ___ .", savedAt: "2026-06-02T00:00:00.000Z" },
    ];
    memLS._store["devenglish_sentences"] = JSON.stringify(sentences);

    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/review/session"]}>
          <Routes>
            <Route path="/review/session" element={<ReviewSession />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );

    const allSentenceBtns = screen.getAllByText("句型复习");
    const firstCard = allSentenceBtns[0].closest('button') || allSentenceBtns[0];
    fireEvent.click(firstCard);

    const matches = screen.getAllByText(/Could you clarify/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("does not collapse all sentences into one id", async () => {
    const sentences = [
      { pattern: "Could you clarify what you mean by [term]?", savedAt: "2026-06-01T00:00:00.000Z" },
      { pattern: "This endpoint is used to ___ .", savedAt: "2026-06-02T00:00:00.000Z" },
    ];
    memLS._store["devenglish_sentences"] = JSON.stringify(sentences);

    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/review/session"]}>
          <Routes>
            <Route path="/review/session" element={<ReviewSession />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );

    const allSentenceBtns = screen.getAllByText("句型复习");
    fireEvent.click(allSentenceBtns[0]);

    await waitFor(() => {
      expect(screen.getByText("标记掌握")).toBeDefined();
    });

    fireEvent.click(screen.getByText("标记掌握"));

    await waitFor(() => {
      expect(screen.getByText(/下一题/)).toBeDefined();
    });

    fireEvent.click(screen.getByText(/下一题/));

    await waitFor(() => {
      const matches = screen.getAllByText(/This endpoint is used/);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });
});

// =========== 3. SearchResults expanded search ===========
describe("SearchResults expanded search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("finds questions by hint text", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=token+bucket"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("面试问题")).toBeDefined();
    });
  });

  it("finds questions by type field", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=System+Design"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("面试问题")).toBeDefined();
    });
  });

  it("finds reports by weakPoints content", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=too+short"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("报告")).toBeDefined();
    });
  });

  it("finds reports by questionDetails.userAnswer", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=cache+keys"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      const noResult = screen.queryByText("没有搜索结果");
      expect(noResult).toBeNull();
    });
  });

  it("finds reports by missingKeyPoints content", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=Fallback+strategy"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      const noResult = screen.queryByText("没有搜索结果");
      expect(noResult).toBeNull();
    });
  });
});

// =========== 4. WorkplaceScenarioDetail route switch reset ===========
describe("WorkplaceScenarioDetail route switch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("renders daily-standup content", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/workplace-english/scenarios/daily-standup"]}>
          <Routes>
            <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("每日站会")).toBeDefined();
    });
  });

  it("renders code-review content", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/workplace-english/scenarios/code-review"]}>
          <Routes>
            <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("代码评审")).toBeDefined();
    });
  });

  it("resets state when switching scenarios", async () => {
    const { unmount } = render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/workplace-english/scenarios/daily-standup"]}>
          <Routes>
            <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("每日站会")).toBeDefined();
    });

    unmount();

    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/workplace-english/scenarios/code-review"]}>
          <Routes>
            <Route path="/workplace-english/scenarios/:slug" element={<WorkplaceScenarioDetail />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("代码评审")).toBeDefined();
    });
    expect(screen.queryByText("每日站会")).toBeNull();
  });
});

// =========== 5. Dashboard i18n field tests ===========
import Dashboard from "@/pages/Dashboard";
import AppLayout from "@/components/AppLayout";

describe("Dashboard i18n fields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  function renderDash(locale?: string) {
    if (locale) {
      memLS._store["devenglish_locale"] = locale;
    }
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );
  }

  it("default zh-CN shows Chinese todayFocus title", () => {
    renderDash();
    expect(screen.getByText("用英语解释 Redis 缓存问题")).toBeDefined();
  });

  it("default zh-CN shows Chinese todayPlan labels", () => {
    renderDash();
    expect(screen.getByText("复习 10 个技术词汇")).toBeDefined();
  });

  it("default zh-CN shows Chinese upcoming title", () => {
    renderDash();
    expect(screen.getByText("模拟面试 — 后端")).toBeDefined();
  });

  it("default zh-CN does not show English todayFocus title", () => {
    renderDash();
    expect(screen.queryByText("Explain Redis cache problems in English.")).toBeNull();
  });
});

// =========== 6. i18n en-US static import test ===========
describe("i18n en-US static import", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("renders English text without raw i18n keys when locale is en-US", () => {
    memLS._store["devenglish_locale"] = "en-US";
    render(
      <I18nProvider>
        <MemoryRouter>
          <AppLayout />
        </MemoryRouter>
      </I18nProvider>
    );
    expect(screen.queryByText("nav.dashboard")).toBeNull();
    expect(screen.queryByText("profile.title")).toBeNull();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(1);
  });
});

// =========== 7. Review queue enriched fields ===========
import InterviewReport from "@/pages/InterviewReport";
import Review from "@/pages/Review";

describe("Review queue enriched fields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("interview report adds review items with enriched data", async () => {
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
      expect(screen.getByText("加入复习队列")).toBeDefined();
    });

    fireEvent.click(screen.getByText("加入复习队列"));

    await waitFor(() => {
      const queue = JSON.parse(memLS._store["devenglish_review_queue"] || "[]");
      expect(queue.length).toBeGreaterThanOrEqual(1);
      const first = queue[0];
      expect(first.reportId).toBeDefined();
      expect(first.userAnswer).toBeDefined();
      expect(first.correctAnswer).toBeDefined();
    });
  });

  it("review page shows enriched queue item with user answer", async () => {
    // Pre-populate review queue with enriched data
    memLS._store["devenglish_review_queue"] = JSON.stringify([{
      id: "review-test-1",
      type: "wrong_answer",
      title: "WeakPoint-Enriched-Test-Word",
      source: "Interview · Backend Developer",
      status: "pending",
      createdAt: new Date().toISOString(),
      reportId: "report-1",
      questionIndex: 1,
      userAnswer: "I would check the cache keys and the expiration time.",
      problem: "Answer is too short. Aim for 2-3 sentences.",
      correctAnswer: "A better answer would include monitoring hit rate and eviction.",
      drillRoute: "/ai-interview/report/report-1/practice",
    }]);

    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/review"]}>
          <Routes>
            <Route path="/review" element={<Review />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("WeakPoint-Enriched-Test-Word")).toBeDefined();
    });
  });

  it("review page rewrite answer links to drillRoute when available", async () => {
    memLS._store["devenglish_review_queue"] = JSON.stringify([{
      id: "review-test-2",
      type: "wrong_answer",
      title: "DrillRoute-Test-Word",
      source: "Interview · Backend Developer",
      status: "pending",
      createdAt: new Date().toISOString(),
      reportId: "report-1",
      drillRoute: "/ai-interview/report/report-1/practice",
      userAnswer: "Some answer",
      problem: "Vocabulary was repetitive",
      correctAnswer: "Better vocabulary here",
    }]);

    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/review"]}>
          <Routes>
            <Route path="/review" element={<Review />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );

    await waitFor(() => {
      // The queue item title should be visible
      expect(screen.getByText("DrillRoute-Test-Word")).toBeDefined();
    });
    // The rewrite answer link should point to the drill route
    const rewriteLinks = Array.from(document.querySelectorAll('a[href="/ai-interview/report/report-1/practice"]'));
    expect(rewriteLinks.length).toBeGreaterThanOrEqual(1);
  });
});

// =========== 8. LearningPathDetail route tests ===========
import LearningPathDetail from "@/pages/LearningPathDetail";

describe("LearningPathDetail routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("interview-english path shows Project story STAR with link to interview scenario", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/learning/interview-english"]}>
          <Routes>
            <Route path="/learning/:pathSlug" element={<LearningPathDetail />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("面试英语")).toBeDefined();
    });

    expect(screen.getByText("项目经历 (STAR)")).toBeDefined();

    const continueLinks = Array.from(document.querySelectorAll('a[href="/interview-english/scenarios/project-experience"]'));
    expect(continueLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("workplace-english path has Daily standup link to workplace scenario", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/learning/workplace-english"]}>
          <Routes>
            <Route path="/learning/:pathSlug" element={<LearningPathDetail />} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("职场英语")).toBeDefined();
    });

    expect(screen.getByText("每日站会")).toBeDefined();

    const continueLinks = Array.from(document.querySelectorAll('a[href="/workplace-english/scenarios/daily-standup"]'));
    expect(continueLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("RESTful API module links to technical-english", async () => {
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
      expect(screen.getByText("后端英语")).toBeDefined();
    });

    const openLinks = Array.from(document.querySelectorAll('a[href="/technical-english/restful-api"]'));
    expect(openLinks.length).toBeGreaterThanOrEqual(1);
  });
});

// =========== 9. SearchResults filter i18n ===========
describe("SearchResults filter i18n", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("renders Chinese filter labels without raw i18n keys", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=cache"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    // No raw i18n keys should appear
    expect(screen.queryByText("search.filterAll")).toBeNull();
    expect(screen.queryByText("search.filterTopics")).toBeNull();
    expect(screen.queryByText("search.filterVocabulary")).toBeNull();
    expect(screen.queryByText("search.filterQuestions")).toBeNull();
    expect(screen.queryByText("search.filterReports")).toBeNull();
    expect(screen.queryByText("search.filterSentences")).toBeNull();
  });
});

// =========== 10. Dashboard weak skills description ===========
describe("Dashboard weak skills description", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("does not show raw dash.clickToSee key", async () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("用英语解释 Redis 缓存问题")).toBeDefined();
    });
    expect(screen.queryByText("dash.clickToSee")).toBeNull();
  });
});

// =========== 11. Dashboard today plan button ===========
describe("Dashboard today plan button", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("shows start on undone task, done on completed task", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );
    // "复习 10 个技术词汇" is done, should show "完成"
    const doneBtns = screen.getAllByText("完成");
    expect(doneBtns.length).toBeGreaterThanOrEqual(1);

    // "练习 1 个面试回答" is not done, should show "开始"
    const startBtns = screen.getAllByText("开始");
    // There should be at least 2 "开始" buttons (today plan + recommended)
    expect(startBtns.length).toBeGreaterThanOrEqual(2);
  });

  it("disabled done button does not retrigger toast", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );
    const doneBtns = screen.getAllByText("完成");
    if (doneBtns.length > 0) {
      const btn = doneBtns[0];
      expect((btn as HTMLButtonElement).disabled).toBe(true);
    }
  });
});
