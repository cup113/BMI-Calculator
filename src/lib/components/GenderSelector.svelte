<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { t } from "$lib/i18n/t";
  import type { Gender } from "$lib/standards/types";

  let { gender = $bindable("male") }: {
    gender: Gender;
  } = $props();
</script>

<div class="mb-6">
  <div class="block text-sm font-semibold text-text-primary mb-3">
    {m.gender()}
  </div>
  <div class="flex gap-3">
    <button
      onclick={() => (gender = "male")}
      class="flex-1 py-3 px-4 rounded-lg font-medium transition {gender === 'male'
        ? 'bg-blue-500 text-white shadow-md'
        : 'bg-surface-alt text-text-primary hover:bg-surface-hover'}"
    >
      {m.gender_male()}
    </button>
    <button
      onclick={() => (gender = "female")}
      class="flex-1 py-3 px-4 rounded-lg font-medium transition {gender === 'female'
        ? 'bg-pink-500 text-white shadow-md'
        : 'bg-surface-alt text-text-primary hover:bg-surface-hover'}"
    >
      {m.gender_female()}
    </button>
  </div>
</div>
