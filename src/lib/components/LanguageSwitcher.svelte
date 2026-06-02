<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { getLocale, localizeHref } from "$lib/paraglide/runtime";
</script>

<div class="flex gap-1">
  <a
    href={localizeHref("/", { locale: "zh-CN" })}
    data-sveltekit-reload
    class="px-2 py-1 text-sm rounded-md font-medium transition {getLocale() === 'zh-CN'
      ? 'bg-blue-500 text-white'
      : 'bg-surface-hover text-text-secondary hover:bg-blue-100 dark:hover:bg-blue-900/40'}"
  >
    {m.lang_zh()}
  </a>
  <a
    href={localizeHref("/", { locale: "en" })}
    data-sveltekit-reload
    class="px-2 py-1 text-sm rounded-md font-medium transition {getLocale() === 'en'
      ? 'bg-blue-500 text-white'
      : 'bg-surface-hover text-text-secondary hover:bg-blue-100 dark:hover:bg-blue-900/40'}"
  >
    {m.lang_en()}
  </a>
</div>
