import { describe, it, expect } from "vitest";
import { calculateBMI, calculateSegmentWidths, calculateBarPosition } from "../bmi";
import { getWeightUnits, convertWeightText } from "../units";
import { whoAdultStandard } from "../standards/who-adult";
import { chinaAdultStandard } from "../standards/china-adult";
import { usAdultStandard } from "../standards/us-adult";
import { chinaElderlyStandard } from "../standards/china-elderly";
import { chinaStudentStandard } from "../standards/china-student";
import { whoChildStandard } from "../standards/who-child";
import { getOrderedStandards, getDefaultStandardId, getStandardsByCategory, getCategories } from "../standards/registry";
import type { ClassificationInput } from "../standards/types";

describe("calculateBMI", () => {
  it("calculates BMI from weight kg and height cm", () => {
    expect(calculateBMI(70, 175)).toBe(22.86);
  });

  it("returns null for zero weight", () => {
    expect(calculateBMI(0, 175)).toBeNull();
  });

  it("returns null for zero height", () => {
    expect(calculateBMI(70, 0)).toBeNull();
  });

  it("returns null for negative weight", () => {
    expect(calculateBMI(-70, 175)).toBeNull();
  });

  it("returns null for NaN inputs", () => {
    expect(calculateBMI(NaN, 175)).toBeNull();
  });
});

describe("WHO Adult (6 levels)", () => {
  it("classifies underweight", () => {
    const r = whoAdultStandard.classify({ bmi: 16 });
    expect(r?.index).toBe(0);
    expect(r?.level.id).toBe("underweight");
  });

  it("classifies normal", () => {
    const r = whoAdultStandard.classify({ bmi: 22 });
    expect(r?.index).toBe(1);
  });

  it("classifies pre-obesity", () => {
    const r = whoAdultStandard.classify({ bmi: 27 });
    expect(r?.index).toBe(2);
  });

  it("classifies obese class I", () => {
    const r = whoAdultStandard.classify({ bmi: 32 });
    expect(r?.index).toBe(3);
  });

  it("classifies obese class II", () => {
    const r = whoAdultStandard.classify({ bmi: 37 });
    expect(r?.index).toBe(4);
  });

  it("classifies obese class III", () => {
    const r = whoAdultStandard.classify({ bmi: 42 });
    expect(r?.index).toBe(5);
  });

  it("returns null for invalid bmi", () => {
    expect(whoAdultStandard.classify({ bmi: 0 })).toBeNull();
  });
});

describe("China Adult (4 levels)", () => {
  it("classifies normal at lower bound", () => {
    expect(chinaAdultStandard.classify({ bmi: 18.5 })?.index).toBe(1);
  });

  it("classifies overweight at 24", () => {
    expect(chinaAdultStandard.classify({ bmi: 24 })?.index).toBe(2);
  });

  it("classifies obese at 28+", () => {
    expect(chinaAdultStandard.classify({ bmi: 28 })?.index).toBe(3);
  });
});

describe("US Adult (4 levels)", () => {
  it("classifies overweight at 25", () => {
    expect(usAdultStandard.classify({ bmi: 25 })?.index).toBe(2);
  });

  it("classifies obese at 30", () => {
    expect(usAdultStandard.classify({ bmi: 30 })?.index).toBe(3);
  });
});

describe("China Elderly (3 levels)", () => {
  it("classifies underweight below 22", () => {
    expect(chinaElderlyStandard.classify({ bmi: 20 })?.index).toBe(0);
  });

  it("classifies normal at 22-27", () => {
    expect(chinaElderlyStandard.classify({ bmi: 24 })?.index).toBe(1);
  });

  it("classifies overweight/obese at 27+", () => {
    expect(chinaElderlyStandard.classify({ bmi: 27 })?.index).toBe(2);
  });
});

describe("China Student (4 levels, grade-based)", () => {
  it("classifies grade-7 male underweight", () => {
    const r = chinaStudentStandard.classify({ bmi: 14, gender: "male", grade: "grade-7" });
    expect(r?.index).toBe(0);
  });

  it("classifies grade-7 male normal", () => {
    const r = chinaStudentStandard.classify({ bmi: 18, gender: "male", grade: "grade-7" });
    expect(r?.index).toBe(1);
  });

  it("classifies grade-10 female overweight", () => {
    const r = chinaStudentStandard.classify({ bmi: 24, gender: "female", grade: "grade-10" });
    expect(r?.index).toBe(2);
  });

  it("returns null without grade", () => {
    expect(chinaStudentStandard.classify({ bmi: 18, gender: "male" })).toBeNull();
  });
});

describe("WHO Child (5-19y, 5 levels)", () => {
  it("classifies normal for average 12-year-old boy", () => {
    const r = whoChildStandard.classify({ bmi: 18, gender: "male", age: 12 });
    expect(r?.index).toBe(2);
    expect(r?.level.id).toBe("normal");
  });

  it("classifies overweight for high BMI 10-year-old girl", () => {
    const r = whoChildStandard.classify({ bmi: 24, gender: "female", age: 10 });
    expect(r?.index).toBe(4);
    expect(r?.level.id).toBe("obese");
  });

  it("classifies severe thinness for very low BMI 8-year-old boy", () => {
    const r = whoChildStandard.classify({ bmi: 11, gender: "male", age: 8 });
    expect(r?.index).toBe(0);
  });

  it("returns null without age", () => {
    expect(whoChildStandard.classify({ bmi: 18, gender: "male" })).toBeNull();
  });
});

describe("Registry", () => {
  it("defaults to china-adult for zh locale", () => {
    expect(getDefaultStandardId("zh")).toBe("china-adult");
  });

  it("defaults to who-adult for en locale", () => {
    expect(getDefaultStandardId("en")).toBe("who-adult");
  });

  it("orders standards by locale", () => {
    const zhOrder = getOrderedStandards("zh");
    expect(zhOrder[0].id).toBe("china-adult");

    const enOrder = getOrderedStandards("en");
    expect(enOrder[0].id).toBe("who-adult");
  });

  it("categories return all three groups", () => {
    expect(getCategories()).toEqual(["student", "adult", "senior"]);
  });

  it("getStandardsByCategory returns adult standards locale-sorted", () => {
    const zh = getStandardsByCategory("adult", "zh");
    expect(zh.length).toBe(3);
    expect(zh[0].id).toBe("china-adult");

    const en = getStandardsByCategory("adult", "en");
    expect(en.length).toBe(3);
    expect(en[0].id).toBe("who-adult");
  });

  it("getStandardsByCategory returns student standards locale-sorted", () => {
    const zh = getStandardsByCategory("student", "zh");
    expect(zh.length).toBe(2);
    expect(zh[0].id).toBe("china-student");

    const en = getStandardsByCategory("student", "en");
    expect(en.length).toBe(2);
    expect(en[0].id).toBe("who-child");
  });

  it("getStandardsByCategory returns single senior standard", () => {
    const senior = getStandardsByCategory("senior", "zh");
    expect(senior.length).toBe(1);
    expect(senior[0].id).toBe("china-elderly");
  });

  it("all standards have a valid category", () => {
    for (const s of getOrderedStandards("zh")) {
      expect(["student", "adult", "senior"]).toContain(s.category);
    }
  });

  it("china-elderly no longer requires age", () => {
    expect(chinaElderlyStandard.requiredFields).not.toContain("age");
  });
});

describe("calculateSegmentWidths", () => {
  it("returns all 100 for single level", () => {
    expect(calculateSegmentWidths(0, 1)).toEqual([100]);
  });

  it("sets current index to 70 for 4-level", () => {
    expect(calculateSegmentWidths(0, 4)).toEqual([70, 10, 10, 10]);
    expect(calculateSegmentWidths(1, 4)).toEqual([10, 70, 10, 10]);
    expect(calculateSegmentWidths(2, 4)).toEqual([10, 10, 70, 10]);
    expect(calculateSegmentWidths(3, 4)).toEqual([10, 10, 10, 70]);
  });

  it("sets current index to 70 for 6-level", () => {
    const widths = calculateSegmentWidths(2, 6);
    expect(widths[2]).toBe(70);
    expect(widths.filter((w) => w !== 70)).toHaveLength(5);
    widths.forEach((w) => expect(w).toBeGreaterThan(0));
  });
});

describe("calculateBarPosition", () => {
  it("returns 0 when bmi is 0", () => {
    expect(calculateBarPosition(0, { min: 18.5, max: 24 }, [10, 70, 10, 10], 1)).toBe(0);
  });

  it("places pointer at start of segment when bmi equals min", () => {
    expect(calculateBarPosition(18.5, { min: 18.5, max: 24 }, [10, 70, 10, 10], 1)).toBe(10);
  });

  it("places pointer at end of segment when bmi equals max", () => {
    expect(calculateBarPosition(24, { min: 18.5, max: 24 }, [10, 70, 10, 10], 1)).toBe(80);
  });

  it("places pointer mid-segment", () => {
    const pos = calculateBarPosition(21.25, { min: 18.5, max: 24 }, [10, 70, 10, 10], 1);
    expect(pos).toBeGreaterThan(10);
    expect(pos).toBeLessThan(80);
  });

  it("handles first level", () => {
    const pos = calculateBarPosition(14, { min: 10, max: 18.5 }, [70, 10, 10, 10], 0);
    expect(pos).toBeGreaterThan(0);
    expect(pos).toBeLessThan(70);
  });

  it("handles last level", () => {
    const pos = calculateBarPosition(35, { min: 28, max: 50 }, [10, 10, 10, 70], 3);
    expect(pos).toBeGreaterThan(40);
    expect(pos).toBeLessThanOrEqual(100);
  });
});

describe("convertWeightText", () => {
  const [kg, jin] = getWeightUnits("zh");
  const [, lb] = getWeightUnits("en");

  it("converts kg to jin (zh locale)", () => {
    expect(convertWeightText(70, kg, jin)).toBe("= 140.0 斤");
  });

  it("converts jin to kg (zh locale)", () => {
    expect(convertWeightText(140, jin, kg)).toBe("= 70.0 kg");
  });

  it("converts kg to lb (en locale)", () => {
    expect(convertWeightText(70, kg, lb)).toBe("= 154.3 lb");
  });

  it("returns empty for zero weight", () => {
    expect(convertWeightText(0, kg, jin)).toBe("");
  });

  it("returns empty for negative weight", () => {
    expect(convertWeightText(-1, kg, jin)).toBe("");
  });
});
