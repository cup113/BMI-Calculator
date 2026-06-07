import type { BmiStandard, ClassificationInput } from "$lib/standards/types";
import type { WeightUnit } from "$lib/units";
import { t } from "$lib/i18n/t";

export interface HealthyWeightRange {
  min: number;
  max: number;
  unitLabel: string;
}

export function computeHealthyWeightRange(
  heightCm: number,
  standard: BmiStandard,
  input: ClassificationInput,
  unit: WeightUnit
): HealthyWeightRange | null {
  if (!heightCm || heightCm <= 0) return null;

  const normalIndex = standard.levels.findIndex((l) => l.id === "normal");
  if (normalIndex < 0) return null;

  const bounds = standard.levelBmiBounds(normalIndex, input);
  if (!bounds) return null;

  const hM = heightCm / 100;
  const h2 = hM * hM;

  return {
    min: unit.fromKg(bounds.min * h2),
    max: unit.fromKg(bounds.max * h2),
    unitLabel: t(unit.labelKey),
  };
}
