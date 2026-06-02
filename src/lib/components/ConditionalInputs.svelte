<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { BmiCategory, BmiStandard } from "$lib/standards/types";
  import type { StageGroup } from "$lib/standards/china-student";
  import { fly } from "svelte/transition";

  function t(key: string): string {
    const fn = (m as Record<string, () => string>)[key];
    return fn ? fn() : key;
  }

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

  let popoverVisible = $state(false);
  let popoverX = $state(0);
  let popoverY = $state(0);
  let pendingCategory = $state<BmiCategory | null>(null);
  let prevCategory = $state<BmiCategory>("adult");

  function handleCategoryClick(cat: BmiCategory, event: MouseEvent) {
    const standards = standardsMap[cat];
    if (!standards || standards.length === 0) return;

    if (standards.length === 1) {
      onselectCategory?.(cat);
      onselectStandard?.(standards[0].id);
      return;
    }

    pendingCategory = cat;
    prevCategory = selectedCategory;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    popoverX = rect.left;
    popoverY = rect.bottom + 4;
    popoverVisible = true;
  }

  function handleSelectStandard(id: string) {
    if (pendingCategory !== null) {
      onselectCategory?.(pendingCategory);
    }
    onselectStandard?.(id);
    popoverVisible = false;
    pendingCategory = null;
  }

  function handleDismiss() {
    popoverVisible = false;
    pendingCategory = null;
  }
</script>

<div class="conditional-inputs-container">
  <!-- Category Pills -->
  <div class="mb-6">
    <div class="block text-sm font-semibold text-slate-700 mb-3">
      {m.category_label()}
    </div>
    <div class="flex gap-2">
      {#each categories as cat}
        <button
          onclick={(e) => handleCategoryClick(cat, e)}
          class="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition border-2 {cat === (pendingCategory ?? selectedCategory)
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}"
        >
          {t(`category_${cat}`)}
        </button>
      {/each}
    </div>
  </div>

  <!-- Standard Popover -->
  {#if popoverVisible && pendingCategory}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div role="presentation" class="fixed inset-0 z-20" onclick={handleDismiss}></div>
    <div
      class="fixed z-30 min-w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
      style="left: {popoverX}px; top: {popoverY}px"
      transition:fly={{ duration: 150, y: -8 }}
    >
      {#each standardsMap[pendingCategory] as std}
        <button
          onclick={() => handleSelectStandard(std.id)}
          class="w-full px-4 py-3 text-left text-sm font-medium transition {std.id === standardId
            ? 'bg-blue-500 text-white'
            : 'text-slate-700 hover:bg-slate-50'}"
        >
          {t(std.nameKey)}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Grade Picker (inline) -->
  {#if currentStandard.requiredFields.includes("grade")}
    <div class="mb-6">
      <div class="block text-sm font-semibold text-slate-700 mb-3">
        {m.stage()}
      </div>
      {#each stageGroups as group}
        <div class="mb-3">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            {t(group.labelKey)}
          </div>
          <div class="grid grid-cols-3 gap-2">
            {#each group.stages as gradeItem}
              <button
                onclick={() => { selectedGrade = gradeItem.id }}
                class="py-2 px-2 rounded-md text-sm font-medium transition {gradeItem.id === selectedGrade
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
              >
                {t(gradeItem.nameKey)}
              </button>
            {/each}
          </div>
        </div>
      {/each}
      <button
        onclick={() => { selectedGrade = "grade-7" }}
        class="text-sm font-medium text-slate-400 hover:text-slate-600 transition"
      >
        {m.reset()}
      </button>
    </div>
  {/if}

  <!-- Age Input (inline) -->
  {#if currentStandard.requiredFields.includes("age")}
    <div class="mb-6">
      <div class="block text-sm font-semibold text-slate-700 mb-3">
        {m.age()}
        <span class="text-xs text-slate-400 font-normal">(5-19)</span>
      </div>
      <input
        type="number"
        bind:value={age}
        placeholder="5-19"
        step="0.5"
        min="5"
        max="19"
        class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
      />
    </div>
  {/if}
</div>
