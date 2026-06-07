<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { t } from "$lib/i18n/t";
  import { getWeightUnits, convertWeightText } from "$lib/units";
  import { getLocale } from "$lib/paraglide/runtime";

  let { weight = $bindable(""), weightUnitId = $bindable("kg") }: {
    weight: number | string;
    weightUnitId: string;
  } = $props();

  let weightUnits = $derived(getWeightUnits(getLocale()));
  let currentUnit = $derived(weightUnits.find((u) => u.id === weightUnitId) ?? weightUnits[0]);
  let otherUnit = $derived(weightUnits.find((u) => u.id !== weightUnitId) ?? weightUnits[1]);
  let convertedWeight = $derived(convertWeightText(Number(weight), currentUnit, otherUnit));
</script>

<div class="mb-6">
  <div class="block text-sm font-semibold text-text-primary mb-3">
    {m.weight()}
  </div>
  <div class="flex gap-2">
    <div class="flex-1 relative">
      <input
        type="number"
        bind:value={weight}
        placeholder={m.weight_placeholder()}
        step="0.1"
        min="1"
        class="w-full px-4 py-3 border-2 border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-blue-500 transition"
      />
      {#if convertedWeight}
        <span
          class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted"
        >
          {convertedWeight}
        </span>
      {/if}
    </div>
    <div class="flex bg-surface-alt rounded-lg p-1">
      {#each weightUnits as unit}
        <button
          onclick={() => (weightUnitId = unit.id)}
          class="px-4 py-2 rounded-md font-medium transition {weightUnitId === unit.id
            ? 'bg-surface text-blue-600 shadow-sm'
            : 'text-text-secondary hover:text-text-primary'}"
        >
          {t(unit.labelKey)}
        </button>
      {/each}
    </div>
  </div>
</div>
