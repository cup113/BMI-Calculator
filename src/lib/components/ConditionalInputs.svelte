<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { t } from "$lib/i18n/t";
  import type { BmiCategory, BmiStandard } from "$lib/standards/types";
  import type { StageGroup } from "$lib/standards/china-student";
  import { fly } from "svelte/transition";

  let {
    selectedCategory = $bindable("adult"),
    standardId = $bindable(""),
    age = $bindable(""),
    selectedGrade = $bindable("grade-7"),
    currentStandard,
    standardsMap = {} as Record<BmiCategory, BmiStandard[]>,
    categories = [],
    stageGroups = [],
    onselectCategory,
    onselectStandard,
  }: {
    selectedCategory: BmiCategory;
    standardId: string;
    age: number | string;
    selectedGrade: string;
    currentStandard: BmiStandard;
    standardsMap: Record<BmiCategory, BmiStandard[]>;
    categories: BmiCategory[];
    stageGroups: StageGroup[];
    onselectCategory?: (cat: BmiCategory) => void;
    onselectStandard?: (id: string) => void;
  } = $props();

  let standardDropdownVisible = $state(false);
  let currentStandards = $derived(standardsMap[selectedCategory] ?? []);

  function handleCategoryClick(cat: BmiCategory) {
    if (!standardsMap[cat] || standardsMap[cat].length === 0) return;
    if (cat === selectedCategory) return;
    standardDropdownVisible = false;
    onselectCategory?.(cat);
  }

  function handleSelectStandard(id: string) {
    onselectStandard?.(id);
    standardDropdownVisible = false;
  }

  function handleDismissDropdown() {
    standardDropdownVisible = false;
  }

  function toggleDropdown() {
    standardDropdownVisible = !standardDropdownVisible;
  }
</script>

<svelte:window onkeydown={(e) => { if (e.key === "Escape" && standardDropdownVisible) handleDismissDropdown() }} />

<div class="conditional-inputs-container">
  <div class="mb-6">
    <div class="flex items-center justify-between mb-3">
      <span class="block text-sm font-semibold text-text-primary">
        {m.category_label()}
      </span>
      <div class="relative text-xs text-text-secondary">
        <span class="font-medium">{m.current_standard()}: {t(currentStandard.nameKey)}</span>
        <button
          onclick={toggleDropdown}
          class="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium focus:outline-none"
        >
          {m.switch_standard()}
        </button>
        {#if standardDropdownVisible}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div role="presentation" class="fixed inset-0 z-20" onclick={handleDismissDropdown}></div>
          <div
            class="absolute right-0 top-full mt-1 z-30 min-w-40 bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
            transition:fly={{ duration: 150, y: -4 }}
          >
            {#each currentStandards as std}
              <button
                onclick={() => handleSelectStandard(std.id)}
                class="w-full px-3 py-2 text-left text-xs font-medium transition {std.id === standardId
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-text-primary hover:bg-surface-hover'}"
              >
                {t(std.nameKey)}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    <div class="flex gap-2">
      {#each categories as cat}
        <button
          onclick={() => handleCategoryClick(cat)}
          class="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition border-2 {cat === selectedCategory
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-surface text-text-primary border-border hover:border-blue-300'}"
        >
          {t(`category_${cat}`)}
        </button>
      {/each}
    </div>
  </div>

  <!-- Grade Picker (inline) -->
  {#if currentStandard.requiredFields.includes("grade")}
    <div class="mb-6">
      <div class="block text-sm font-semibold text-text-primary mb-3">
        {m.stage()}
      </div>
      {#each stageGroups as group}
        <div class="mb-3">
          <div class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
            {t(group.labelKey)}
          </div>
          <div class="grid grid-cols-3 gap-2">
            {#each group.stages as gradeItem}
              <button
                onclick={() => { selectedGrade = gradeItem.id }}
                class="py-2 px-2 rounded-md text-sm font-medium transition {gradeItem.id === selectedGrade
                  ? 'bg-blue-500 text-white'
                  : 'bg-surface-alt text-text-primary hover:bg-surface-hover'}"
              >
                {t(gradeItem.nameKey)}
              </button>
            {/each}
          </div>
        </div>
      {/each}
      <button
        onclick={() => { selectedGrade = "grade-7" }}
        class="text-sm font-medium text-text-muted hover:text-text-secondary transition"
      >
        {m.reset()}
      </button>
    </div>
  {/if}

  <!-- Age Input (inline) -->
  {#if currentStandard.requiredFields.includes("age")}
    <div class="mb-6">
      <div class="block text-sm font-semibold text-text-primary mb-3">
        {m.age()}
        <span class="text-xs text-text-muted font-normal">(5-19)</span>
      </div>
      <input
        type="number"
        bind:value={age}
        placeholder="5-19"
        step="0.5"
        min="5"
        max="19"
        class="w-full px-4 py-3 border-2 border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-blue-500 transition"
      />
    </div>
  {/if}
</div>
