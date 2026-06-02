// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/svelte";
import WeightInput from "$lib/components/WeightInput.svelte";

afterEach(() => cleanup());

describe("WeightInput", () => {
  it("renders weight input with placeholder", () => {
    render(WeightInput, { weight: "", weightUnitId: "kg" });
    const input = screen.getByPlaceholderText("weight_placeholder");
    expect(input).toBeTruthy();
  });

  it("renders unit toggle buttons", () => {
    const { container } = render(WeightInput, { weight: "", weightUnitId: "kg" });
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("highlights kg unit when selected", () => {
    const { container } = render(WeightInput, { weight: "", weightUnitId: "kg" });
    const buttons = container.querySelectorAll("button");
    const kgBtn = buttons[0];
    expect(kgBtn.className).toContain("bg-surface");
  });

  it("displays converted weight text", () => {
    render(WeightInput, { weight: 70, weightUnitId: "kg" });
    expect(screen.getByText("= 140.0 斤")).toBeTruthy();
  });

  it("does not show conversion for zero weight", () => {
    render(WeightInput, { weight: 0, weightUnitId: "kg" });
    expect(screen.queryByText(/^= /)).toBeNull();
  });
});
