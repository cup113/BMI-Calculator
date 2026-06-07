import { describe, it, expect, vi } from "vitest";

vi.mock("$lib/paraglide/server", () => ({
  paraglideMiddleware: vi.fn((request: Request, next: (ctx: { request: Request; locale: string }) => Response | Promise<Response>) =>
    next({ request, locale: "zh-CN" })
  ),
}));

import { handle } from "../../hooks.server";

describe("hooks.server handle", () => {
  it("transforms %lang% and %dir% in HTML", async () => {
    const event = new Request("http://test.com/") as any;
    event.locals = {};
    const resolve = vi.fn().mockImplementation((_event: any, opts?: any) => {
      const html = '<html><head></head><body>%lang% %dir%</body></html>';
      if (opts?.transformPageChunk) {
        return new Response(opts.transformPageChunk({ html }));
      }
      return new Response(html);
    });

    const response = await handle({ event, resolve } as any);
    const text = await response.text();
    expect(text).toContain("zh-CN");
    expect(text).toContain("ltr");
    expect(text).not.toContain("%lang%");
    expect(text).not.toContain("%dir%");
  });

  it("calls resolve with options", async () => {
    const event = new Request("http://test.com/") as any;
    event.locals = {};
    const resolve = vi.fn().mockImplementation((_event: any, opts?: any) => {
      const html = '<html></html>';
      if (opts?.transformPageChunk) {
        return new Response(opts.transformPageChunk({ html }));
      }
      return new Response(html);
    });

    await handle({ event, resolve } as any);
    expect(resolve).toHaveBeenCalledOnce();
  });
});
