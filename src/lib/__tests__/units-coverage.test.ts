import { describe, it, expect } from "vitest";
import { convertWeightText, getWeightUnits } from "../units";

describe("units uncovered branches", () => {
  const [kg, jin] = getWeightUnits("zh");
  const [kgEn, lb] = getWeightUnits("en");

  it("converts lb to kg", () => {
    expect(convertWeightText(154.3, lb, kgEn)).toBe("= 70.0 kg");
  });

  it("converts jin to lb", () => {
    expect(convertWeightText(100, jin, lb)).toBe("= 110.2 lb");
  });
});
