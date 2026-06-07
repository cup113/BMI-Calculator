import { vi } from "vitest";

if (typeof Element !== "undefined") {
  Element.prototype.animate = vi.fn(() => ({
    onfinish: null as (() => void) | null,
    cancel: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    finish: vi.fn(),
  })) as unknown as typeof Element.prototype.animate;
}

vi.mock("$lib/paraglide/messages", () => {
  const handler: ProxyHandler<Record<string, () => string>> = {
    get(_target, prop: string) {
      return () => prop;
    },
  };
  return { m: new Proxy({}, handler) };
});

vi.mock("$lib/paraglide/runtime", () => {
  let currentLocale = "zh-CN";
  return {
    setLocale: vi.fn((locale: string) => { currentLocale = locale; }),
    getLocale: vi.fn(() => currentLocale),
    localizeHref: vi.fn((href: string) => href),
    deLocalizeUrl: vi.fn((url: string | URL) => {
      const u = typeof url === "string" ? new URL(url) : url;
      return { pathname: u.pathname };
    }),
    getTextDirection: vi.fn((locale: string) => (locale === "ar" ? "rtl" : "ltr")),
  };
});
