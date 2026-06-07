# Changelog

## [5.3.0] — 2026-06-08

### Tests

- **Push test coverage above 80%** — Statements 78.61% → 87.24%, Branches 66.83% → 81.7%. Add 11 new test files and 68 new tests (208 total).
- Cover 4 Phase-1 low-hanging-fruit targets (`+layout.ts`, `hooks.ts`, `Header.svelte`, `theme.svelte.ts`) to cross the 80% threshold.
- Add component tests for `ThemeToggle`, `AgeInput`, `GradeInput`, `CategorySelector`, `StandardSwitcher`, `SemicircleGauge`, and `hooks.server.ts`.
- Fill branch gaps in `gauge-math` (zoomed-in edge cases, dark mode), `LanguageSwitcher` (en locale), `ResultCard` (dark mode textColor), and all 5 standards (null-guard edge cases).
- Add `textColorDark?` optional field to `BmiLevel` for dark-mode-aware rendering.

## [5.2.0] — 2026-06-07

### Architecture

- **Remove shallow barrel** (`src/lib/constants.ts`) — callers import from source modules directly. Remove dead `calculateSegmentWidths`/`calculateBarPosition` exports from `bmi.ts`.
- **Extract `computeVisibleRange` and `buildTicks` from `computeGaugeData`** — untangle zoom-range computation, segment building, and tick construction into separate functions. Fix tick label bug where extrapolated values appeared instead of segment boundary values when zoomed in.
- **Extract Healthy Weight Range module** (`src/lib/healthy-weight-range.ts`) — inline 4-hop derived chain in `+page.svelte` replaced by a single function call. Domain concept now declared as a real module.
- **Split `ConditionalInputs` into 4 focused components** — `CategorySelector`, `StandardSwitcher`, `GradeInput`, `AgeInput`. No component imports `china-student` types except `GradeInput`.

### Tests

- Add 10 new tests: 6 for Healthy Weight Range edge cases, 4 for gauge tick label correctness in zoomed/non-zoomed states. 140 total tests across 14 test files.

## [5.1.0] — 2026-06-02

### Miscellaneous

- Bump minor version with no functional changes.

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

[5.3.0]: https://github.com/cup113/BMI-Calculator/releases/tag/v5.3.0
[5.2.0]: https://github.com/cup113/BMI-Calculator/releases/tag/v5.2.0
[5.1.0]: https://github.com/cup113/BMI-Calculator/releases/tag/v5.1.0
[5.0.0]: https://github.com/cup113/BMI-Calculator/releases/tag/v5.0.0
