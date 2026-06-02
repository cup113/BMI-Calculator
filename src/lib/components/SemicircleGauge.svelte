<script lang="ts">
  import type { BmiLevel } from "$lib/standards/types";

  interface Props {
    levels: BmiLevel[];
    levelBounds: ({ min: number; max: number } | null)[];
    levelLabels: string[];
    bmi: number | null;
    currentIndex: number;
    zoomedIn: boolean;
    zoomInLabel: string;
    zoomOutLabel: string;
    ontogglezoom?: () => void;
  }

  let {
    levels,
    levelBounds,
    levelLabels,
    bmi,
    currentIndex,
    zoomedIn,
    zoomInLabel,
    zoomOutLabel,
    ontogglezoom,
  }: Props = $props();

  const COLOR_HEX: Record<string, string> = {
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

  const TEXT_HEX: Record<string, string> = {
    "blue": "#2563eb",
    "green": "#16a34a",
    "amber": "#d97706",
    "orange": "#ea580c",
    "red": "#dc2626",
    "indigo": "#4f46e5",
  };

  function hexColor(bgClass: string): string {
    return COLOR_HEX[bgClass.replace("bg-", "")] ?? "#64748b";
  }

  function textHexColor(bgClass: string): string {
    const name = bgClass.replace("bg-", "");
    const base = name.split("-")[0];
    return TEXT_HEX[base] ?? "#475569";
  }

  function averageHex(a: string, b: string): string {
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

  const CX = 180;
  const CY = 200;
  const R = 160;
  const TICK_INNER = 144;
  const TICK_OUTER = 156;
  const LABEL_R = 118;
  const BMI_LABEL_R = 132;
  const NEEDLE_TIP_R = TICK_INNER - 4;

  interface SegmentData {
    index: number;
    level: BmiLevel;
    startAngle: number;
    endAngle: number;
    midAngle: number;
  }

  interface TickData {
    angle: number;
    label: string;
    color: string;
  }

  let gaugeData = $derived.by<{
    segments: SegmentData[];
    ticks: TickData[];
    needleAngle: number | null;
    visualMin: number;
    visualMax: number;
  }>(() => {
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

    // Collect inner boundary BMI values for extrapolation at edges
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

    // First tick (start anchor)
    ticks.push({
      angle: angle(visualMin),
      label: visualMinLabel.toFixed(1),
      color: hexColor(levels[startIdx].color),
    });

    // Inner ticks (at each level boundary)
    for (let i = startIdx + 1; i <= endIdx; i++) {
      const b = validBounds[i];
      if (!b) continue;
      const leftHex = hexColor(levels[i - 1].color);
      const rightHex = hexColor(levels[i].color);
      ticks.push({
        angle: angle(b.min),
        label: b.min.toFixed(1),
        color: averageHex(leftHex, rightHex),
      });
    }

    // Last tick (end anchor)
    ticks.push({
      angle: angle(visualMax),
      label: visualMaxLabel.toFixed(1),
      color: hexColor(levels[endIdx].color),
    });

    return { segments, ticks, needleAngle, visualMin, visualMax };
  });

  function arcPath(startAngle: number, endAngle: number): string {
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY - R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY - R * Math.sin(endAngle);
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }

  function tickLine(angle: number): string {
    const x1 = CX + TICK_INNER * Math.cos(angle);
    const y1 = CY - TICK_INNER * Math.sin(angle);
    const x2 = CX + TICK_OUTER * Math.cos(angle);
    const y2 = CY - TICK_OUTER * Math.sin(angle);
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }

  function labelPos(angle: number, r: number): { x: number; y: number } {
    return {
      x: CX + r * Math.cos(angle),
      y: CY - r * Math.sin(angle),
    };
  }

  let bgArcPath = $derived(arcPath(Math.PI, 0));
  let animNeedleAngle = $state<number>(Math.PI);

  $effect(() => {
    const angle = gaugeData.needleAngle;
    if (angle === null) return;
    const id = requestAnimationFrame(() => {
      animNeedleAngle = angle;
    });
    return () => cancelAnimationFrame(id);
  });

  let labelFontSize = $derived(gaugeData.segments.length > 4 ? "9" : "11");
</script>

<div class="relative select-none">
  <svg viewBox="0 0 360 255" class="w-full">
    <!-- Background track arc -->
    <path
      d={bgArcPath}
      fill="none"
      stroke="#e2e8f0"
      stroke-width="14"
      stroke-linecap="round"
    />

    <!-- Colored level segments -->
    {#each gaugeData.segments as seg}
      <path
        d={arcPath(seg.startAngle, seg.endAngle)}
        fill="none"
        stroke={hexColor(seg.level.color)}
        stroke-width="14"
        stroke-linecap="butt"
      />
    {/each}

    <!-- Tick marks -->
    {#each gaugeData.ticks as tick}
      <path
        d={tickLine(tick.angle)}
        fill="none"
        stroke={tick.color}
        stroke-width="1.5"
        opacity="0.6"
      />
      {@const pos = labelPos(tick.angle, BMI_LABEL_R)}
      <text
        x={pos.x.toFixed(2)}
        y={(pos.y + 4).toFixed(2)}
        text-anchor="middle"
        fill={tick.color}
        font-size="10"
        font-weight="600"
      >
        {tick.label}
      </text>
    {/each}

    <!-- Level name labels -->
    {#each gaugeData.segments as seg}
      {@const lpos = labelPos(seg.midAngle, LABEL_R)}
      <text
        x={lpos.x.toFixed(2)}
        y={(lpos.y + 4).toFixed(2)}
        text-anchor="middle"
        font-size={labelFontSize}
        font-weight="600"
        fill={textHexColor(seg.level.color)}
        opacity={zoomedIn ? "1" : "0.55"}
      >
        {levelLabels[seg.index] ?? ""}
      </text>
    {/each}

    <!-- Needle -->
    {#if gaugeData.needleAngle !== null}
      <g
        transform="rotate({(-animNeedleAngle * 180 / Math.PI).toFixed(2)}, {CX}, {CY})"
        style="transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      >
        <line
          x1={CX}
          y1={CY}
          x2={CX + NEEDLE_TIP_R}
          y2={CY}
          stroke="#1e293b"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <circle
          cx={CX + NEEDLE_TIP_R + 3}
          cy={CY}
          r="4.5"
          fill="#1e293b"
        />
      </g>
      <!-- Pivot -->
      <circle cx={CX} cy={CY} r="7" fill="#1e293b" />
      <circle cx={CX} cy={CY} r="3.5" fill="#ffffff" />
    {/if}
  </svg>

  <!-- Zoom toggle button -->
  <button
    onclick={ontogglezoom}
    class="absolute top-1 right-1 px-3 py-1.5 text-xs font-medium rounded-lg transition {zoomedIn
      ? 'bg-blue-500 text-white shadow-sm'
      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}"
  >
    {zoomedIn ? zoomOutLabel : zoomInLabel}
  </button>
</div>
