<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { t } from "$lib/i18n/t";

  let { height = $bindable("") }: {
    height: number | string;
  } = $props();
</script>

<div class="mb-6">
  <div class="block text-sm font-semibold text-text-primary mb-3">
    {m.height()}
  </div>
  <div class="flex gap-2">
    <input
      type="number"
      bind:value={height}
      placeholder={m.height_placeholder()}
      step="0.5"
      min="50"
      max="300"
      class="flex-1 px-4 py-3 border-2 border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-blue-500 transition"
    />
    <span
      class="flex items-center px-4 py-3 bg-surface-alt rounded-lg text-text-secondary font-medium"
    >
      cm
    </span>
  </div>
  {#if height && (Number(height) < 50 || Number(height) > 300)}
    <p class="text-red-500 text-xs mt-1">{m.height_validation()}</p>
  {/if}
</div>
