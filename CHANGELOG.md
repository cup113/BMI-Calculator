# Changelog

## [5.0.0] — 2026-06-02

### Migration

- **Migrate from Vue 3 to Svelte 5 with SvelteKit** — complete architectural rewrite using Svelte Runes (`$state`, `$derived`, `$props`), Tailwind CSS v4, and static site generation.

### Features

- **i18n and multi-standard BMI classification** — English and Chinese locales with 5 authoritative standards across 3 life stages (Student, Adult, Senior), gender- and grade-aware thresholds for Chinese students.
- **Umami analytics** — privacy-respecting analytics integration.
- **Data sources section** — expandable section with official BMI standard references.
- **Privacy notice** — emphasize local-only BMI calculation with no data transmission.

### Refactors

- **Replace dropdown pickers with inline pills** — more intuitive standard/category selection.
- **Animated gauge needle** — semicircle gauge with smooth needle animation and zoom-to-level.
- **Simplify BMI calculator UI** — remove health advice section and recalculate button from results view; remove unused code.

### Build

- **SvelteKit static prerendering** — configure `prerender = true` with `adapter-static` and single-bundle strategy.

### Tests

- **Vitest unit testing** — 40 unit tests covering all core BMI calculation, threshold lookup, classification, and position logic.

[5.0.0]: https://github.com/cup113/BMI-Calculator/releases/tag/v5.0.0
