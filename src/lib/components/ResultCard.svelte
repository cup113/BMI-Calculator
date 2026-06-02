<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import SemicircleGauge from "$lib/components/SemicircleGauge.svelte";
  import type { ClassificationResult, BmiStandard } from "$lib/standards/types";

  function t(key: string): string {
    const fn = (m as Record<string, () => string>)[key];
    return fn ? fn() : key;
  }

  let {
    bmi,
    result,
    levelBoundsArray,
    levelLabels,
    zoomedIn = $bindable(false),
    idealWeightMinConverted,
    idealWeightMaxConverted,
    idealWeightUnitLabel,
    currentStandard,
    ontogglezoom,
    onreset,
  }: {
    bmi: number | null;
    result: ClassificationResult;
    levelBoundsArray: ({ min: number; max: number } | null)[];
    levelLabels: string[];
    zoomedIn: boolean;
    idealWeightMinConverted: number | null;
    idealWeightMaxConverted: number | null;
    idealWeightUnitLabel: string;
    currentStandard: BmiStandard;
    ontogglezoom?: () => void;
    onreset?: () => void;
  } = $props();
</script>

<section class="bg-white rounded-2xl shadow-lg p-8 mb-6">
  <!-- BMI Value -->
  <div class="text-center mb-6">
    <p class="text-slate-500 text-sm mb-2">{m.your_bmi()}</p>
    <p class="text-5xl font-bold {result.level.textColor}">{bmi}</p>
    <p class="text-lg font-semibold {result.level.textColor} mt-2">
      {t(result.level.nameKey)}
    </p>
  </div>

  <!-- Semicircle Gauge -->
  <div class="mb-6">
    <SemicircleGauge
      levels={currentStandard.levels}
      levelBounds={levelBoundsArray}
      levelLabels={levelLabels}
      bmi={bmi}
      currentIndex={result.index}
      zoomedIn={zoomedIn}
      zoomInLabel={m.zoom_in()}
      zoomOutLabel={m.zoom_out()}
      ontogglezoom={ontogglezoom}
    />
  </div>

  <!-- Ideal Weight Range -->
  {#if idealWeightMinConverted !== null && idealWeightMaxConverted !== null}
    <div class="mb-6 text-center">
      <p class="text-xs text-slate-500 mb-1">{m.ideal_weight_range()}</p>
      <p class="text-sm font-semibold text-green-600">
        {idealWeightMinConverted.toFixed(1)} - {idealWeightMaxConverted.toFixed(1)} {idealWeightUnitLabel}
      </p>
    </div>
  {/if}

  <button
    onclick={onreset}
    class="w-full py-2 px-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
  >
    {m.recalculate()}
  </button>
</section>
