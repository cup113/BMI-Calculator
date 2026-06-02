// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import GenderSelector from "$lib/components/GenderSelector.svelte";

afterEach(() => cleanup());

describe("GenderSelector", () => {
  it("renders male and female buttons", () => {
    render(GenderSelector, { gender: "male" });
    expect(screen.getByText("gender_male")).toBeTruthy();
    expect(screen.getByText("gender_female")).toBeTruthy();
  });

  it("highlights male when selected", () => {
    const { container } = render(GenderSelector, { gender: "male" });
    const buttons = container.querySelectorAll("button");
    expect(buttons[0].className).toContain("bg-blue-500");
    expect(buttons[1].className).toContain("bg-surface-alt");
  });

  it("highlights female when selected", () => {
    const { container } = render(GenderSelector, { gender: "female" });
    const buttons = container.querySelectorAll("button");
    expect(buttons[0].className).toContain("bg-surface-alt");
    expect(buttons[1].className).toContain("bg-pink-500");
  });

  it("changes selection on click", async () => {
    const { container } = render(GenderSelector, { gender: "male" });
    const buttons = container.querySelectorAll("button");
    await fireEvent.click(buttons[1]);
    expect(buttons[1].className).toContain("bg-pink-500");
  });
});
