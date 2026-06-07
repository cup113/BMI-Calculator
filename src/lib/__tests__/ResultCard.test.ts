// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/svelte";
import ResultCard from "$lib/components/ResultCard.svelte";
import type { ClassificationResult, BmiLevel, BmiStandard } from "$lib/standards/types";

afterEach(() => cleanup());

function makeLevel(id: string, color: string, textColor: string, textColorDark?: string): BmiLevel {
  return {
    id,
    nameKey: `level_${id}`,
    color,
    lightColor: color.replace("bg-", "bg-").replace(/(\d+)/, "100"),
    textColor,
    textColorDark,
    borderColor: color.replace("bg-", "border-"),
  };
}

const mockStandard: BmiStandard = {
  id: "test",
  nameKey: "standard_test",
  descriptionKey: "standard_test",
  category: "adult",
  requiredFields: [],
  localeOrder: { zh: 1, en: 2 },
  levels: [
    makeLevel("underweight", "bg-blue-500", "text-blue-600"),
    makeLevel("normal", "bg-green-500", "text-green-600"),
    makeLevel("overweight", "bg-amber-500", "text-amber-600"),
    makeLevel("obese", "bg-red-500", "text-red-600"),
  ],
  classify: () => null,
  weightThresholds: () => null,
  levelBmiBounds: () => null,
};

const normalResult: ClassificationResult = {
  level: makeLevel("normal", "bg-green-500", "text-green-600"),
  index: 1,
};

describe("ResultCard", () => {
  it("renders BMI value", () => {
    render(ResultCard, {
      bmi: 22.5,
      result: normalResult,
      levelBoundsArray: [
        { min: 10, max: 18.5 },
        { min: 18.5, max: 24 },
        { min: 24, max: 28 },
        { min: 28, max: 50 },
      ],
      levelLabels: ["underweight", "normal", "overweight", "obese"],
      zoomedIn: false,
      healthyWeightMinConverted: 55.0,
      healthyWeightMaxConverted: 75.0,
      healthyWeightUnitLabel: "kg",
      currentStandard: mockStandard,
    });
    expect(screen.getByText("your_bmi")).toBeTruthy();
    expect(screen.getByText("22.5")).toBeTruthy();
  });

  it("shows healthy weight range when provided", () => {
    render(ResultCard, {
      bmi: 22.5,
      result: normalResult,
      levelBoundsArray: [
        { min: 10, max: 18.5 },
        { min: 18.5, max: 24 },
        { min: 24, max: 28 },
        { min: 28, max: 50 },
      ],
      levelLabels: ["underweight", "normal", "overweight", "obese"],
      zoomedIn: false,
      healthyWeightMinConverted: 55.0,
      healthyWeightMaxConverted: 75.0,
      healthyWeightUnitLabel: "kg",
      currentStandard: mockStandard,
    });
    expect(screen.getByText("healthy_weight_range")).toBeTruthy();
    expect(screen.getByText("55.0 - 75.0 kg")).toBeTruthy();
  });

  it("does not show healthy weight range when null", () => {
    render(ResultCard, {
      bmi: 22.5,
      result: normalResult,
      levelBoundsArray: [
        { min: 10, max: 18.5 },
        { min: 18.5, max: 24 },
        { min: 24, max: 28 },
        { min: 28, max: 50 },
      ],
      levelLabels: ["underweight", "normal", "overweight", "obese"],
      zoomedIn: false,
      healthyWeightMinConverted: null,
      healthyWeightMaxConverted: null,
      healthyWeightUnitLabel: "kg",
      currentStandard: mockStandard,
    });
    expect(screen.queryByText("healthy_weight_range")).toBeNull();
  });

  it("renders recalculate button", () => {
    render(ResultCard, {
      bmi: 22.5,
      result: normalResult,
      levelBoundsArray: [
        { min: 10, max: 18.5 },
        { min: 18.5, max: 24 },
        { min: 24, max: 28 },
        { min: 28, max: 50 },
      ],
      levelLabels: ["underweight", "normal", "overweight", "obese"],
      zoomedIn: false,
      healthyWeightMinConverted: null,
      healthyWeightMaxConverted: null,
      healthyWeightUnitLabel: "kg",
      currentStandard: mockStandard,
    });
    expect(screen.getByText("recalculate")).toBeTruthy();
  });

  describe("dark mode", () => {
    const darkLevel = makeLevel("normal", "bg-green-500", "text-green-600", "text-green-400");
    const darkResult: ClassificationResult = { level: darkLevel, index: 1 };

    it("uses textColorDark when theme is dark", async () => {
      const { theme } = await import("$lib/theme.svelte");
      const orig = theme.value;
      theme.value = "dark";
      try {
        const { container } = render(ResultCard, {
          bmi: 22.5,
          result: darkResult,
          levelBoundsArray: [
            { min: 10, max: 18.5 },
            { min: 18.5, max: 24 },
            { min: 24, max: 28 },
            { min: 28, max: 50 },
          ],
          levelLabels: ["underweight", "normal", "overweight", "obese"],
          zoomedIn: false,
          healthyWeightMinConverted: null,
          healthyWeightMaxConverted: null,
          healthyWeightUnitLabel: "kg",
          currentStandard: mockStandard,
        });

        const textEl = container.querySelector('[class*="text-green"]');
        expect(textEl?.className).toContain("text-green-400");
      } finally {
        theme.value = orig;
      }
    });
  });
});
