import { describe, it, expect } from "vitest";
import {
  hexColor, textHexColor, averageHex, computeGaugeData, arcPath, tickLine, labelPos,
} from "../gauge-math";
import type { BmiLevel } from "../standards/types";

describe("hexColor", () => {
  it("converts bg-blue-500 to hex", () => {
    expect(hexColor("bg-blue-500")).toBe("#3b82f6");
  });

  it("handles unknown class with fallback", () => {
    expect(hexColor("bg-unknown")).toBe("#64748b");
  });

  it("handles bg-red-800", () => {
    expect(hexColor("bg-red-800")).toBe("#991b1b");
  });
});

describe("textHexColor", () => {
  it("converts bg-green-500 to hex", () => {
    expect(textHexColor("bg-green-500")).toBe("#16a34a");
  });

  it("handles unknown class with fallback", () => {
    expect(textHexColor("bg-unknown-500")).toBe("#475569");
  });
});

describe("averageHex", () => {
  it("averages two hex colors", () => {
    expect(averageHex("#3b82f6", "#ef4444")).toBe("#95639d");
  });

  it("returns same color when both are equal", () => {
    expect(averageHex("#22c55e", "#22c55e")).toBe("#22c55e");
  });
});

describe("arcPath", () => {
  it("returns SVG arc path for full half circle", () => {
    const path = arcPath(Math.PI, 0);
    expect(path).toContain("M");
    expect(path).toContain("A 160 160 0 0 1");
  });

  it("returns valid path for partial arc", () => {
    const path = arcPath(1.5, 1.0);
    expect(path).toContain("M");
  });
});

describe("tickLine", () => {
  it("returns SVG line path", () => {
    const path = tickLine(0);
    expect(path).toContain("M");
    expect(path).toContain("L");
  });
});

describe("labelPos", () => {
  it("returns x/y coordinates", () => {
    const pos = labelPos(0, 118);
    expect(pos.x).toBeGreaterThan(0);
    expect(pos.y).toBe(200);
  });
});

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

describe("computeGaugeData", () => {
  const levels = [
    makeLevel("underweight", "bg-blue-500"),
    makeLevel("normal", "bg-green-500"),
    makeLevel("overweight", "bg-amber-500"),
    makeLevel("obese", "bg-red-500"),
  ];

  const bounds = [
    { min: 10, max: 18.5 },
    { min: 18.5, max: 24 },
    { min: 24, max: 28 },
    { min: 28, max: 50 },
  ];

  it("returns empty data for null bmi", () => {
    const data = computeGaugeData(levels, bounds, null, 1, false);
    expect(data.segments).toHaveLength(0);
    expect(data.needleAngle).toBeNull();
  });

  it("returns empty data for zero bmi", () => {
    const data = computeGaugeData(levels, bounds, 0, 1, false);
    expect(data.segments).toHaveLength(0);
    expect(data.needleAngle).toBeNull();
  });

  it("returns segments for all levels when not zoomed", () => {
    const data = computeGaugeData(levels, bounds, 22, 1, false);
    expect(data.segments).toHaveLength(4);
    expect(data.ticks).toHaveLength(5);
  });

  it("has needleAngle in correct range", () => {
    const data = computeGaugeData(levels, bounds, 22, 1, false);
    expect(data.needleAngle).toBeGreaterThan(0);
    expect(data.needleAngle).toBeLessThan(Math.PI);
  });

  it("clamps needle to visualMin for very low bmi", () => {
    const data = computeGaugeData(levels, bounds, 5, 0, false);
    expect(data.needleAngle).toBeCloseTo(Math.PI, 1);
  });

  it("returns fewer segments when zoomed in", () => {
    const data = computeGaugeData(levels, bounds, 22, 1, true);
    expect(data.segments.length).toBeLessThanOrEqual(3);
  });

  it("zooms near center", () => {
    const data = computeGaugeData(levels, bounds, 22, 2, true);
    expect(data.segments.length).toBe(3);
    expect(data.segments[0].index).toBe(1);
    expect(data.segments[2].index).toBe(3);
  });

  it("handles single level", () => {
    const singleLevel = [levels[0]];
    const singleBounds = [{ min: 10, max: 18.5 }];
    const data = computeGaugeData(singleLevel, singleBounds, 15, 0, false);
    expect(data.segments).toHaveLength(1);
  });

  it("handles two levels", () => {
    const twoLevels = levels.slice(0, 2);
    const twoBounds = bounds.slice(0, 2);
    const data = computeGaugeData(twoLevels, twoBounds, 20, 1, false);
    expect(data.segments).toHaveLength(2);
  });

  it("handles null in bounds array", () => {
    const data = computeGaugeData(levels, [null, null, null, null], 22, 1, false);
    expect(data.segments).toHaveLength(0);
    expect(data.needleAngle).toBeNull();
  });
});
