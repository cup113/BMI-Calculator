<script lang="ts">
  import type { BmiLevel } from "$lib/standards/types";
  import {
    hexColor, textHexColor, computeGaugeData, arcPath, tickLine, labelPos,
    CX, CY, R, LABEL_R, BMI_LABEL_R, NEEDLE_TIP_R,
  } from "$lib/gauge-math";

  interface Props {
    levels: BmiLevel[];
    levelBounds: ({ min: number; max: number } | null)[];
    levelLabels: string[];
    bmi: number | null;
    currentIndex: number;
    zoomedIn: boolean;
    zoomInLabel: string;
    zoomOutLabel: string;
    isDark?: boolean;
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
    isDark = false,
    ontogglezoom,
  }: Props = $props();

  let gaugeData = $derived(computeGaugeData(levels, levelBounds, bmi, currentIndex, zoomedIn, isDark));

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
      stroke={isDark ? "#334155" : "#e2e8f0"}
      stroke-width="14"
      stroke-linecap="round"
    />

    <!-- Colored level segments -->
    {#each gaugeData.segments as seg}
      <path
        d={arcPath(seg.startAngle, seg.endAngle)}
        fill="none"
        stroke={hexColor(seg.level.color, isDark)}
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
        fill={textHexColor(seg.level.color, isDark)}
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
          stroke={isDark ? "#e2e8f0" : "#1e293b"}
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <circle
          cx={CX + NEEDLE_TIP_R + 3}
          cy={CY}
          r="4.5"
          fill={isDark ? "#e2e8f0" : "#1e293b"}
        />
      </g>
      <!-- Pivot -->
      <circle cx={CX} cy={CY} r="7" fill={isDark ? "#e2e8f0" : "#1e293b"} />
      <circle cx={CX} cy={CY} r="3.5" fill={isDark ? "#1e293b" : "#ffffff"} />
    {/if}
  </svg>

  <!-- Zoom toggle button -->
  <button
    onclick={ontogglezoom}
    class="absolute top-1 right-1 px-3 py-1.5 text-xs font-medium rounded-lg transition {zoomedIn
      ? 'bg-blue-500 text-white shadow-sm'
      : 'bg-surface-alt text-text-secondary hover:bg-surface-hover'}"
  >
    {zoomedIn ? zoomOutLabel : zoomInLabel}
  </button>
</div>
