import { describe, it, expect } from "vitest";
import { getDefaultStandardIdForCategory, getCategories, getOrderedStandards, getStandardsByCategory } from "../standards/registry";

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

  describe("getCategories", () => {
    it("returns student, adult, senior", () => {
      expect(getCategories()).toEqual(["student", "adult", "senior"]);
    });
  });

  describe("getOrderedStandards", () => {
    it("uses fallback for unknown locale", () => {
      const result = getOrderedStandards("unknown");
      expect(result.length).toBe(5);
    });
  });

  describe("getStandardsByCategory", () => {
    it("uses fallback for unknown locale", () => {
      const result = getStandardsByCategory("adult", "unknown");
      expect(result.length).toBe(2);
    });
  });
});
