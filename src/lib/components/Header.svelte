<script lang="ts">
  import favicon from "$lib/assets/favicon.ico";
  import { m } from "$lib/paraglide/messages";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";
</script>

<nav class="sticky top-0 z-10 bg-surface/80 backdrop-blur border-b border-border">
  <div class="max-w-md mx-auto flex items-center justify-between px-4 py-2">
    <div class="flex items-center gap-2">
      <img src={favicon} class="w-7 h-7" alt="" />
      <span class="font-bold text-text-primary text-lg">{m.app_title()}</span>
    </div>
    <div class="flex items-center gap-1">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  </div>
</nav>
