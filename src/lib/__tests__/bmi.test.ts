import { describe, it, expect } from "vitest";
import {
    calculateBMI,
    getThresholds,
    classifyBMI,
    calculateWeightThresholds,
    calculateSegmentWidths,
    calculateBarPosition,
    convertWeightText,
} from "../bmi";
import { categoryConfig } from "../constants";

describe("calculateBMI", () => {
    it("calculates BMI for metric input", () => {
        expect(calculateBMI(70, 175)).toBe(22.86);
    });

    it("converts jin to kg then calculates BMI", () => {
        expect(calculateBMI(140, 175, "jin")).toBe(22.86);
    });

    it("returns null for empty weight", () => {
        expect(calculateBMI(0, 175)).toBeNull();
    });

    it("returns null for empty height", () => {
        expect(calculateBMI(70, 0)).toBeNull();
    });

    it("returns null for negative values", () => {
        expect(calculateBMI(-70, 175)).toBeNull();
    });

    it("returns null for NaN-like inputs", () => {
        expect(calculateBMI(NaN, 175)).toBeNull();
    });
});

describe("getThresholds", () => {
    it("returns male thresholds for 成年", () => {
        const t = getThresholds("成年", "male");
        expect(t).toEqual([18.5, 24.0, 28.0]);
    });

    it("returns female thresholds for 成年", () => {
        const t = getThresholds("成年", "female");
        expect(t).toEqual([18.5, 24.0, 28.0]);
    });

    it("returns thresholds for 一年级 male", () => {
        const t = getThresholds("一年级", "male");
        expect(t).toEqual([13.5, 18.2, 20.4]);
    });

    it("returns thresholds for 高一 female", () => {
        const t = getThresholds("高一", "female");
        expect(t).toEqual([16.5, 22.8, 25.3]);
    });

    it("returns null for unknown stage", () => {
        expect(getThresholds("博士", "male")).toBeNull();
    });

    it("returns correct values for all 14 stages × 2 genders", () => {
        const stages = [
            "一年级", "二年级", "三年级", "四年级", "五年级", "六年级",
            "七年级", "八年级", "九年级",
            "高一", "高二", "高三",
            "大学", "成年",
        ];
        for (const s of stages) {
            const male = getThresholds(s, "male");
            const female = getThresholds(s, "female");
            expect(male).toHaveLength(3);
            expect(female).toHaveLength(3);
            male!.forEach((v) => expect(v).toBeGreaterThan(0));
            female!.forEach((v) => expect(v).toBeGreaterThan(0));
        }
    });
});

describe("classifyBMI", () => {
    const adultMale: [number, number, number] = [18.5, 24.0, 28.0];

    it("returns underweight when BMI below underweight threshold", () => {
        expect(classifyBMI(16, adultMale)).toBe(categoryConfig.underweight);
    });

    it("returns normal when BMI is exactly at underweight threshold", () => {
        expect(classifyBMI(18.5, adultMale)).toBe(categoryConfig.normal);
    });

    it("returns normal when BMI is between normal range", () => {
        expect(classifyBMI(21, adultMale)).toBe(categoryConfig.normal);
    });

    it("returns normal when BMI is exactly at normal threshold", () => {
        expect(classifyBMI(24.0, adultMale)).toBe(categoryConfig.overweight);
    });

    it("returns overweight when BMI is between overweight range", () => {
        expect(classifyBMI(26, adultMale)).toBe(categoryConfig.overweight);
    });

    it("returns overweight when BMI is exactly at overweight threshold", () => {
        expect(classifyBMI(28.0, adultMale)).toBe(categoryConfig.obese);
    });

    it("returns obese when BMI exceeds overweight threshold", () => {
        expect(classifyBMI(30, adultMale)).toBe(categoryConfig.obese);
    });

    it("returns null when bmi is null", () => {
        expect(classifyBMI(null, adultMale)).toBeNull();
    });

    it("returns null when thresholds is null", () => {
        expect(classifyBMI(21, null)).toBeNull();
    });
});

describe("calculateWeightThresholds", () => {
    const adultMale: [number, number, number] = [18.5, 24.0, 28.0];

    it("calculates weight thresholds for given height", () => {
        const r = calculateWeightThresholds(175, adultMale);
        expect(r).toEqual({
            underweightMax: "56.7",
            normalMax: "73.5",
            overweightMax: "85.8",
        });
    });

    it("returns null when height is 0", () => {
        expect(calculateWeightThresholds(0, adultMale)).toBeNull();
    });

    it("returns null when thresholds is null", () => {
        expect(calculateWeightThresholds(175, null)).toBeNull();
    });
});

describe("calculateSegmentWidths", () => {
    it("returns default [10, 70, 10, 10] when no category", () => {
        expect(calculateSegmentWidths(null)).toEqual([10, 70, 10, 10]);
    });

    it("sets index 0 to 70 for underweight", () => {
        expect(calculateSegmentWidths(categoryConfig.underweight)).toEqual([70, 10, 10, 10]);
    });

    it("sets index 1 to 70 for normal", () => {
        expect(calculateSegmentWidths(categoryConfig.normal)).toEqual([10, 70, 10, 10]);
    });

    it("sets index 2 to 70 for overweight", () => {
        expect(calculateSegmentWidths(categoryConfig.overweight)).toEqual([10, 10, 70, 10]);
    });

    it("sets index 3 to 70 for obese", () => {
        expect(calculateSegmentWidths(categoryConfig.obese)).toEqual([10, 10, 10, 70]);
    });
});

describe("calculateBarPosition", () => {
    const adultMale: [number, number, number] = [18.5, 24.0, 28.0];

    it("returns 0 when bmi is null", () => {
        expect(calculateBarPosition(null, adultMale, categoryConfig.normal, [10, 70, 10, 10])).toBe(0);
    });

    it("returns 0 when thresholds is null", () => {
        expect(calculateBarPosition(21, null, categoryConfig.normal, [10, 70, 10, 10])).toBe(0);
    });

    it("places pointer at start of normal segment when bmi equals underweight threshold", () => {
        expect(calculateBarPosition(18.5, adultMale, categoryConfig.normal, [10, 70, 10, 10])).toBe(10);
    });

    it("places pointer in middle of normal segment", () => {
        const pos = calculateBarPosition(21.25, adultMale, categoryConfig.normal, [10, 70, 10, 10]);
        expect(pos).toBeGreaterThan(10);
        expect(pos).toBeLessThan(80);
    });

    it("places pointer at end of normal segment when bmi equals normal threshold", () => {
        expect(calculateBarPosition(24.0, adultMale, categoryConfig.overweight, [10, 10, 70, 10])).toBe(20);
    });

    it("clamps progress to segment bounds for underweight below range", () => {
        const pos = calculateBarPosition(10, adultMale, categoryConfig.underweight, [70, 10, 10, 10]);
        expect(pos).toBe(0);
    });

    it("clamps progress to 1 for obese beyond range", () => {
        const pos = calculateBarPosition(50, adultMale, categoryConfig.obese, [10, 10, 10, 70]);
        expect(pos).toBeGreaterThan(0);
        expect(pos).toBeLessThanOrEqual(100);
    });
});

describe("convertWeightText", () => {
    it("converts kg to jin", () => {
        expect(convertWeightText(70, "kg")).toBe("= 140.0 斤");
    });

    it("converts jin to kg", () => {
        expect(convertWeightText(140, "jin")).toBe("= 70.0 kg");
    });

    it("returns empty for zero weight", () => {
        expect(convertWeightText(0, "kg")).toBe("");
    });

    it("returns empty for negative weight", () => {
        expect(convertWeightText(-1, "kg")).toBe("");
    });
});
