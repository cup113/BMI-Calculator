// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import CategorySelector from "$lib/components/CategorySelector.svelte";
import type { BmiCategory, BmiStandard } from "$lib/standards/types";

function makeStandard(id: string, name: string, category: BmiCategory): BmiStandard {
  return {
    id,
    nameKey: name,
    descriptionKey: name,
    category,
    requiredFields: [],
    localeOrder: { zh: 0, en: 0 },
    levels: [],
    classify: () => null,
    weightThresholds: () => null,
    levelBmiBounds: () => null,
  };
}

const categories: BmiCategory[] = ["student", "adult", "senior"];

const standardsMap: Record<BmiCategory, BmiStandard[]> = {
  student: [makeStandard("china-student", "standard_china_student", "student")],
  adult: [makeStandard("china-adult", "standard_china_adult", "adult")],
  senior: [makeStandard("china-elderly", "standard_china_elderly", "senior")],
};

afterEach(() => cleanup());

describe("CategorySelector", () => {
  it("renders all category buttons", () => {
    render(CategorySelector, { selectedCategory: "adult", categories, standardsMap });
    expect(screen.getByText("category_student")).toBeTruthy();
    expect(screen.getByText("category_adult")).toBeTruthy();
    expect(screen.getByText("category_senior")).toBeTruthy();
  });

  it("highlights selected category", () => {
    const { container } = render(CategorySelector, { selectedCategory: "adult", categories, standardsMap });
    const buttons = container.querySelectorAll("button");
    const adultBtn = Array.from(buttons).find((b) => b.textContent === "category_adult");
    expect(adultBtn?.className).toContain("bg-blue-500");
  });

  it("calls onselectCategory when clicking a different category", async () => {
    const onselect = vi.fn();
    const { container } = render(CategorySelector, {
      selectedCategory: "adult", categories, standardsMap, onselectCategory: onselect,
    });
    const buttons = container.querySelectorAll("button");
    const studentBtn = Array.from(buttons).find((b) => b.textContent === "category_student")!;
    await fireEvent.click(studentBtn);
    expect(onselect).toHaveBeenCalledWith("student");
  });

  it("does not call onselect when clicking the same category", async () => {
    const onselect = vi.fn();
    const { container } = render(CategorySelector, {
      selectedCategory: "adult", categories, standardsMap, onselectCategory: onselect,
    });
    const buttons = container.querySelectorAll("button");
    const adultBtn = Array.from(buttons).find((b) => b.textContent === "category_adult")!;
    await fireEvent.click(adultBtn);
    expect(onselect).not.toHaveBeenCalled();
  });

  it("does nothing when clicking a category with empty standards", async () => {
    const onselect = vi.fn();
    const emptyMap: Record<string, BmiStandard[]> = {};
    const { container } = render(CategorySelector, {
      selectedCategory: "adult", categories, standardsMap: emptyMap, onselectCategory: onselect,
    });
    const buttons = container.querySelectorAll("button");
    const otherBtn = Array.from(buttons).find((b) => b.textContent?.includes("student"))!;
    await fireEvent.click(otherBtn);
    expect(onselect).not.toHaveBeenCalled();
  });
});
