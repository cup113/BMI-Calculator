<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { getLocale } from "$lib/paraglide/runtime";
  import { t } from "$lib/i18n/t";
  import { version } from "../../package.json";
  import { calculateBMI } from "$lib/bmi";
  import { getWeightUnits } from "$lib/units";
  import {
    getStandard,
    getStandardsByCategory,
    getCategories,
    getDefaultStandardId,
    getDefaultStandardIdForCategory,
  } from "$lib/standards/registry";
  import type { Gender, BmiCategory, BmiStandard, ClassificationInput } from "$lib/standards/types";
  import { computeHealthyWeightRange } from "$lib/healthy-weight-range";
  import { stageGroups } from "$lib/standards/china-student";

  import WeightInput from "$lib/components/WeightInput.svelte";
  import HeightInput from "$lib/components/HeightInput.svelte";
  import GenderSelector from "$lib/components/GenderSelector.svelte";
  import CategorySelector from "$lib/components/CategorySelector.svelte";
  import StandardSwitcher from "$lib/components/StandardSwitcher.svelte";
  import GradeInput from "$lib/components/GradeInput.svelte";
  import AgeInput from "$lib/components/AgeInput.svelte";
  import ResultCard from "$lib/components/ResultCard.svelte";
  import PrivacyNotice from "$lib/components/PrivacyNotice.svelte";
  import DataSources from "$lib/components/DataSources.svelte";

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
  let currentStandards = $derived(standardsMap[selectedCategory] ?? []);
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

  let healthyWeightRange = $derived(
    computeHealthyWeightRange(Number(height), currentStandard, classifyInput, currentUnit)
  );

  function handleCalculate() {
    const h = Number(height);
    if (weight && h >= 50 && h <= 300) {
      hasCalculated = true;
      (window as any).umami?.track("calculate_bmi");
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
    standardId = getDefaultStandardIdForCategory("adult", getLocale());
    hasCalculated = false;
    zoomedIn = false;
  }

  function selectCategory(cat: BmiCategory) {
    selectedCategory = cat;
    standardId = getDefaultStandardIdForCategory(cat, getLocale());
    hasCalculated = false;
    zoomedIn = false;
  }

  function selectStandard(id: string) {
    standardId = id;
    hasCalculated = false;
    zoomedIn = false;
  }
</script>

<div class="min-h-screen p-4 md:p-8">
  <div class="max-w-md mx-auto">
    <section class="bg-surface rounded-2xl shadow-lg p-8 mb-6">
      <WeightInput bind:weight bind:weightUnitId />
      <HeightInput bind:height />
      <GenderSelector bind:gender />

      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <span class="block text-sm font-semibold text-text-primary">
            {m.category_label()}
          </span>
          <StandardSwitcher
            {standardId}
            {currentStandard}
            currentStandards={currentStandards}
            onselectStandard={selectStandard}
          />
        </div>
        <CategorySelector
          selectedCategory={selectedCategory}
            {categories}
            {standardsMap}
            onselectCategory={selectCategory}
        />
      </div>

      {#if currentStandard.requiredFields.includes("grade")}
        <GradeInput bind:selectedGrade {stageGroups} />
      {/if}

      {#if currentStandard.requiredFields.includes("age")}
        <AgeInput bind:age />
      {/if}

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
        healthyWeightMinConverted={healthyWeightRange?.min ?? null}
        healthyWeightMaxConverted={healthyWeightRange?.max ?? null}
        healthyWeightUnitLabel={healthyWeightRange?.unitLabel ?? ""}
        {currentStandard}
        ontogglezoom={() => (zoomedIn = !zoomedIn)}
        onreset={handleReset}
      />
    {/if}

    <PrivacyNotice />
    <DataSources bind:showDataSources />

    <footer class="text-center text-xs text-text-muted pb-4 space-y-1">
      <p>{m.footer_disclaimer()}</p>
      <p>
        <a
          href="https://github.com/cup113/BMI-Calculator"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-text-secondary transition-colors underline underline-offset-2"
        >{m.footer_github()}</a>
        <span class="mx-1.5">·</span>
        <span>{m.footer_version()} {version}</span>
      </p>
    </footer>
  </div>
</div>
