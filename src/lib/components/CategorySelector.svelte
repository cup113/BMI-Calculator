<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { t } from "$lib/i18n/t";
  import type { BmiCategory, BmiStandard } from "$lib/standards/types";

  let {
    selectedCategory,
    categories = [],
    standardsMap = {} as Record<BmiCategory, BmiStandard[]>,
    onselectCategory,
  }: {
    selectedCategory: BmiCategory;
    categories: BmiCategory[];
    standardsMap: Record<BmiCategory, BmiStandard[]>;
    onselectCategory?: (cat: BmiCategory) => void;
  } = $props();

  function handleClick(cat: BmiCategory) {
    if (!standardsMap[cat] || standardsMap[cat].length === 0) return;
    if (cat === selectedCategory) return;
    onselectCategory?.(cat);
  }
</script>

<div class="flex gap-2">
  {#each categories as cat}
    <button
      onclick={() => handleClick(cat)}
      class="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition border-2 {cat === selectedCategory
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-surface text-text-primary border-border hover:border-blue-300'}"
    >
      {t(`category_${cat}`)}
    </button>
  {/each}
</div>
