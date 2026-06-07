// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/svelte";

const mockRuntime = vi.hoisted(() => {
  let currentLocale = "zh-CN";
  return {
    getLocale: vi.fn(() => currentLocale),
    localizeHref: vi.fn((href: string) => href),
    setLocale: vi.fn((locale: string) => { currentLocale = locale; }),
    deLocalizeUrl: vi.fn((url: string | URL) => ({ pathname: (typeof url === "string" ? new URL(url) : url).pathname })),
    getTextDirection: vi.fn(() => "ltr"),
    __setLocale: (locale: string) => { currentLocale = locale; },
  };
});

vi.mock("$lib/paraglide/runtime", () => mockRuntime);

import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";

afterEach(() => {
  cleanup();
  mockRuntime.__setLocale("zh-CN");
});

describe("LanguageSwitcher", () => {
  it("renders zh-CN and en buttons", () => {
    render(LanguageSwitcher);
    expect(screen.getByText("lang_zh")).toBeTruthy();
    expect(screen.getByText("lang_en")).toBeTruthy();
  });

  it("highlights zh-CN when active", () => {
    const { container } = render(LanguageSwitcher);
    const links = container.querySelectorAll("a");
    expect(links[0].className).toContain("bg-blue-500");
  });

  it("highlights en when active", () => {
    mockRuntime.__setLocale("en");
    const { container } = render(LanguageSwitcher);
    const links = container.querySelectorAll("a");
    expect(links[1].className).toContain("bg-blue-500");
  });

  it("has data-sveltekit-reload on links", () => {
    const { container } = render(LanguageSwitcher);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("data-sveltekit-reload")).toBe("");
    });
  });
});
