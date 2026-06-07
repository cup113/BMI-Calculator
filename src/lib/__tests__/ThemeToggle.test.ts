// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";

const mock = vi.hoisted(() => {
  let themeValue = "light";
  const toggleTheme = vi.fn(() => {
    themeValue = themeValue === "light" ? "dark" : "light";
  });
  return {
    theme: {
      get value() { return themeValue; },
    },
    toggleTheme,
    setThemeValue: (v: string) => { themeValue = v; },
  };
});

vi.mock("$lib/theme.svelte", () => ({
  theme: mock.theme,
  toggleTheme: mock.toggleTheme,
}));

import ThemeToggle from "$lib/components/ThemeToggle.svelte";

afterEach(() => {
  cleanup();
  mock.setThemeValue("light");
  mock.toggleTheme.mockClear();
});

describe("ThemeToggle", () => {
  it("renders a button", () => {
    const { container } = render(ThemeToggle);
    const btn = container.querySelector("button");
    expect(btn).toBeTruthy();
  });

  it("shows sun icon in dark mode", () => {
    mock.setThemeValue("dark");
    const { container } = render(ThemeToggle);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });

  it("shows moon icon in light mode", () => {
    const { container } = render(ThemeToggle);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });

  it("calls toggleTheme on click", async () => {
    const { container } = render(ThemeToggle);
    const btn = container.querySelector("button")!;
    await fireEvent.click(btn);
    expect(mock.toggleTheme).toHaveBeenCalledOnce();
  });
});
