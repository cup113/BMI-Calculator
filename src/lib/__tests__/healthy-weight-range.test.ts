import { describe, it, expect } from "vitest";
import { computeHealthyWeightRange } from "../healthy-weight-range";
import { whoAdultStandard } from "../standards/who-adult";
import { chinaAdultStandard } from "../standards/china-adult";
import type { BmiStandard, BmiLevel, ClassificationInput } from "../standards/types";
import type { WeightUnit } from "../units";

const kg: WeightUnit = { id: "kg", labelKey: "unit_kg", toKg: (v) => v, fromKg: (v) => v };
const lb: WeightUnit = { id: "lb", labelKey: "unit_lb", toKg: (v) => v / 2.20462, fromKg: (v) => v * 2.20462 };

describe("computeHealthyWeightRange", () => {
  it("returns range for WHO Adult at 170cm in kg", () => {
    const r = computeHealthyWeightRange(170, whoAdultStandard, { bmi: 22 }, kg);
    expect(r).not.toBeNull();
    expect(r!.min).toBeCloseTo(53.5, 0);
    expect(r!.max).toBeCloseTo(72.3, 0);
    expect(r!.unitLabel).toBe("unit_kg");
  });

  it("returns range in lb when unit is lb", () => {
    const r = computeHealthyWeightRange(170, whoAdultStandard, { bmi: 22 }, lb);
    expect(r).not.toBeNull();
    expect(r!.min).toBeCloseTo(117.9, 0);
    expect(r!.max).toBeCloseTo(159.3, 0);
    expect(r!.unitLabel).toBe("unit_lb");
  });

  it("returns null for zero height", () => {
    expect(computeHealthyWeightRange(0, whoAdultStandard, { bmi: 22 }, kg)).toBeNull();
  });

  it("returns range for China Adult 160cm", () => {
    const r = computeHealthyWeightRange(160, chinaAdultStandard, { bmi: 22 }, kg);
    expect(r).not.toBeNull();
    expect(r!.min).toBeCloseTo(47.4, 0);
    expect(r!.max).toBeCloseTo(61.4, 0);
  });

  it("returns null when standard has no normal level", () => {
    const noNormalLevels: BmiLevel[] = [
      { id: "underweight", nameKey: "x", color: "bg-blue-500", lightColor: "", textColor: "", borderColor: "" },
      { id: "overweight", nameKey: "x", color: "bg-amber-500", lightColor: "", textColor: "", borderColor: "" },
    ];
    const mockStandard: BmiStandard = {
      id: "mock", nameKey: "mock", descriptionKey: "mock", category: "adult",
      requiredFields: [], localeOrder: { zh: 0, en: 0 }, levels: noNormalLevels,
      classify: () => null,
      weightThresholds: () => null,
      levelBmiBounds: () => null,
    };
    expect(computeHealthyWeightRange(170, mockStandard, { bmi: 22 }, kg)).toBeNull();
  });

  it("returns null when levelBmiBounds returns null for normal index", () => {
    const normalLevels: BmiLevel[] = [
      { id: "normal", nameKey: "x", color: "bg-green-500", lightColor: "", textColor: "", borderColor: "" },
    ];
    const mockStandard: BmiStandard = {
      id: "mock", nameKey: "mock", descriptionKey: "mock", category: "adult",
      requiredFields: [], localeOrder: { zh: 0, en: 0 }, levels: normalLevels,
      classify: () => null,
      weightThresholds: () => null,
      levelBmiBounds: () => null,
    };
    expect(computeHealthyWeightRange(170, mockStandard, { bmi: 22 }, kg)).toBeNull();
  });
});
