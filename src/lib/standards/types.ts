export type Gender = "male" | "female";
export type BmiCategory = "student" | "adult" | "senior";

export interface BmiLevel {
  id: string;
  nameKey: string;
  color: string;
  lightColor: string;
  textColor: string;
  borderColor: string;
}

export interface ClassificationInput {
  bmi: number;
  gender?: Gender;
  age?: number;
  grade?: string;
}

export interface ClassificationResult {
  level: BmiLevel;
  index: number;
}

export interface BmiStandard {
  id: string;
  nameKey: string;
  descriptionKey: string;
  category: BmiCategory;
  requiredFields: Array<"gender" | "age" | "grade">;
  localeOrder: Record<string, number>;
  levels: BmiLevel[];

  classify(input: ClassificationInput): ClassificationResult | null;
  weightThresholds(
    height: number,
    input: ClassificationInput
  ): Record<string, string> | null;

  levelBmiBounds(
    levelIdx: number,
    input: ClassificationInput
  ): { min: number; max: number } | null;
}
