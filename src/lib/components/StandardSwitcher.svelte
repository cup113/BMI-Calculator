<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { t } from "$lib/i18n/t";
  import type { BmiStandard } from "$lib/standards/types";
  import { fly } from "svelte/transition";

  let {
    standardId,
    currentStandard,
    currentStandards = [],
    onselectStandard,
  }: {
    standardId: string;
    currentStandard: BmiStandard;
    currentStandards: BmiStandard[];
    onselectStandard?: (id: string) => void;
  } = $props();

  let dropdownVisible = $state(false);

  function handleSelect(id: string) {
    onselectStandard?.(id);
    dropdownVisible = false;
  }

  function handleDismiss() {
    dropdownVisible = false;
  }

  function toggle() {
    dropdownVisible = !dropdownVisible;
  }
</script>

<svelte:window onkeydown={(e) => { if (e.key === "Escape" && dropdownVisible) handleDismiss() }} />

<div class="relative text-xs text-text-secondary">
  <span class="font-medium">{m.current_standard()}: {t(currentStandard.nameKey)}</span>
  <button
    onclick={toggle}
    class="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium focus:outline-none"
  >
    {m.switch_standard()}
  </button>
  {#if dropdownVisible}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div role="presentation" class="fixed inset-0 z-20" onclick={handleDismiss}></div>
    <div
      class="absolute right-0 top-full mt-1 z-30 min-w-40 bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
      transition:fly={{ duration: 150, y: -4 }}
    >
      {#each currentStandards as std}
        <button
          onclick={() => handleSelect(std.id)}
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
