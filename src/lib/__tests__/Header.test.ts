// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/svelte";
import Header from "$lib/components/Header.svelte";

afterEach(() => cleanup());

describe("Header", () => {
  it("renders app title", () => {
    render(Header);
    expect(screen.getByText("app_title")).toBeTruthy();
  });

  it("renders favicon image", () => {
    const { container } = render(Header);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.alt).toBe("");
  });
});
