import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import SearchResults from "@/pages/SearchResults";
import Dashboard from "@/pages/Dashboard";
import ProfileEdit from "@/pages/ProfileEdit";
import AIInterviewLobby from "@/pages/AIInterviewLobby";
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

// =========== 1. SearchResults filter i18n regression ===========
describe("SearchResults filter i18n regression", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  const rawKeys = [
    "search.filterAll",
    "search.filterTopics",
    "search.filterVocabulary",
    "search.filterQuestions",
    "search.filterReports",
    "search.filterSentences",
  ];

  const chineseLabels = [
    /全部/,
    /主题/,
    /词汇/,
    /面试问题/,
    /报告/,
    /句型/,
  ];

  it("never renders raw search.filter* i18n keys", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=Redis"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    for (const rawKey of rawKeys) {
      expect(screen.queryByText(rawKey)).toBeNull();
    }
  });

  it("renders Chinese filter labels with counts", async () => {
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

    for (const label of chineseLabels) {
      // Some labels like "主题" appear in both filter buttons and section headers,
      // so we use getAllByText and assert at least one match.
      const matches = screen.getAllByText(label);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("filter bar text does not contain any raw key substring", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=API"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    const filterText = screen.getAllByRole("button")
      .map(b => b.textContent || "")
      .join(" ");

    for (const rawKey of rawKeys) {
      expect(filterText).not.toContain(rawKey);
    }
  });
});

// =========== 2. Dashboard weak skills description regression ===========
describe("Dashboard weak skills description regression", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("does not render dash.clickToSee anywhere on page", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );
    expect(screen.queryByText("dash.clickToSee")).toBeNull();
  });

  it("renders correct Chinese description for weak skills", async () => {
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
    expect(screen.getByText("基于近期学习会话的专注领域")).toBeDefined();
  });

  it("weak skills section title renders without raw keys", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );
    expect(screen.getByText("薄弱项")).toBeDefined();
    expect(screen.queryByText("dash.weakSkills")).toBeNull();
  });
});

// =========== 3. Dashboard today plan button regression ===========
describe("Dashboard today plan button regression", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  function findTaskRow(taskText: string): HTMLElement {
    const taskEl = screen.getByText(taskText);
    const row = taskEl.closest("li");
    if (!row) throw new Error(`Could not find li row for "${taskText}"`);
    return row;
  }

  it("undone task button shows '开始' initially", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );
    const row = findTaskRow("练习 1 个面试回答");
    const btn = within(row).getByRole("button");
    expect(btn.textContent?.trim()).toBe("开始");
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });

  it("clicking undone task calls toast and changes to '完成'", async () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );

    const taskText = "练习 1 个面试回答";
    const row = findTaskRow(taskText);
    const btn = within(row).getByRole("button");
    expect(btn.textContent?.trim()).toBe("开始");

    fireEvent.click(btn);

    expect(vi.mocked(toast.success)).toHaveBeenCalledWith("已完成");

    await waitFor(() => {
      const updatedBtn = within(findTaskRow(taskText)).getByRole("button");
      expect(updatedBtn.textContent?.trim()).toBe("完成");
    });
  });

  it("pre-done task button is disabled and shows '完成'", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );
    const row = findTaskRow("复习 10 个技术词汇");
    const btn = within(row).getByRole("button");
    expect(btn.textContent?.trim()).toBe("完成");
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it("clicking a pre-done button does not trigger toast", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );
    vi.mocked(toast.success).mockClear();

    const row = findTaskRow("复习 10 个技术词汇");
    const btn = within(row).getByRole("button");
    fireEvent.click(btn);

    expect(vi.mocked(toast.success)).not.toHaveBeenCalled();
  });

  it("re-clicking a newly completed button does not retrigger toast", async () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );

    const taskText = "练习 1 个面试回答";
    let row = findTaskRow(taskText);
    const btn = within(row).getByRole("button");

    // First click: complete the task
    fireEvent.click(btn);
    expect(vi.mocked(toast.success)).toHaveBeenCalledTimes(1);

    // Wait for state update
    await waitFor(() => {
      const updatedBtn = within(findTaskRow(taskText)).getByRole("button");
      expect(updatedBtn.textContent?.trim()).toBe("完成");
    });

    // Second click: should NOT trigger toast again
    vi.mocked(toast.success).mockClear();
    row = findTaskRow(taskText);
    const disabledBtn = within(row).getByRole("button");
    fireEvent.click(disabledBtn);
    expect(vi.mocked(toast.success)).not.toHaveBeenCalled();
  });

  it("different undone tasks can be completed independently", async () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </I18nProvider>
    );

    // Click first undone task
    const row1 = findTaskRow("练习 1 个面试回答");
    fireEvent.click(within(row1).getByRole("button"));

    await waitFor(() => {
      const btn = within(findTaskRow("练习 1 个面试回答")).getByRole("button");
      expect(btn.textContent?.trim()).toBe("完成");
    });

    // Second undone task should still show "开始"
    const row2 = findTaskRow("阅读 1 段技术短文");
    const btn2 = within(row2).getByRole("button");
    expect(btn2.textContent?.trim()).toBe("开始");
    expect((btn2 as HTMLButtonElement).disabled).toBe(false);

    // Click it
    fireEvent.click(btn2);

    await waitFor(() => {
      const updatedBtn = within(findTaskRow("阅读 1 段技术短文")).getByRole("button");
      expect(updatedBtn.textContent?.trim()).toBe("完成");
    });

    expect(vi.mocked(toast.success)).toHaveBeenCalledTimes(2);
  });
});

// =========== 4. AIInterviewLobby i18n regression ===========
describe("AIInterviewLobby i18n regression", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("displays Chinese labels for all select options, not English hardcoded", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <AIInterviewLobby />
        </MemoryRouter>
      </I18nProvider>
    );

    // Chinese labels that should appear
    const chineseLabels = [
      "后端开发",
      "前端开发",
      "全栈开发",
      "数据工程师",
      "DevOps 工程师",
      "初级",
      "中级",
      "高级",
      "专家级",
      "英文",
      "英文慢速",
      "双语提示",
      "综合",
      "行为面试",
      "技术面试",
      "系统设计",
      "15 分钟",
      "30 分钟",
      "45 分钟",
      "60 分钟",
    ];

    // These appear in <option> elements, exact match works
    for (const label of chineseLabels) {
      expect(screen.getByText(label)).toBeDefined();
    }

    // "语音回答" appears in multiple places (subtitle, summary), use getAllByText
    expect(screen.getAllByText(/语音回答/).length).toBeGreaterThanOrEqual(1);

    // English hardcoded strings that should NOT appear
    const englishLabels = [
      "Backend Developer",
      "Mid-level",
      "Bilingual hints",
      "Voice answers",
    ];

    for (const label of englishLabels) {
      expect(screen.queryByText(label)).toBeNull();
    }
  });

  it("stores stable English values in localStorage after starting interview", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <AIInterviewLobby />
        </MemoryRouter>
      </I18nProvider>
    );

    const startBtn = screen.getByText("开始面试");
    fireEvent.click(startBtn);

    const config = JSON.parse(memLS.getItem("devenglish_interview_config") || "{}");
    expect(config.role).toBe("Backend Developer");
    expect(config.difficulty).toBe("Mid-level");
    expect(config.language).toBe("English");
    expect(config.interviewType).toBe("Mixed");
    expect(config.duration).toBe("30 minutes");
    expect(config.mode).toBe("quick");
    expect(config.questionCount).toBe(10);
  });

  it("displays Chinese recent session names and dates", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <AIInterviewLobby />
        </MemoryRouter>
      </I18nProvider>
    );

    // Chinese labels for recent sessions
    expect(screen.getByText("后端 · 中级")).toBeDefined();
    expect(screen.getByText("系统设计 · 中级")).toBeDefined();
    expect(screen.getByText("行为面试 · 初级")).toBeDefined();
    expect(screen.getByText("6月21日")).toBeDefined();
    expect(screen.getByText("6月18日")).toBeDefined();
    expect(screen.getByText("6月15日")).toBeDefined();

    // English should not appear
    expect(screen.queryByText("Backend · Mid")).toBeNull();
    expect(screen.queryByText("Jun 21")).toBeNull();
  });

  it("bottom summary shows translated duration and voice answers", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <AIInterviewLobby />
        </MemoryRouter>
      </I18nProvider>
    );

    // "30 分钟" and "语音回答" appear in multiple places (options + summary),
    // so use getAllByText and assert at least one match.
    expect(screen.getAllByText(/30 分钟/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/语音回答/).length).toBeGreaterThanOrEqual(1);
    // Should NOT show raw English
    expect(screen.queryByText("Voice answers")).toBeNull();
    expect(screen.queryByText("30 minutes")).toBeNull();
  });
});

// =========== 5. AIInterviewLobby JD / Full mode input areas ===========
describe("AIInterviewLobby JD / Full mode inputs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("JD mode shows JD input area", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <AIInterviewLobby />
        </MemoryRouter>
      </I18nProvider>
    );

    // Click JD mode
    fireEvent.click(screen.getByText("JD 模拟面试"));

    // JD input area should appear
    expect(screen.getByText("职位描述 / JD")).toBeDefined();
    expect(screen.getByText(/粘贴目标岗位 JD/)).toBeDefined();

    // Type JD text
    const textarea = screen.getByPlaceholderText(/粘贴岗位描述/);
    fireEvent.change(textarea, { target: { value: "We need a senior backend engineer with 5+ years of Node.js experience." } });

    // Start interview
    fireEvent.click(screen.getByText("开始面试"));

    // Check localStorage
    const config = JSON.parse(memLS.getItem("devenglish_interview_config") || "{}");
    expect(config.mode).toBe("jd");
    expect(config.jdText).toBe("We need a senior backend engineer with 5+ years of Node.js experience.");
  });

  it("Full mode shows resume + JD input area", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <AIInterviewLobby />
        </MemoryRouter>
      </I18nProvider>
    );

    // Click Full mode
    fireEvent.click(screen.getByText("完整模拟面试"));

    // Full input area should appear
    expect(screen.getByText("完整模拟材料")).toBeDefined();
    expect(screen.getByText("简历内容")).toBeDefined();
    expect(screen.getAllByText("职位描述 / JD").length).toBeGreaterThanOrEqual(1);

    // Type resume and JD
    const resumeTextarea = screen.getByPlaceholderText(/粘贴你的简历摘要/);
    fireEvent.change(resumeTextarea, { target: { value: "5 years backend, Node.js, PostgreSQL, AWS" } });

    const jdTextarea = screen.getByPlaceholderText(/粘贴岗位描述/);
    fireEvent.change(jdTextarea, { target: { value: "Senior Engineer - distributed systems" } });

    // Start interview
    fireEvent.click(screen.getByText("开始面试"));

    const config = JSON.parse(memLS.getItem("devenglish_interview_config") || "{}");
    expect(config.mode).toBe("full");
    expect(config.resumeText).toBe("5 years backend, Node.js, PostgreSQL, AWS");
    expect(config.jdText).toBe("Senior Engineer - distributed systems");
  });

  it("empty JD shows toast.info hint", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <AIInterviewLobby />
        </MemoryRouter>
      </I18nProvider>
    );

    // Click JD mode without entering JD
    fireEvent.click(screen.getByText("JD 模拟面试"));

    // Start interview with empty JD
    fireEvent.click(screen.getByText("开始面试"));

    expect(vi.mocked(toast.info)).toHaveBeenCalledWith("未填写 JD，将使用通用岗位问题。");
  });

  it("switching modes preserves input content", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <AIInterviewLobby />
        </MemoryRouter>
      </I18nProvider>
    );

    // Click JD mode and type JD
    fireEvent.click(screen.getByText("JD 模拟面试"));
    const textarea = screen.getByPlaceholderText(/粘贴岗位描述/);
    fireEvent.change(textarea, { target: { value: "My test JD" } });

    // Switch to quick mode
    fireEvent.click(screen.getByText("快速练习"));

    // Switch back to JD mode
    fireEvent.click(screen.getByText("JD 模拟面试"));

    // JD content should still be there
    const textarea2 = screen.getByPlaceholderText(/粘贴岗位描述/) as HTMLTextAreaElement;
    expect(textarea2.value).toBe("My test JD");
  });

  it("quick mode does not show JD / resume textareas", () => {
    render(
      <I18nProvider>
        <MemoryRouter>
          <AIInterviewLobby />
        </MemoryRouter>
      </I18nProvider>
    );

    // Default is quick mode - should not have JD textarea
    expect(screen.queryByPlaceholderText(/粘贴岗位描述/)).toBeNull();
    expect(screen.queryByPlaceholderText(/粘贴你的简历摘要/)).toBeNull();
  });
});

// =========== 6. Fixed i18n keys regression ===========
describe("Fixed i18n keys regression", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("SearchResults no-results page shows Chinese, not raw keys", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=__not_existing_keyword__"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );

    await waitFor(() => {
      // Should show Chinese no-results messages
      expect(screen.getByText("没有找到结果")).toBeDefined();
      expect(screen.getByText("试试这些搜索词")).toBeDefined();
    });

    // Should NOT show raw i18n keys
    expect(screen.queryByText("search.noResults")).toBeNull();
    expect(screen.queryByText("search.noResultsDesc")).toBeNull();
    expect(screen.queryByText("search.tryThese")).toBeNull();
  });

  it("SearchResults topic section does not show raw topicsLabel key", async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/search?q=Redis"]}>
          <SearchResults />
        </MemoryRouter>
      </I18nProvider>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    // No raw key should appear
    expect(screen.queryByText("search.topicsLabel")).toBeNull();
  });
});

// =========== 7. ProfileEdit role dropdown regression ===========
describe("ProfileEdit role dropdown regression", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    memLS = createMemoryLS();
    vi.stubGlobal("localStorage", memLS);
  });
  afterEach(() => { vi.unstubAllGlobals(); });

  function renderProfileEdit() {
    return render(
      <I18nProvider>
        <MemoryRouter initialEntries={["/profile/edit"]}>
          <Routes>
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    );
  }

  it("selecting a preset role syncs Chinese and English role fields", async () => {
    renderProfileEdit();

    // First select is Chinese role, second is target role
    const selects = screen.getAllByRole("combobox");
    const roleZhSelect = selects[0] as HTMLSelectElement;

    // Select "后端工程师"
    fireEvent.change(roleZhSelect, { target: { value: "backend-engineer" } });

    // English role field should now show "Backend Engineer" (readonly)
    await waitFor(() => {
      const enField = screen.getByDisplayValue("Backend Engineer");
      expect(enField).toBeDefined();
      expect((enField as HTMLInputElement).readOnly).toBe(true);
    });

    // Chinese role select should show "后端工程师"
    expect((roleZhSelect as HTMLSelectElement).value).toBe("backend-engineer");
  });

  it("selecting custom role enables both text inputs for manual entry", async () => {
    renderProfileEdit();

    const selects = screen.getAllByRole("combobox");
    const roleZhSelect = selects[0];

    // Select custom
    fireEvent.change(roleZhSelect, { target: { value: "custom" } });

    await waitFor(() => {
      // After selecting custom, a text input for custom Chinese role should appear
      const customInputs = screen.getAllByPlaceholderText("中文角色");
      expect(customInputs.length).toBeGreaterThanOrEqual(1);
    });

    // English role field should now be editable
    const enInputs = screen.getAllByPlaceholderText("英文角色");
    expect(enInputs.length).toBeGreaterThanOrEqual(1);
  });

  it("selecting preset target role syncs both target fields", async () => {
    renderProfileEdit();

    const selects = screen.getAllByRole("combobox");
    // Target role select is the second select
    const targetSelect = selects[1];

    fireEvent.change(targetSelect, { target: { value: "senior-backend-overseas" } });

    await waitFor(() => {
      const targetEnField = screen.getByDisplayValue("Senior Backend Engineer (Overseas)");
      expect(targetEnField).toBeDefined();
      expect((targetEnField as HTMLInputElement).readOnly).toBe(true);
    });
  });

  it("saving profile stores roleKey and targetRoleKey", async () => {
    renderProfileEdit();

    const selects = screen.getAllByRole("combobox");

    // Select role
    fireEvent.change(selects[0], { target: { value: "backend-engineer" } });

    // Select target
    fireEvent.change(selects[1], { target: { value: "senior-backend-overseas" } });

    // Wait for sync
    await waitFor(() => {
      expect(screen.getByDisplayValue("Backend Engineer")).toBeDefined();
      expect(screen.getByDisplayValue("Senior Backend Engineer (Overseas)")).toBeDefined();
    });

    // Save
    const saveBtn = screen.getByText("保存");
    fireEvent.click(saveBtn);

    const saved = JSON.parse(memLS.getItem("devenglish_profile") || "{}");
    expect(saved.roleKey).toBe("backend-engineer");
    expect(saved.role).toBe("Backend Engineer");
    expect(saved.roleZh).toBe("后端工程师");
    expect(saved.targetRoleKey).toBe("senior-backend-overseas");
    expect(saved.target).toBe("Senior Backend Engineer (Overseas)");
    expect(saved.targetZh).toBe("高级后端工程师（海外方向）");
  });
});
