import type { BmiLevel } from "$lib/standards/types";

export const COLOR_HEX: Record<string, string> = {
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "amber-500": "#f59e0b",
  "amber-600": "#d97706",
  "orange-500": "#f97316",
  "orange-600": "#ea580c",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "red-700": "#b91c1c",
  "red-800": "#991b1b",
  "indigo-500": "#6366f1",
};

export const COLOR_HEX_DARK: Record<string, string> = {
  "blue-500": "#60a5fa",
  "blue-600": "#3b82f6",
  "green-500": "#4ade80",
  "green-600": "#22c55e",
  "amber-500": "#fbbf24",
  "amber-600": "#f59e0b",
  "orange-500": "#fb923c",
  "orange-600": "#f97316",
  "red-500": "#f87171",
  "red-600": "#ef4444",
  "red-700": "#dc2626",
  "red-800": "#b91c1b",
  "indigo-500": "#818cf8",
};

export const TEXT_HEX: Record<string, string> = {
  "blue": "#2563eb",
  "green": "#16a34a",
  "amber": "#d97706",
  "orange": "#ea580c",
  "red": "#dc2626",
  "indigo": "#4f46e5",
};

export const TEXT_HEX_DARK: Record<string, string> = {
  "blue": "#60a5fa",
  "green": "#4ade80",
  "amber": "#fbbf24",
  "orange": "#fb923c",
  "red": "#f87171",
  "indigo": "#818cf8",
};

export function hexColor(bgClass: string, isDark = false): string {
  const key = bgClass.replace("bg-", "");
  if (isDark) return COLOR_HEX_DARK[key] ?? COLOR_HEX[key] ?? "#64748b";
  return COLOR_HEX[key] ?? "#64748b";
}

export function textHexColor(bgClass: string, isDark = false): string {
  const name = bgClass.replace("bg-", "");
  const base = name.split("-")[0];
  if (isDark) return TEXT_HEX_DARK[base] ?? TEXT_HEX[base] ?? "#475569";
  return TEXT_HEX[base] ?? "#475569";
}

export function averageHex(a: string, b: string): string {
  const r1 = parseInt(a.slice(1, 3), 16);
  const g1 = parseInt(a.slice(3, 5), 16);
  const b1 = parseInt(a.slice(5, 7), 16);
  const r2 = parseInt(b.slice(1, 3), 16);
  const g2 = parseInt(b.slice(3, 5), 16);
  const b2 = parseInt(b.slice(5, 7), 16);
  const r = Math.round((r1 + r2) / 2);
  const g = Math.round((g1 + g2) / 2);
  const bl = Math.round((b1 + b2) / 2);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

export interface SegmentData {
  index: number;
  level: BmiLevel;
  startAngle: number;
  endAngle: number;
  midAngle: number;
}

export interface TickData {
  angle: number;
  label: string;
  color: string;
}

export interface GaugeData {
  segments: SegmentData[];
  ticks: TickData[];
  needleAngle: number | null;
  visualMin: number;
  visualMax: number;
}

export function computeGaugeData(
  levels: BmiLevel[],
  levelBounds: ({ min: number; max: number } | null)[],
  bmi: number | null,
  currentIndex: number,
  zoomedIn: boolean,
  isDark = false
): GaugeData {
  const N = levels.length;
  const validBounds = levelBounds.filter((b) => b !== null) as {
    min: number;
    max: number;
  }[];

  if (validBounds.length === 0 || bmi === null || bmi <= 0) {
    return { segments: [], ticks: [], needleAngle: null, visualMin: 0, visualMax: 0 };
  }

  let startIdx: number;
  let endIdx: number;
  let visualMin: number;
  let visualMax: number;

  if (zoomedIn) {
    startIdx = Math.max(0, currentIndex - 1);
    endIdx = Math.min(N - 1, currentIndex + 1);
    if (endIdx - startIdx < 2 && N >= 3) {
      if (startIdx === 0) endIdx = Math.min(2, N - 1);
      else if (endIdx === N - 1) startIdx = Math.max(0, N - 3);
    }

    if (startIdx === 0 && N >= 2) {
      const firstBoundary = validBounds[1].min;
      let step: number;
      if (N >= 3) {
        step = Math.round((validBounds[2].min - firstBoundary) * 10) / 10;
      } else {
        step = Math.round((validBounds[0].max - validBounds[0].min) * 10) / 10;
      }
      visualMin = Math.max(0, Math.round((firstBoundary - step / 2) * 10) / 10);
    } else {
      visualMin = validBounds[startIdx].min;
    }

    if (endIdx === N - 1 && N >= 2) {
      const lastStep = Math.round((validBounds[N - 1].min - validBounds[N - 2].min) * 10) / 10;
      visualMax = Math.round((validBounds[N - 1].min + lastStep) * 10) / 10;
    } else {
      visualMax = validBounds[endIdx].max;
    }
  } else {
    startIdx = 0;
    endIdx = N - 1;
    if (N >= 2) {
      const firstBoundary = validBounds[1].min;
      let step: number;
      if (N >= 3) {
        step = Math.round((validBounds[2].min - firstBoundary) * 10) / 10;
      } else {
        step = Math.round((validBounds[0].max - validBounds[0].min) * 10) / 10;
      }
      visualMin = Math.max(0, Math.round((firstBoundary - step / 2) * 10) / 10);
    } else {
      visualMin = validBounds[0].min;
    }
    if (N >= 2) {
      const lastStep = Math.round((validBounds[N - 1].min - validBounds[N - 2].min) * 10) / 10;
      visualMax = Math.round((validBounds[N - 1].min + lastStep) * 10) / 10;
    } else {
      visualMax = Math.round((validBounds[0].min + 5) * 10) / 10;
    }
  }

  const totalRange = visualMax - visualMin;
  if (totalRange <= 0) {
    return { segments: [], ticks: [], needleAngle: null, visualMin, visualMax };
  }

  function angle(bmiVal: number): number {
    return Math.PI * (visualMax - bmiVal) / totalRange;
  }

  const segments: SegmentData[] = [];
  for (let i = startIdx; i <= endIdx; i++) {
    const b = validBounds[i];
    if (!b) continue;
    const segMin = i === startIdx ? visualMin : b.min;
    const segMax = i === endIdx ? visualMax : b.max;
    const a1 = angle(segMin);
    const a2 = angle(segMax);
    segments.push({
      index: i,
      level: levels[i],
      startAngle: a1,
      endAngle: a2,
      midAngle: (a1 + a2) / 2,
    });
  }

  const clamped = Math.max(visualMin, Math.min(visualMax, bmi));
  const needleAngle = angle(clamped);

  const ticks: TickData[] = [];

  const innerBmiVals: number[] = [];
  for (let i = startIdx + 1; i <= endIdx; i++) {
    const b = validBounds[i];
    if (b) innerBmiVals.push(b.min);
  }

  let visualMinLabel: number;
  let visualMaxLabel: number;
  if (innerBmiVals.length >= 2) {
    const stepStart = Math.round((innerBmiVals[1] - innerBmiVals[0]) * 10) / 10;
    visualMinLabel = Math.max(0, Math.round((innerBmiVals[0] - stepStart / 2) * 10) / 10);
    const stepEnd = Math.round((innerBmiVals[innerBmiVals.length - 1] - innerBmiVals[innerBmiVals.length - 2]) * 10) / 10;
    visualMaxLabel = Math.round((innerBmiVals[innerBmiVals.length - 1] + stepEnd) * 10) / 10;
  } else {
    visualMinLabel = visualMin;
    visualMaxLabel = visualMax;
  }

  ticks.push({
    angle: angle(visualMin),
    label: visualMinLabel.toFixed(1),
    color: hexColor(levels[startIdx].color, isDark),
  });

  for (let i = startIdx + 1; i <= endIdx; i++) {
    const b = validBounds[i];
    if (!b) continue;
    const leftHex = hexColor(levels[i - 1].color, isDark);
    const rightHex = hexColor(levels[i].color, isDark);
    ticks.push({
      angle: angle(b.min),
      label: b.min.toFixed(1),
      color: averageHex(leftHex, rightHex),
    });
  }

  ticks.push({
    angle: angle(visualMax),
    label: visualMaxLabel.toFixed(1),
    color: hexColor(levels[endIdx].color, isDark),
  });

  return { segments, ticks, needleAngle, visualMin, visualMax };
}

export const CX = 180;
export const CY = 200;
export const R = 160;
export const TICK_INNER = 144;
export const TICK_OUTER = 156;
export const LABEL_R = 118;
export const BMI_LABEL_R = 132;
export const NEEDLE_TIP_R = TICK_INNER - 4;

export function arcPath(startAngle: number, endAngle: number): string {
  const x1 = CX + R * Math.cos(startAngle);
  const y1 = CY - R * Math.sin(startAngle);
  const x2 = CX + R * Math.cos(endAngle);
  const y2 = CY - R * Math.sin(endAngle);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export function tickLine(angle: number): string {
  const x1 = CX + TICK_INNER * Math.cos(angle);
  const y1 = CY - TICK_INNER * Math.sin(angle);
  const x2 = CX + TICK_OUTER * Math.cos(angle);
  const y2 = CY - TICK_OUTER * Math.sin(angle);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export function labelPos(angle: number, r: number): { x: number; y: number } {
  return {
    x: CX + r * Math.cos(angle),
    y: CY - r * Math.sin(angle),
  };
}
