export function calculateBMI(
  weightKg: number,
  heightCm: number
): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

export function calculateSegmentWidths(
  currentIndex: number,
  totalLevels: number
): number[] {
  const widths = new Array(totalLevels).fill(0);
  if (totalLevels <= 1) {
    widths[0] = 100;
    return widths;
  }
  const other = 30 / (totalLevels - 1);
  for (let i = 0; i < totalLevels; i++) {
    widths[i] = i === currentIndex ? 70 : other;
  }
  return widths;
}

export function calculateBarPosition(
  bmi: number,
  levelBounds: { min: number; max: number },
  segmentWidths: number[],
  levelIndex: number
): number {
  if (!bmi || bmi <= 0) return 0;
  const range = levelBounds.max - levelBounds.min;
  const progress =
    range > 0
      ? Math.min(Math.max((bmi - levelBounds.min) / range, 0), 1)
      : 0.5;
  let pos = 0;
  for (let i = 0; i < levelIndex; i++) {
    pos += segmentWidths[i];
  }
  return pos + progress * segmentWidths[levelIndex];
}
