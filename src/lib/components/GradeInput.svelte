<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { t } from "$lib/i18n/t";
  import type { StageGroup } from "$lib/standards/china-student";

  let {
    selectedGrade = $bindable("grade-7"),
    stageGroups = [],
  }: {
    selectedGrade: string;
    stageGroups: StageGroup[];
  } = $props();
</script>

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
