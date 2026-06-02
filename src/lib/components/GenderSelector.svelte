<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { Gender } from "$lib/standards/types";

  function t(key: string): string {
    const fn = (m as Record<string, () => string>)[key];
    return fn ? fn() : key;
  }

  let { gender = $bindable("male") }: {
    gender: Gender;
  } = $props();
</script>

<div class="mb-6">
  <div class="block text-sm font-semibold text-slate-700 mb-3">
    {m.gender()}
  </div>
  <div class="flex gap-3">
    <button
      onclick={() => (gender = "male")}
      class="flex-1 py-3 px-4 rounded-lg font-medium transition {gender === 'male'
        ? 'bg-blue-500 text-white shadow-md'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
    >
      {m.gender_male()}
    </button>
    <button
      onclick={() => (gender = "female")}
      class="flex-1 py-3 px-4 rounded-lg font-medium transition {gender === 'female'
        ? 'bg-pink-500 text-white shadow-md'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
    >
      {m.gender_female()}
    </button>
  </div>
</div>
