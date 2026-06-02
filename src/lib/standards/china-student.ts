import type { BmiStandard, BmiLevel, ClassificationInput, ClassificationResult, Gender } from "./types";

type Thresholds = [number, number, number];
type GenderThresholds = [Thresholds, Thresholds];

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

export interface StageGroup {
  labelKey: string;
  stages: StudentGrade[];
}

export interface StudentGrade {
  id: string;
  nameKey: string;
}

export const studentGrades: StudentGrade[] = [
  { id: "grade-1", nameKey: "stage_grade1" },
  { id: "grade-2", nameKey: "stage_grade2" },
  { id: "grade-3", nameKey: "stage_grade3" },
  { id: "grade-4", nameKey: "stage_grade4" },
  { id: "grade-5", nameKey: "stage_grade5" },
  { id: "grade-6", nameKey: "stage_grade6" },
  { id: "grade-7", nameKey: "stage_grade7" },
  { id: "grade-8", nameKey: "stage_grade8" },
  { id: "grade-9", nameKey: "stage_grade9" },
  { id: "grade-10", nameKey: "stage_grade10" },
  { id: "grade-11", nameKey: "stage_grade11" },
  { id: "grade-12", nameKey: "stage_grade12" },
  { id: "college", nameKey: "stage_college" },
];

export const stageGroups: StageGroup[] = [
  {
    labelKey: "stage_primary",
    stages: studentGrades.slice(0, 6),
  },
  {
    labelKey: "stage_junior",
    stages: studentGrades.slice(6, 9),
  },
  {
    labelKey: "stage_senior",
    stages: studentGrades.slice(9, 12),
  },
  {
    labelKey: "stage_other",
    stages: studentGrades.slice(12),
  },
];

const bmiThresholds = new Map<string, GenderThresholds>([
  ["grade-1", [[13.5, 18.2, 20.4], [13.3, 17.4, 19.3]]],
  ["grade-2", [[13.7, 18.5, 20.5], [13.5, 17.9, 20.3]]],
  ["grade-3", [[13.9, 19.5, 22.2], [13.6, 18.7, 21.2]]],
  ["grade-4", [[14.2, 20.2, 22.7], [13.7, 19.5, 22.1]]],
  ["grade-5", [[14.4, 21.5, 22.8], [13.8, 20.6, 23.0]]],
  ["grade-6", [[14.7, 21.9, 24.3], [14.2, 20.9, 23.7]]],
  ["grade-7", [[15.5, 22.2, 24.6], [14.8, 21.8, 24.5]]],
  ["grade-8", [[15.7, 22.6, 25.0], [15.3, 22.3, 24.9]]],
  ["grade-9", [[15.8, 22.9, 25.3], [16.0, 22.7, 25.2]]],
  ["grade-10", [[16.5, 23.3, 26.1], [16.5, 22.8, 25.3]]],
  ["grade-11", [[16.8, 23.8, 26.4], [16.9, 23.3, 25.5]]],
  ["grade-12", [[17.3, 23.9, 26.6], [17.1, 23.4, 25.8]]],
  ["college", [[17.9, 24.0, 27.4], [17.2, 24.0, 28.0]]],
]);

function getThresholds(grade: string, gender: Gender): Thresholds | null {
  const entry = bmiThresholds.get(grade);
  if (!entry) return null;
  return gender === "male" ? entry[0] : entry[1];
}

function classifyBMI(bmi: number, grade: string, gender: Gender): number {
  const thresholds = getThresholds(grade, gender);
  if (!thresholds) return 1;
  const [under, normal, over] = thresholds;
  if (bmi < under) return 0;
  if (bmi < normal) return 1;
  if (bmi < over) return 2;
  return 3;
}

export const chinaStudentStandard: BmiStandard = {
  id: "china-student",
  nameKey: "standard_china_student",
  descriptionKey: "standard_china_student",
  category: "student",
  requiredFields: ["gender", "grade"],
  localeOrder: { zh: 1, en: 4 },
  levels,

  classify(input: ClassificationInput): ClassificationResult | null {
    if (!input.bmi || input.bmi <= 0 || !input.grade || !input.gender) return null;
    const idx = classifyBMI(input.bmi, input.grade, input.gender);
    return { level: levels[idx], index: idx };
  },

  weightThresholds(height: number, input: ClassificationInput): Record<string, string> | null {
    if (!height || height <= 0 || !input.grade || !input.gender) return null;
    const thresholds = getThresholds(input.grade, input.gender);
    if (!thresholds) return null;
    const heightM = height / 100;
    const h2 = heightM * heightM;
    const [under, normal, over] = thresholds;
    return {
      underweightMax: (under * h2).toFixed(1),
      normalMax: (normal * h2).toFixed(1),
      overweightMax: (over * h2).toFixed(1),
    };
  },

  levelBmiBounds(levelIdx: number, input: ClassificationInput): { min: number; max: number } | null {
    if (levelIdx < 0 || levelIdx >= levels.length || !input.grade || !input.gender) return null;
    const thresholds = getThresholds(input.grade, input.gender);
    if (!thresholds) return null;
    const [under, normal, over] = thresholds;
    const bounds = [
      { min: 5, max: under },
      { min: under, max: normal },
      { min: normal, max: over },
      { min: over, max: 50 },
    ];
    return bounds[levelIdx] ?? null;
  },
};
