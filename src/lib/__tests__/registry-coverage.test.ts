import { describe, it, expect } from "vitest";
import { getDefaultStandardIdForCategory, getCategories } from "../standards/registry";
import { calculateBarPosition } from "../bmi";

describe("Registry uncovered branches", () => {
  describe("getDefaultStandardIdForCategory", () => {
    it("returns china-student for zh student", () => {
      expect(getDefaultStandardIdForCategory("student", "zh")).toBe("china-student");
    });

    it("returns china-adult for zh adult", () => {
      expect(getDefaultStandardIdForCategory("adult", "zh")).toBe("china-adult");
    });

    it("returns china-elderly for zh senior", () => {
      expect(getDefaultStandardIdForCategory("senior", "zh")).toBe("china-elderly");
    });

    it("returns who-child for en student", () => {
      expect(getDefaultStandardIdForCategory("student", "en")).toBe("who-child");
    });

    it("returns who-adult for en adult", () => {
      expect(getDefaultStandardIdForCategory("adult", "en")).toBe("who-adult");
    });

    it("returns china-elderly for en senior", () => {
      expect(getDefaultStandardIdForCategory("senior", "en")).toBe("china-elderly");
    });
  });

  describe("calculateBarPosition edge case", () => {
    it("returns 0.5 of segment when range is zero", () => {
      const pos = calculateBarPosition(20, { min: 20, max: 20 }, [50, 50], 1);
      expect(pos).toBe(75);
    });
  });

  describe("getCategories", () => {
    it("returns student, adult, senior", () => {
      expect(getCategories()).toEqual(["student", "adult", "senior"]);
    });
  });
});
