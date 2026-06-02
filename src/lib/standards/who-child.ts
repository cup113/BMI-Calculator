import { WhoGirlsThreshold, WhoBoysThreshold } from "$lib/who-data";
import type { BmiStandard, BmiLevel, ClassificationInput, ClassificationResult } from "./types";

interface WhoRow {
  ageYears: number;
  ageMonths: number;
  neg3SD: number;
  neg2SD: number;
  pos1SD: number;
  pos2SD: number;
}

function parseTable(data: string): WhoRow[] {
  return data
    .trim()
    .split("\n")
    .map((line) => {
      const cols = line.split("\t").map(Number);
      return {
        ageYears: cols[0],
        ageMonths: cols[1],
        neg3SD: cols[2],
        neg2SD: cols[3],
        pos1SD: cols[4],
        pos2SD: cols[5],
      };
    });
}

const girlsData = parseTable(WhoGirlsThreshold);
const boysData = parseTable(WhoBoysThreshold);

function findRow(age: number, isMale: boolean): WhoRow | null {
  const data = isMale ? boysData : girlsData;
  const ageMonths = Math.round(age * 12);
  let closest = data[0];
  let minDiff = Math.abs(closest.ageMonths - ageMonths);
  for (const row of data) {
    const diff = Math.abs(row.ageMonths - ageMonths);
    if (diff < minDiff) {
      minDiff = diff;
      closest = row;
    }
  }
  return closest;
}

const levels: BmiLevel[] = [
  {
    id: "severe-thinness",
    nameKey: "level_severe_thinness",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-100",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-500",
  },
  {
    id: "thinness",
    nameKey: "level_thinness",
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
    id: "overweight",
    nameKey: "level_overweight",
    color: "bg-amber-500",
    lightColor: "bg-amber-100",
    textColor: "text-amber-600",
    borderColor: "border-amber-500",
  },
  {
    id: "obese",
    nameKey: "level_obese",
    color: "bg-red-500",
    lightColor: "bg-red-100",
    textColor: "text-red-600",
    borderColor: "border-red-500",
  },
];

function classifyByRow(bmi: number, row: WhoRow): number {
  if (bmi < row.neg3SD) return 0;
  if (bmi < row.neg2SD) return 1;
  if (bmi < row.pos1SD) return 2;
  if (bmi < row.pos2SD) return 3;
  return 4;
}

export const whoChildStandard: BmiStandard = {
  id: "who-child",
  nameKey: "standard_who_child",
  descriptionKey: "standard_who_child",
  category: "student",
  requiredFields: ["gender", "age"],
  localeOrder: { zh: 4, en: 2 },
  levels,

  classify(input: ClassificationInput): ClassificationResult | null {
    if (!input.bmi || input.bmi <= 0 || input.age === undefined || !input.gender) return null;
    const isMale = input.gender === "male";
    const row = findRow(input.age, isMale);
    if (!row) return null;
    const idx = classifyByRow(input.bmi, row);
    return { level: levels[idx], index: idx };
  },

  weightThresholds(height: number, input: ClassificationInput): Record<string, string> | null {
    if (!height || height <= 0 || input.age === undefined || !input.gender) return null;
    const isMale = input.gender === "male";
    const row = findRow(input.age, isMale);
    if (!row) return null;
    const heightM = height / 100;
    const h2 = heightM * heightM;
    return {
      underweightMax: (row.neg2SD * h2).toFixed(1),
      normalMax: (row.pos1SD * h2).toFixed(1),
      overweightMax: (row.pos2SD * h2).toFixed(1),
    };
  },

  levelBmiBounds(levelIdx: number, input: ClassificationInput): { min: number; max: number } | null {
    if (levelIdx < 0 || levelIdx >= levels.length || input.age === undefined || !input.gender) return null;
    const isMale = input.gender === "male";
    const row = findRow(input.age, isMale);
    if (!row) return null;
    const bounds = [
      { min: 5, max: row.neg3SD },
      { min: row.neg3SD, max: row.neg2SD },
      { min: row.neg2SD, max: row.pos1SD },
      { min: row.pos1SD, max: row.pos2SD },
      { min: row.pos2SD, max: 60 },
    ];
    return bounds[levelIdx] ?? null;
  },
};
