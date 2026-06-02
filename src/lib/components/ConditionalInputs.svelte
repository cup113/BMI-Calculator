<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { BmiCategory } from "$lib/standards/types";
  import type { BmiStandard, BmiLevel, ClassificationInput } from "$lib/standards/types";
  import type { StageGroup } from "$lib/standards/china-student";

  function t(key: string): string {
    const fn = (m as Record<string, () => string>)[key];
    return fn ? fn() : key;
  }

  let {
    selectedCategory = $bindable("adult"),
    showCategoryPicker = $bindable(false),
    showStandardPicker = $bindable(false),
    showStagePicker = $bindable(false),
    standardId = $bindable(""),
    age = $bindable(""),
    selectedGrade = $bindable("grade-7"),
    currentStandard,
    subStandards = [],
    categories = [],
    stageGroups = [],
    onselectCategory,
    onselectStandard,
  }: {
    selectedCategory: BmiCategory;
    showCategoryPicker: boolean;
    showStandardPicker: boolean;
    showStagePicker: boolean;
    standardId: string;
    age: number | string;
    selectedGrade: string;
    currentStandard: BmiStandard;
    subStandards: BmiStandard[];
    categories: BmiCategory[];
    stageGroups: StageGroup[];
    onselectCategory?: (cat: BmiCategory) => void;
    onselectStandard?: (id: string) => void;
  } = $props();

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".conditional-inputs-container")) {
      showCategoryPicker = false;
      showStandardPicker = false;
      showStagePicker = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="conditional-inputs-container">
  <!-- Category Selector -->
  <div class="mb-6 category-picker-container relative">
    <div class="block text-sm font-semibold text-slate-700 mb-3">
      {m.category_label()}
    </div>
    <button
      onclick={() => (showCategoryPicker = !showCategoryPicker)}
      class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition bg-white flex items-center justify-between"
    >
      <span class="font-medium text-slate-700">
        {t(`category_${selectedCategory}`)}
      </span>
      <svg
        class="w-5 h-5 text-slate-400 transition-transform {showCategoryPicker ? 'rotate-180' : ''}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    {#if showCategoryPicker}
      <div
        class="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
      >
        {#each categories as cat}
          <button
            onclick={() => {
              showCategoryPicker = false;
              onselectCategory?.(cat);
            }}
            class="w-full px-4 py-3 text-left text-sm font-medium transition {cat === selectedCategory
              ? 'bg-blue-500 text-white'
              : 'text-slate-700 hover:bg-slate-50'}"
          >
            {t(`category_${cat}`)}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Sub-standard Selector (only when category has multiple standards) -->
  {#if subStandards.length > 1}
    <div class="mb-6 standard-picker-container relative">
      <div class="block text-sm font-semibold text-slate-700 mb-3">
        {m.standard_selector()}
      </div>
      <button
        onclick={() => (showStandardPicker = !showStandardPicker)}
        class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition bg-white flex items-center justify-between"
      >
        <span class="font-medium text-slate-700">
          {t(currentStandard.nameKey)}
        </span>
        <svg
          class="w-5 h-5 text-slate-400 transition-transform {showStandardPicker ? 'rotate-180' : ''}"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {#if showStandardPicker}
        <div
          class="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
        >
          {#each subStandards as std}
            <button
              onclick={() => {
                showStandardPicker = false;
                onselectStandard?.(std.id);
              }}
              class="w-full px-4 py-3 text-left text-sm font-medium transition {std.id === standardId
                ? 'bg-blue-500 text-white'
                : 'text-slate-700 hover:bg-slate-50'}"
            >
              {t(std.nameKey)}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Age Input (for WHO Child) -->
  {#if currentStandard.id === "who-child"}
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

  <!-- Grade Picker (for China Student) -->
  {#if currentStandard.requiredFields.includes("grade")}
    <div class="mb-6 stage-picker-container relative">
      <div class="block text-sm font-semibold text-slate-700 mb-3">
        {m.stage()}
      </div>
      <button
        onclick={() => (showStagePicker = !showStagePicker)}
        class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition bg-white flex items-center justify-between"
      >
        <span class="font-medium text-slate-700">
          {t(
            stageGroups
              .flatMap((g) => g.stages)
              .find((s) => s.id === selectedGrade)?.nameKey ?? selectedGrade
          )}
        </span>
        <svg
          class="w-5 h-5 text-slate-400 transition-transform {showStagePicker ? 'rotate-180' : ''}"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {#if showStagePicker}
        <div
          class="absolute z-10 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
        >
          {#each stageGroups as group}
            <div class="px-3.5 py-3 border-b border-slate-100 last:border-0">
              <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">
                {t(group.labelKey)}
              </div>
              <div class="grid grid-cols-3 gap-2">
                {#each group.stages as gradeItem}
                  <button
                    onclick={() => {
                      selectedGrade = gradeItem.id;
                      showStagePicker = false;
                    }}
                    class="py-2 px-2 rounded-md text-[13px] font-medium transition"
                  >
                    {t(gradeItem.nameKey)}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
          <div class="px-3.5 py-2.5 border-t border-slate-100 bg-slate-50">
            <button
              onclick={() => {
                selectedGrade = "grade-7";
                showStagePicker = false;
              }}
              class="w-full text-[13px] font-medium text-slate-400 hover:text-slate-600 transition"
            >
              {m.reset()}
            </button>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
