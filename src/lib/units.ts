export interface WeightUnit {
  id: string;
  labelKey: string;
  toKg: (v: number) => number;
  fromKg: (v: number) => number;
}

const kg: WeightUnit = {
  id: "kg",
  labelKey: "unit_kg",
  toKg: (v) => v,
  fromKg: (v) => v,
};

const jin: WeightUnit = {
  id: "jin",
  labelKey: "unit_jin",
  toKg: (v) => v / 2,
  fromKg: (v) => v * 2,
};

const lb: WeightUnit = {
  id: "lb",
  labelKey: "unit_lb",
  toKg: (v) => v / 2.20462,
  fromKg: (v) => v * 2.20462,
};

export function getWeightUnits(
  locale = "zh-CN"
): [WeightUnit, WeightUnit] {
  return locale?.startsWith("zh") ? [kg, jin] : [kg, lb];
}

export function convertWeightText(
  weight: number,
  from: WeightUnit,
  to: WeightUnit
): string {
  if (!weight || weight <= 0) return "";
  const kgVal = from.toKg(weight);
  const converted = to.fromKg(kgVal);
  const toLabel =
    to.id === "jin"
      ? "\u65a4"
      : to.id === "lb"
        ? "lb"
        : "kg";
  return `= ${converted.toFixed(1)} ${toLabel}`;
}
