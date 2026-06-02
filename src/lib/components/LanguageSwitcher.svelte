<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { getLocale, localizeHref } from "$lib/paraglide/runtime";
</script>

<div class="flex justify-center gap-2">
  <a
    href={localizeHref("/", { locale: "zh-CN" })}
    data-sveltekit-reload
    class="px-3 py-1 text-sm rounded-md font-medium transition {getLocale() === 'zh-CN'
      ? 'bg-blue-500 text-white'
      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}"
  >
    {m.lang_zh()}
  </a>
  <a
    href={localizeHref("/", { locale: "en" })}
    data-sveltekit-reload
    class="px-3 py-1 text-sm rounded-md font-medium transition {getLocale() === 'en'
      ? 'bg-blue-500 text-white'
      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}"
  >
    {m.lang_en()}
  </a>
</div>
