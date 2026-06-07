// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";

function mockLocalStorage(getItem: (key: string) => string | null) {
  Object.defineProperty(window, "localStorage", {
    value: { getItem: getItem as (key: string) => string | null, setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn() },
    writable: true,
    configurable: true,
  });
}

describe("theme", () => {
  beforeEach(() => {
    vi.resetModules();
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("defaults to light when localStorage is empty", async () => {
    mockLocalStorage(() => null);
    const { theme } = await import("../theme.svelte");
    expect(theme.value).toBe("light");
  });

  it("reads light from localStorage", async () => {
    mockLocalStorage(() => "light");
    const { theme } = await import("../theme.svelte");
    expect(theme.value).toBe("light");
  });

  it("reads dark from localStorage", async () => {
    mockLocalStorage(() => "dark");
    const { theme } = await import("../theme.svelte");
    expect(theme.value).toBe("dark");
  });

  it("reads dark from matchMedia when no stored preference", async () => {
    mockLocalStorage(() => null);
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: true }));
    const { theme } = await import("../theme.svelte");
    expect(theme.value).toBe("dark");
  });

  it("defaults to light when localStorage throws", async () => {
    mockLocalStorage(() => { throw new Error("no localStorage"); });
    const { theme } = await import("../theme.svelte");
    expect(theme.value).toBe("light");
  });

  it("toggleTheme switches from light to dark", async () => {
    mockLocalStorage(() => "light");
    const { theme, toggleTheme } = await import("../theme.svelte");
    expect(theme.value).toBe("light");
    toggleTheme();
    expect(theme.value).toBe("dark");
  });

  it("toggleTheme switches from dark to light", async () => {
    mockLocalStorage(() => "dark");
    const { theme, toggleTheme } = await import("../theme.svelte");
    expect(theme.value).toBe("dark");
    toggleTheme();
    expect(theme.value).toBe("light");
  });
});
