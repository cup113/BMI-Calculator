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
    id: "pre-obesity",
    nameKey: "level_pre_obesity",
    color: "bg-amber-500",
    lightColor: "bg-amber-100",
    textColor: "text-amber-600",
    borderColor: "border-amber-500",
  },
  {
    id: "obese-class1",
    nameKey: "level_obese_class1",
    color: "bg-orange-500",
    lightColor: "bg-orange-100",
    textColor: "text-orange-600",
    borderColor: "border-orange-500",
  },
  {
    id: "obese-class2",
    nameKey: "level_obese_class2",
    color: "bg-red-500",
    lightColor: "bg-red-100",
    textColor: "text-red-600",
    borderColor: "border-red-500",
  },
  {
    id: "obese-class3",
    nameKey: "level_obese_class3",
    color: "bg-red-700",
    lightColor: "bg-red-200",
    textColor: "text-red-800",
    borderColor: "border-red-700",
  },
];

const cutoffs = [18.5, 25, 30, 35, 40];

function classifyBMI(bmi: number): number {
  if (bmi < cutoffs[0]) return 0;
  if (bmi < cutoffs[1]) return 1;
  if (bmi < cutoffs[2]) return 2;
  if (bmi < cutoffs[3]) return 3;
  if (bmi < cutoffs[4]) return 4;
  return 5;
}

export const whoAdultStandard: BmiStandard = {
  id: "who-adult",
  nameKey: "standard_who_adult",
  descriptionKey: "standard_who_adult",
  category: "adult",
  requiredFields: [],
  localeOrder: { zh: 3, en: 0 },
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
      overweightMax: (cutoffs[3] * h2).toFixed(1),
    };
  },

  levelBmiBounds(levelIdx: number, _input: ClassificationInput): { min: number; max: number } | null {
    if (levelIdx < 0 || levelIdx >= levels.length) return null;
    const min = levelIdx === 0 ? 10 : cutoffs[levelIdx - 1];
    const max = levelIdx === levels.length - 1 ? 60 : cutoffs[levelIdx];
    return { min, max };
  },
};
