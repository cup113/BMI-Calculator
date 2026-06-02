<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { getWeightUnits, convertWeightText } from "$lib/constants";
  import { getLocale } from "$lib/paraglide/runtime";

  function t(key: string): string {
    const fn = (m as Record<string, () => string>)[key];
    return fn ? fn() : key;
  }

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
  <div class="block text-sm font-semibold text-slate-700 mb-3">
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
        class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
      />
      {#if convertedWeight}
        <span
          class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
        >
          {convertedWeight}
        </span>
      {/if}
    </div>
    <div class="flex bg-slate-100 rounded-lg p-1">
      {#each weightUnits as unit}
        <button
          onclick={() => (weightUnitId = unit.id)}
          class="px-4 py-2 rounded-md font-medium transition {weightUnitId === unit.id
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-800'}"
        >
          {t(unit.labelKey)}
        </button>
      {/each}
    </div>
  </div>
</div>
