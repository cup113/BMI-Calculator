export type Gender = "male" | "female";

export type { BmiLevel, ClassificationInput, ClassificationResult, BmiStandard } from "./standards/types";
export { getWeightUnits, convertWeightText } from "./units";
export type { WeightUnit } from "./units";
export { getStandard, getAllStandards, getOrderedStandards, getDefaultStandardId, getStandardsByCategory, getCategories } from "./standards/registry";
export { calculateBMI, calculateSegmentWidths, calculateBarPosition } from "./bmi";
export { chinaStudentStandard, studentGrades, stageGroups } from "./standards/china-student";
export type { StudentGrade, StageGroup } from "./standards/china-student";
