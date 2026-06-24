import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { I18nProvider, useI18n } from "..";

// Test component that renders i18n state
function TestComponent() {
  const { t, locale, setLocale } = useI18n();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="today-focus">{t("dash.todayFocus")}</span>
      <span data-testid="missing-key">{t("non.existing.key")}</span>
      <span data-testid="save-label">{t("common.save")}</span>
      <button data-testid="switch-en" onClick={() => setLocale("en-US")}>
        Switch to EN
      </button>
      <button data-testid="switch-zh" onClick={() => setLocale("zh-CN")}>
        Switch to ZH
      </button>
    </div>
  );
}

describe("I18nProvider", () => {
  beforeEach(() => {
    localStorage.removeItem("devenglish_locale");
  });

  it("default locale is zh-CN when localStorage is empty", () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("zh-CN");
  });

  it("renders zh-CN translations on initial render (no key flash)", () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );
    expect(screen.getByTestId("today-focus").textContent).toBe("今日重点");
    expect(screen.getByTestId("save-label").textContent).toBe("收藏");
  });

  it("does not show raw keys for existing translations", () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );
    expect(screen.getByTestId("today-focus").textContent).not.toBe("dash.todayFocus");
    expect(screen.getByTestId("save-label").textContent).not.toBe("common.save");
  });

  it("falls back to key string for missing translations", () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );
    expect(screen.getByTestId("missing-key").textContent).toBe("non.existing.key");
  });

  it("switches from zh-CN to en-US and updates displayed text", async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId("today-focus").textContent).toBe("今日重点");

    // Click switch to en-US using fireEvent
    fireEvent.click(screen.getByTestId("switch-en"));

    // Wait for async en-US module to load
    await waitFor(() => {
      expect(screen.getByTestId("today-focus").textContent).toBe("Today's Focus");
    });

    expect(screen.getByTestId("locale").textContent).toBe("en-US");
    expect(screen.getByTestId("save-label").textContent).toBe("Save");
  });

  it("persists locale to localStorage when switching", async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(localStorage.getItem("devenglish_locale")).toBeNull();

    fireEvent.click(screen.getByTestId("switch-en"));

    await waitFor(() => {
      expect(localStorage.getItem("devenglish_locale")).toBe("en-US");
    });
  });
});
