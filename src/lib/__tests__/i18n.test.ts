import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/paraglide/runtime", () => {
  let currentLocale = "zh-CN";
  return {
    setLocale: vi.fn((locale: string) => {
      currentLocale = locale;
    }),
    getLocale: vi.fn(() => currentLocale),
  };
});

import { setI18nLocale, getI18nLocale } from "../i18n";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("setI18nLocale", () => {
  it("sets locale to en", () => {
    setI18nLocale("en");
    expect(getI18nLocale()).toBe("en");
  });

  it("sets locale to zh-CN", () => {
    setI18nLocale("zh-CN");
    expect(getI18nLocale()).toBe("zh-CN");
  });
});

describe("getI18nLocale", () => {
  it("returns current locale", () => {
    setI18nLocale("en");
    expect(getI18nLocale()).toBe("en");
  });
});
