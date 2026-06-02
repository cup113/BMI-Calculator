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

  const CX = 180;
  const CY = 200;
  const R = 160;
  const TICK_INNER = 144;
  const TICK_OUTER = 156;
  const LABEL_R = 118;
  const BMI_LABEL_R = 168;
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
      visualMin = validBounds[startIdx].min;
      visualMax = validBounds[endIdx].max;
    } else {
      startIdx = 0;
      endIdx = N - 1;
      visualMin = validBounds[0].min;
      const secondToLast = validBounds[N - 2];
      const lastCutoff = secondToLast ? secondToLast.max : validBounds[N - 1].min + 5;
      visualMax = Math.round(lastCutoff * 1.3 * 10) / 10;
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
      const a1 = angle(segMax);
      const a2 = angle(segMin);
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
    for (let i = startIdx; i <= endIdx; i++) {
      const b = validBounds[i];
      if (!b) continue;
      if (i > startIdx) {
        ticks.push({
          angle: angle(b.min),
          label: b.min.toFixed(1),
        });
      }
    }
    ticks.push({
      angle: angle(visualMax),
      label: visualMax.toFixed(1),
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
  let needleTipX = $derived(gaugeData.needleAngle !== null ? CX + (NEEDLE_TIP_R + 3) * Math.cos(gaugeData.needleAngle) : 0);
  let needleTipY = $derived(gaugeData.needleAngle !== null ? CY - (NEEDLE_TIP_R + 3) * Math.sin(gaugeData.needleAngle) : 0);
  let needleEndX = $derived(gaugeData.needleAngle !== null ? CX + NEEDLE_TIP_R * Math.cos(gaugeData.needleAngle) : 0);
  let needleEndY = $derived(gaugeData.needleAngle !== null ? CY - NEEDLE_TIP_R * Math.sin(gaugeData.needleAngle) : 0);
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
        stroke="#94a3b8"
        stroke-width="1.5"
      />
      {@const pos = labelPos(tick.angle, BMI_LABEL_R)}
      <text
        x={pos.x.toFixed(2)}
        y={(pos.y + 4).toFixed(2)}
        text-anchor="middle"
        class="fill-slate-500"
        font-size="10"
      >
        {tick.label}
      </text>
    {/each}

    <!-- Level name labels (only in zoom-in mode) -->
    {#if zoomedIn}
      {#each gaugeData.segments as seg}
        {@const lpos = labelPos(seg.midAngle, LABEL_R)}
        <text
          x={lpos.x.toFixed(2)}
          y={(lpos.y + 4).toFixed(2)}
          text-anchor="middle"
          font-size="11"
          font-weight="600"
          fill={textHexColor(seg.level.color)}
        >
          {levelLabels[seg.index] ?? ""}
        </text>
      {/each}
    {/if}

    <!-- Needle -->
    {#if gaugeData.needleAngle !== null}
      <line
        x1={CX}
        y1={CY}
        x2={needleEndX.toFixed(2)}
        y2={needleEndY.toFixed(2)}
        stroke="#1e293b"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <!-- Needle tip dot -->
      <circle
        cx={needleTipX.toFixed(2)}
        cy={needleTipY.toFixed(2)}
        r="4.5"
        fill="#1e293b"
      />
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
