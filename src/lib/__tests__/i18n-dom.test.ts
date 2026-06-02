// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("$lib/paraglide/runtime", () => {
  let currentLocale = "zh-CN";
  return {
    setLocale: vi.fn((locale: string) => {
      currentLocale = locale;
    }),
    getLocale: vi.fn(() => currentLocale),
    localizeHref: vi.fn(),
  };
});

import { setI18nLocale } from "../i18n";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("setI18nLocale DOM branch", () => {
  it("sets document.documentElement.lang", () => {
    setI18nLocale("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("sets document.documentElement.lang to zh-CN", () => {
    setI18nLocale("zh-CN");
    expect(document.documentElement.lang).toBe("zh-CN");
  });
});
