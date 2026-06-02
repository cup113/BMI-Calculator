// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/svelte";
import PrivacyNotice from "$lib/components/PrivacyNotice.svelte";

afterEach(() => cleanup());

describe("PrivacyNotice", () => {
  it("renders privacy title and text", () => {
    render(PrivacyNotice);
    expect(screen.getByText("privacy_title")).toBeTruthy();
    expect(screen.getByText("privacy_text")).toBeTruthy();
  });

  it("renders section with bg-surface class", () => {
    const { container } = render(PrivacyNotice);
    const section = container.querySelector("section");
    expect(section?.className).toContain("bg-surface");
  });
});
