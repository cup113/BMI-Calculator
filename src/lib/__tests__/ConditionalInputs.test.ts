// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import ConditionalInputs from "$lib/components/ConditionalInputs.svelte";
import type { BmiCategory, BmiStandard, BmiLevel } from "$lib/standards/types";
import type { StageGroup } from "$lib/standards/china-student";

afterEach(() => cleanup());

function makeLevel(id: string, color: string): BmiLevel {
  return {
    id,
    nameKey: `level_${id}`,
    color,
    lightColor: color.replace("bg-", "bg-").replace(/(\d+)/, "100"),
    textColor: color.replace("bg-", "text-"),
    borderColor: color.replace("bg-", "border-"),
  };
}

function makeStandard(id: string, category: BmiCategory, requiredFields: Array<"gender" | "age" | "grade">): BmiStandard {
  return {
    id,
    nameKey: `standard_${id}`,
    descriptionKey: `standard_${id}`,
    category,
    requiredFields,
    localeOrder: { zh: 1, en: 2 },
    levels: [makeLevel("normal", "bg-green-500")],
    classify: () => null,
    weightThresholds: () => null,
    levelBmiBounds: () => null,
  };
}

const mockStageGroups: StageGroup[] = [
  {
    labelKey: "stage_primary",
    stages: [
      { id: "grade-1", nameKey: "stage_grade1" },
      { id: "grade-2", nameKey: "stage_grade2" },
    ],
  },
  {
    labelKey: "stage_junior",
    stages: [
      { id: "grade-7", nameKey: "stage_grade7" },
    ],
  },
];

const chinaAdult = makeStandard("china-adult", "adult", []);
const whoAdult = makeStandard("who-adult", "adult", []);
const chinaStudent = makeStandard("china-student", "student", ["gender", "grade"]);
const whoChild = makeStandard("who-child", "student", ["gender", "age"]);

const standardsMap: Record<BmiCategory, BmiStandard[]> = {
  student: [chinaStudent, whoChild],
  adult: [chinaAdult, whoAdult],
  senior: [],
};

describe("ConditionalInputs", () => {
  it("renders category buttons", () => {
    render(ConditionalInputs, {
      selectedCategory: "adult",
      standardId: "china-adult",
      age: "",
      selectedGrade: "grade-7",
      currentStandard: chinaAdult,
      standardsMap,
      categories: ["student", "adult", "senior"],
      stageGroups: mockStageGroups,
    });
    expect(screen.getByText("category_student")).toBeTruthy();
    expect(screen.getByText("category_adult")).toBeTruthy();
    expect(screen.getByText("category_senior")).toBeTruthy();
  });

  it("highlights selected category", () => {
    const { container } = render(ConditionalInputs, {
      selectedCategory: "adult",
      standardId: "china-adult",
      age: "",
      selectedGrade: "grade-7",
      currentStandard: chinaAdult,
      standardsMap,
      categories: ["student", "adult", "senior"],
      stageGroups: mockStageGroups,
    });
    const buttons = container.querySelectorAll(".conditional-inputs-container button");
    const adultBtn = Array.from(buttons).find((b) => b.textContent?.includes("category_adult"));
    expect(adultBtn?.className).toContain("bg-blue-500");
  });

  it("does not show grade picker when standard has no grade requirement", () => {
    const { container } = render(ConditionalInputs, {
      selectedCategory: "adult",
      standardId: "china-adult",
      age: "",
      selectedGrade: "grade-7",
      currentStandard: chinaAdult,
      standardsMap,
      categories: ["student", "adult", "senior"],
      stageGroups: mockStageGroups,
    });
    expect(container.textContent).not.toContain("stage_primary");
  });

  it("shows grade picker when standard requires grade", () => {
    render(ConditionalInputs, {
      selectedCategory: "student",
      standardId: "china-student",
      age: "",
      selectedGrade: "grade-7",
      currentStandard: chinaStudent,
      standardsMap,
      categories: ["student", "adult", "senior"],
      stageGroups: mockStageGroups,
    });
    expect(screen.getByText("stage_primary")).toBeTruthy();
    expect(screen.getByText("stage_junior")).toBeTruthy();
  });

  it("shows age input when standard requires age", () => {
    render(ConditionalInputs, {
      selectedCategory: "student",
      standardId: "who-child",
      age: 10,
      selectedGrade: "grade-7",
      currentStandard: whoChild,
      standardsMap,
      categories: ["student", "adult", "senior"],
      stageGroups: mockStageGroups,
    });
    expect(screen.getByPlaceholderText("5-19")).toBeTruthy();
  });

  it("shows switch standard dropdown on toggle", async () => {
    const { container } = render(ConditionalInputs, {
      selectedCategory: "adult",
      standardId: "china-adult",
      age: "",
      selectedGrade: "grade-7",
      currentStandard: chinaAdult,
      standardsMap,
      categories: ["student", "adult", "senior"],
      stageGroups: mockStageGroups,
    });
    const switchBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("switch_standard")
    );
    expect(switchBtn).toBeTruthy();
    await fireEvent.click(switchBtn!);
    expect(screen.getByText("standard_who-adult")).toBeTruthy();
  });
});
