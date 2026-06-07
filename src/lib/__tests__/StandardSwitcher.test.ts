// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import StandardSwitcher from "$lib/components/StandardSwitcher.svelte";
import type { BmiStandard } from "$lib/standards/types";

function makeStandard(id: string, name: string): BmiStandard {
  return {
    id,
    nameKey: name,
    descriptionKey: name,
    category: "adult",
    requiredFields: [],
    localeOrder: { zh: 0, en: 0 },
    levels: [],
    classify: () => null,
    weightThresholds: () => null,
    levelBmiBounds: () => null,
  };
}

const chinaAdult = makeStandard("china-adult", "standard_china_adult");
const whoAdult = makeStandard("who-adult", "standard_who_adult");

const currentStandards: BmiStandard[] = [chinaAdult, whoAdult];

afterEach(() => cleanup());

describe("StandardSwitcher", () => {
  it("renders current standard name", () => {
    render(StandardSwitcher, {
      standardId: "china-adult",
      currentStandard: chinaAdult,
      currentStandards,
    });
    expect(screen.getByText(/current_standard/)).toBeTruthy();
  });

  it("shows switch button", () => {
    render(StandardSwitcher, {
      standardId: "china-adult",
      currentStandard: chinaAdult,
      currentStandards,
    });
    expect(screen.getByText("switch_standard")).toBeTruthy();
  });

  it("opens dropdown on toggle click", async () => {
    const { container } = render(StandardSwitcher, {
      standardId: "china-adult",
      currentStandard: chinaAdult,
      currentStandards,
    });
    const toggleBtn = screen.getByText("switch_standard");
    await fireEvent.click(toggleBtn);
    const dropdown = container.querySelector('[class*="absolute"]');
    expect(dropdown).toBeTruthy();
  });

  it("calls onselectStandard when selecting from dropdown", async () => {
    const onselect = vi.fn();
    const { container } = render(StandardSwitcher, {
      standardId: "china-adult",
      currentStandard: chinaAdult,
      currentStandards,
      onselectStandard: onselect,
    });
    const toggleBtn = screen.getByText("switch_standard");
    await fireEvent.click(toggleBtn);
    const dropdownButtons = container.querySelectorAll('[class*="absolute"] button');
    const whoBtn = Array.from(dropdownButtons).find((b) => b.textContent === "standard_who_adult");
    if (whoBtn) await fireEvent.click(whoBtn);
    expect(onselect).toHaveBeenCalledWith("who-adult");
  });

  it("highlights currently selected standard in dropdown", async () => {
    const { container } = render(StandardSwitcher, {
      standardId: "china-adult",
      currentStandard: chinaAdult,
      currentStandards,
    });
    const toggleBtn = screen.getByText("switch_standard");
    await fireEvent.click(toggleBtn);
    const dropdownButtons = container.querySelectorAll('[class*="absolute"] button');
    const chinaBtn = Array.from(dropdownButtons).find((b) => b.textContent === "standard_china_adult");
    expect(chinaBtn?.className).toContain("bg-blue-50");
  });
});
