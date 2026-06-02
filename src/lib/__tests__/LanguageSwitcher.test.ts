// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/svelte";
import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";

afterEach(() => cleanup());

vi.mock("$lib/paraglide/runtime", () => {
  let currentLocale = "zh-CN";
  return {
    getLocale: vi.fn(() => currentLocale),
    localizeHref: vi.fn((href: string) => href),
    setLocale: vi.fn(),
  };
});

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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

  it("has data-sveltekit-reload on links", () => {
    const { container } = render(LanguageSwitcher);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("data-sveltekit-reload")).toBe("");
    });
  });
});
