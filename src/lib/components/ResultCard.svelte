<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { t } from "$lib/i18n/t";
  import { theme } from "$lib/theme.svelte";
  import SemicircleGauge from "$lib/components/SemicircleGauge.svelte";
  import type { ClassificationResult, BmiStandard } from "$lib/standards/types";

  let {
    bmi,
    result,
    levelBoundsArray,
    levelLabels,
    zoomedIn = $bindable(false),
    healthyWeightMinConverted,
    healthyWeightMaxConverted,
    healthyWeightUnitLabel,
    currentStandard,
    ontogglezoom,
    onreset,
  }: {
    bmi: number | null;
    result: ClassificationResult;
    levelBoundsArray: ({ min: number; max: number } | null)[];
    levelLabels: string[];
    zoomedIn: boolean;
    healthyWeightMinConverted: number | null;
    healthyWeightMaxConverted: number | null;
    healthyWeightUnitLabel: string;
    currentStandard: BmiStandard;
    ontogglezoom?: () => void;
    onreset?: () => void;
  } = $props();

  let isDark = $derived(theme.value === "dark");
</script>

<section class="bg-surface rounded-2xl shadow-lg p-8 mb-6">
  <!-- BMI Value -->
  <div class="text-center mb-6">
    <p class="text-text-secondary text-sm mb-2">{m.your_bmi()}</p>
    <p class="text-5xl font-bold {isDark && result.level.textColorDark ? result.level.textColorDark : result.level.textColor}">{bmi}</p>
    <p class="text-lg font-semibold {isDark && result.level.textColorDark ? result.level.textColorDark : result.level.textColor} mt-2">
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
      isDark={isDark}
    />
  </div>

  <!-- Healthy Weight Range -->
  {#if healthyWeightMinConverted !== null && healthyWeightMaxConverted !== null}
    <div class="mb-6 text-center">
      <p class="text-xs text-text-secondary mb-1">{m.healthy_weight_range()}</p>
      <p class="text-sm font-semibold text-green-600 dark:text-green-400">
        {healthyWeightMinConverted.toFixed(1)} - {healthyWeightMaxConverted.toFixed(1)} {healthyWeightUnitLabel}
      </p>
    </div>
  {/if}

  <button
    onclick={onreset}
    class="w-full py-2 px-4 border-2 border-border text-text-primary font-semibold rounded-lg hover:bg-surface-hover transition"
  >
    {m.recalculate()}
  </button>
</section>
