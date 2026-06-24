import { describe, it, expect } from "vitest";
import zhCNMessages from "../locales/zh-CN";
import enUSMessages from "../locales/en-US";

describe("i18n locale files", () => {
  describe("zh-CN", () => {
    it("contains required keys", () => {
      expect(zhCNMessages["nav.dashboard"]).toBe("今日学习");
      expect(zhCNMessages["nav.aiInterview"]).toBe("AI 模拟面试");
      expect(zhCNMessages["common.save"]).toBe("收藏");
      expect(zhCNMessages["report.title"]).toBe("面试报告");
      expect(zhCNMessages["dash.todayFocus"]).toBe("今日重点");
      expect(zhCNMessages["review.title"]).toBe("复盘");
    });

    it("does not contain translation keys as values", () => {
      expect(zhCNMessages["dash.todayFocus"]).not.toBe("dash.todayFocus");
      expect(zhCNMessages["common.save"]).not.toBe("common.save");
      expect(zhCNMessages["nav.dashboard"]).not.toBe("nav.dashboard");
    });
  });

  describe("en-US", () => {
    it("contains required keys", () => {
      expect(enUSMessages["nav.dashboard"]).toBe("Dashboard");
      expect(enUSMessages["nav.aiInterview"]).toBe("AI Interview");
      expect(enUSMessages["common.save"]).toBe("Save");
      expect(enUSMessages["report.title"]).toBe("Interview Report");
      expect(enUSMessages["dash.todayFocus"]).toBe("Today's Focus");
    });

    it("does not contain translation keys as values", () => {
      expect(enUSMessages["dash.todayFocus"]).not.toBe("dash.todayFocus");
      expect(enUSMessages["common.save"]).not.toBe("common.save");
    });
  });

  describe("key parity between locales", () => {
    it("zh-CN has all keys that en-US has", () => {
      const enKeys = Object.keys(enUSMessages);
      for (const key of enKeys) {
        expect(zhCNMessages).toHaveProperty(key);
      }
    });

    it("en-US has all keys that zh-CN has", () => {
      const zhKeys = Object.keys(zhCNMessages);
      for (const key of zhKeys) {
        expect(enUSMessages).toHaveProperty(key);
      }
    });
  });

  describe("fallback behavior", () => {
    it("default zh-CN has Chinese translations", () => {
      expect(zhCNMessages["nav.dashboard"]).toBe("今日学习");
    });
  });
});
