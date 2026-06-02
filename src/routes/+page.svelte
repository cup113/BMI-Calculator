<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { getLocale } from "$lib/paraglide/runtime";
  import {
    getStandard,
    getStandardsByCategory,
    getCategories,
    getDefaultStandardId,
    calculateBMI,
    getWeightUnits,
  } from "$lib/constants";
  import type { Gender, BmiCategory, BmiStandard, ClassificationInput } from "$lib/standards/types";
  import { stageGroups } from "$lib/standards/china-student";

  import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";
  import WeightInput from "$lib/components/WeightInput.svelte";
  import HeightInput from "$lib/components/HeightInput.svelte";
  import GenderSelector from "$lib/components/GenderSelector.svelte";
  import ConditionalInputs from "$lib/components/ConditionalInputs.svelte";
  import ResultCard from "$lib/components/ResultCard.svelte";
  import PrivacyNotice from "$lib/components/PrivacyNotice.svelte";
  import DataSources from "$lib/components/DataSources.svelte";

  function t(key: string): string {
    const fn = (m as Record<string, () => string>)[key];
    return fn ? fn() : key;
  }

  let weight = $state<number | string>("");
  let height = $state<number | string>("");
  let gender = $state<Gender>("male");
  let weightUnitId = $state("kg");
  let selectedCategory = $state<BmiCategory>("adult");
  let standardId = $state(getDefaultStandardId(getLocale()));
  let age = $state<number | string>("");
  let selectedGrade = $state("grade-7");
  let hasCalculated = $state(false);
  let showDataSources = $state(false);
  let zoomedIn = $state(false);

  let currentStandard = $derived(getStandard(standardId)!);
  let categories = $derived(getCategories());
  let standardsMap = $derived(
    Object.fromEntries(
      categories.map((c) => [c, getStandardsByCategory(c, getLocale())])
    ) as Record<BmiCategory, BmiStandard[]>
  );
  let weightUnits = $derived(getWeightUnits(getLocale()));
  let currentUnit = $derived(weightUnits.find((u) => u.id === weightUnitId) ?? weightUnits[0]);
  let weightKg = $derived(currentUnit.toKg(Number(weight)));

  let bmi = $derived(calculateBMI(weightKg, Number(height)));

  let classifyInput = $derived<ClassificationInput>({
    bmi: bmi ?? 0,
    gender,
    age: age !== "" ? Number(age) : undefined,
    grade: selectedGrade,
  });

  let result = $derived(currentStandard.classify(classifyInput));

  let levelBoundsArray = $derived(
    currentStandard.levels.map((_, i) =>
      currentStandard.levelBmiBounds(i, classifyInput)
    )
  );

  let levelLabels = $derived(
    currentStandard.levels.map((l) => t(l.nameKey))
  );

  let normalLevelIndex = $derived(
    currentStandard.levels.findIndex((l) => l.id === "normal")
  );

  let normalBounds = $derived(
    normalLevelIndex >= 0
      ? currentStandard.levelBmiBounds(normalLevelIndex, classifyInput)
      : null
  );

  let idealWeightMin = $derived(
    normalBounds ? weightFromBMI(normalBounds.min) : null
  );
  let idealWeightMax = $derived(
    normalBounds ? weightFromBMI(normalBounds.max) : null
  );

  let idealWeightMinConverted = $derived(
    idealWeightMin !== null ? currentUnit.fromKg(idealWeightMin) : null
  );
  let idealWeightMaxConverted = $derived(
    idealWeightMax !== null ? currentUnit.fromKg(idealWeightMax) : null
  );

  let idealWeightUnitLabel = $derived(t(currentUnit.labelKey));

  function weightFromBMI(bmiVal: number): number {
    const mVal = Number(height) / 100;
    return bmiVal * mVal * mVal;
  }

  function handleCalculate() {
    const h = Number(height);
    if (weight && h >= 50 && h <= 300) {
      hasCalculated = true;
    }
  }

  function handleReset() {
    weight = "";
    height = "";
    gender = "male";
    weightUnitId = "kg";
    age = "";
    selectedGrade = "grade-7";
    selectedCategory = "adult";
    standardId = getDefaultStandardId(getLocale());
    hasCalculated = false;
    zoomedIn = false;
  }

  function selectCategory(cat: BmiCategory) {
    selectedCategory = cat;
    hasCalculated = false;
    zoomedIn = false;
  }

  function selectStandard(id: string) {
    standardId = id;
    hasCalculated = false;
    zoomedIn = false;
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
  <div class="max-w-md mx-auto">
    <header class="text-center mb-4">
      <h1 class="text-3xl font-bold text-slate-800 mb-2">{m.app_title()}</h1>
      <p class="text-slate-500 mb-4">{m.app_subtitle()}</p>
      <LanguageSwitcher />
    </header>

    <section class="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <WeightInput bind:weight bind:weightUnitId />
      <HeightInput bind:height />
      <GenderSelector bind:gender />

      <ConditionalInputs
        bind:selectedCategory
        bind:standardId
        bind:age
        bind:selectedGrade
        {currentStandard}
        {standardsMap}
        {categories}
        {stageGroups}
        onselectCategory={selectCategory}
        onselectStandard={selectStandard}
      />

      <button
        onclick={handleCalculate}
        disabled={!weight || !height || Number(height) < 50 || Number(height) > 300}
        class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {m.calculate()}
      </button>
    </section>

    {#if hasCalculated && bmi !== null && result}
      <ResultCard
        {bmi}
        result={result!}
        {levelBoundsArray}
        {levelLabels}
        bind:zoomedIn
        {idealWeightMinConverted}
        {idealWeightMaxConverted}
        {idealWeightUnitLabel}
        {currentStandard}
        ontogglezoom={() => (zoomedIn = !zoomedIn)}
        onreset={handleReset}
      />
    {/if}

    <PrivacyNotice />
    <DataSources bind:showDataSources />

    <footer class="text-center text-xs text-slate-400 pb-4">
      <p>{m.footer_disclaimer()}</p>
    </footer>
  </div>
</div>
