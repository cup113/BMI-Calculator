import { describe, it, expect } from "vitest";
import { calculateBMI } from "../bmi";
import { getWeightUnits, convertWeightText } from "../units";
import { whoAdultStandard } from "../standards/who-adult";
import { chinaAdultStandard } from "../standards/china-adult";
import { chinaElderlyStandard } from "../standards/china-elderly";
import { chinaStudentStandard } from "../standards/china-student";
import { whoChildStandard } from "../standards/who-child";
import { getOrderedStandards, getDefaultStandardId, getStandardsByCategory, getCategories, getStandard, getAllStandards } from "../standards/registry";
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

  it("returns null without gender", () => {
    expect(whoChildStandard.classify({ bmi: 18, age: 12 })).toBeNull();
  });

  it("weightThresholds returns null without gender", () => {
    expect(whoChildStandard.weightThresholds(170, { bmi: 18, age: 12 })).toBeNull();
  });

  it("levelBmiBounds returns null without gender", () => {
    expect(whoChildStandard.levelBmiBounds(0, { bmi: 18, age: 12 })).toBeNull();
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
    expect(zh.length).toBe(2);
    expect(zh[0].id).toBe("china-adult");

    const en = getStandardsByCategory("adult", "en");
    expect(en.length).toBe(2);
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

  it("getStandard retrieves by id", () => {
    expect(getStandard("who-adult")?.id).toBe("who-adult");
  });

  it("getStandard returns undefined for unknown id", () => {
    expect(getStandard("non-existent")).toBeUndefined();
  });

  it("getAllStandards returns 5 standards", () => {
    expect(getAllStandards()).toHaveLength(5);
  });

  it("getAllStandards returns correct standard ids", () => {
    const ids = getAllStandards().map((s) => s.id).sort();
    expect(ids).toEqual(["china-adult", "china-elderly", "china-student", "who-adult", "who-child"]);
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

describe("getWeightUnits", () => {
  it("returns kg/lb for en locale", () => {
    const [u1, u2] = getWeightUnits("en");
    expect(u1.id).toBe("kg");
    expect(u2.id).toBe("lb");
  });
});

describe("weightThresholds", () => {
  describe("WHO Adult", () => {
    it("returns null for zero height", () => {
      expect(whoAdultStandard.weightThresholds(0, { bmi: 22 })).toBeNull();
    });

    it("returns null for negative height", () => {
      expect(whoAdultStandard.weightThresholds(-1, { bmi: 22 })).toBeNull();
    });

    it("returns thresholds for 170cm", () => {
      const r = whoAdultStandard.weightThresholds(170, { bmi: 22 })!;
      expect(r.underweightMax).toBe("53.5");
      expect(r.normalMax).toBe("72.2");
      expect(r.overweightMax).toBe("101.1");
    });
  });

  describe("China Adult", () => {
    it("returns thresholds for 170cm", () => {
      const r = chinaAdultStandard.weightThresholds(170, { bmi: 22 })!;
      expect(r.underweightMax).toBe("53.5");
      expect(r.normalMax).toBe("69.4");
      expect(r.overweightMax).toBe("80.9");
    });
  });

  describe("China Elderly", () => {
    it("returns thresholds for 170cm", () => {
      const r = chinaElderlyStandard.weightThresholds(170, { bmi: 22 })!;
      expect(r.underweightMax).toBe("63.6");
      expect(r.normalMax).toBe("78.0");
      expect(r.overweightMax).toBe("");
    });
  });

  describe("China Student", () => {
    it("returns null without grade", () => {
      expect(chinaStudentStandard.weightThresholds(170, { bmi: 18, gender: "male" })).toBeNull();
    });

    it("returns null without gender", () => {
      expect(chinaStudentStandard.weightThresholds(170, { bmi: 18, grade: "grade-7" })).toBeNull();
    });

    it("returns thresholds for grade-7 male 170cm", () => {
      const r = chinaStudentStandard.weightThresholds(170, { bmi: 18, gender: "male", grade: "grade-7" })!;
      expect(r.underweightMax).toBe("44.8");
      expect(r.normalMax).toBe("64.2");
      expect(r.overweightMax).toBe("71.1");
    });
  });

  describe("WHO Child", () => {
    it("returns null without age", () => {
      expect(whoChildStandard.weightThresholds(170, { bmi: 18, gender: "male" })).toBeNull();
    });

    it("returns thresholds for 12-year-old boy 170cm", () => {
      const r = whoChildStandard.weightThresholds(170, { bmi: 18, gender: "male", age: 12 })!;
      expect(Number(r.underweightMax)).toBeGreaterThan(0);
      expect(Number(r.normalMax)).toBeGreaterThan(0);
      expect(Number(r.overweightMax)).toBeGreaterThan(0);
    });
  });
});

describe("levelBmiBounds", () => {
  describe("WHO Adult", () => {
    it("returns null for out-of-range index", () => {
      expect(whoAdultStandard.levelBmiBounds(-1, { bmi: 22 })).toBeNull();
      expect(whoAdultStandard.levelBmiBounds(99, { bmi: 22 })).toBeNull();
    });

    it("returns bounds for level 0 (underweight)", () => {
      const b = whoAdultStandard.levelBmiBounds(0, { bmi: 22 })!;
      expect(b.min).toBe(10);
      expect(b.max).toBe(18.5);
    });

    it("returns bounds for level 2 (pre-obesity)", () => {
      const b = whoAdultStandard.levelBmiBounds(2, { bmi: 27 })!;
      expect(b.min).toBe(25);
      expect(b.max).toBe(30);
    });

    it("returns bounds for last level (obese class III)", () => {
      const b = whoAdultStandard.levelBmiBounds(5, { bmi: 42 })!;
      expect(b.min).toBe(40);
      expect(b.max).toBe(60);
    });
  });

  describe("China Adult", () => {
    it("returns bounds for level 0", () => {
      const b = chinaAdultStandard.levelBmiBounds(0, { bmi: 16 })!;
      expect(b.min).toBe(10);
      expect(b.max).toBe(18.5);
    });

    it("returns bounds for last level", () => {
      const b = chinaAdultStandard.levelBmiBounds(3, { bmi: 30 })!;
      expect(b.min).toBe(28);
      expect(b.max).toBe(50);
    });
  });

  describe("China Elderly", () => {
    it("returns bounds for level 1 (normal)", () => {
      const b = chinaElderlyStandard.levelBmiBounds(1, { bmi: 24 })!;
      expect(b.min).toBe(22);
      expect(b.max).toBe(27);
    });
  });

  describe("China Student", () => {
    it("returns null without grade", () => {
      expect(chinaStudentStandard.levelBmiBounds(0, { bmi: 18, gender: "male" })).toBeNull();
    });

    it("returns bounds for grade-7 male level 0", () => {
      const b = chinaStudentStandard.levelBmiBounds(0, { bmi: 14, gender: "male", grade: "grade-7" })!;
      expect(b.min).toBe(5);
      expect(b.max).toBe(15.5);
    });
  });

  describe("WHO Child", () => {
    it("returns null without age", () => {
      expect(whoChildStandard.levelBmiBounds(0, { bmi: 18, gender: "male" })).toBeNull();
    });

    it("returns bounds for 12-year-old boy level 2", () => {
      const b = whoChildStandard.levelBmiBounds(2, { bmi: 18, gender: "male", age: 12 })!;
      expect(b.min).toBeGreaterThan(0);
      expect(b.max).toBeGreaterThan(b.min);
    });
  });
});
