import type { BmiStandard, BmiLevel, ClassificationInput, ClassificationResult } from "./types";

const levels: BmiLevel[] = [
  {
    id: "underweight",
    nameKey: "level_underweight",
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
    textColor: "text-blue-600",
    borderColor: "border-blue-500",
  },
  {
    id: "normal",
    nameKey: "level_normal",
    color: "bg-green-500",
    lightColor: "bg-green-100",
    textColor: "text-green-600",
    borderColor: "border-green-500",
  },
  {
    id: "overweight-obese",
    nameKey: "level_overweight_obese",
    color: "bg-red-500",
    lightColor: "bg-red-100",
    textColor: "text-red-600",
    borderColor: "border-red-500",
  },
];

const cutoffs = [22, 27];

function classifyBMI(bmi: number): number {
  if (bmi < cutoffs[0]) return 0;
  if (bmi < cutoffs[1]) return 1;
  return 2;
}

export const chinaElderlyStandard: BmiStandard = {
  id: "china-elderly",
  nameKey: "standard_china_elderly",
  descriptionKey: "standard_china_elderly",
  category: "senior",
  requiredFields: [],
  localeOrder: { zh: 2, en: 5 },
  levels,

  classify(input: ClassificationInput): ClassificationResult | null {
    if (!input.bmi || input.bmi <= 0) return null;
    const idx = classifyBMI(input.bmi);
    return { level: levels[idx], index: idx };
  },

  weightThresholds(height: number, _input: ClassificationInput): Record<string, string> | null {
    if (!height || height <= 0) return null;
    const heightM = height / 100;
    const h2 = heightM * heightM;
    return {
      underweightMax: (cutoffs[0] * h2).toFixed(1),
      normalMax: (cutoffs[1] * h2).toFixed(1),
      overweightMax: "",
    };
  },

  levelBmiBounds(levelIdx: number, _input: ClassificationInput): { min: number; max: number } | null {
    if (levelIdx < 0 || levelIdx >= levels.length) return null;
    const min = levelIdx === 0 ? 10 : cutoffs[levelIdx - 1];
    const max = levelIdx === levels.length - 1 ? 50 : cutoffs[levelIdx];
    return { min, max };
  },
};
