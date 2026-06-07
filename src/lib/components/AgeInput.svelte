<script lang="ts">
  import { m } from "$lib/paraglide/messages";

  let {
    age = $bindable(""),
  }: {
    age: number | string;
  } = $props();
</script>

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
