# BMI Calculator

[![GitHub last commit](https://img.shields.io/github/last-commit/cup113/BMI-Calculator?style=flat-square)](https://github.com/cup113/BMI-Calculator/commits)
[![Version](https://img.shields.io/github/v/release/cup113/BMI-Calculator?style=flat-square)](https://github.com/cup113/BMI-Calculator/releases)
[![Svelte](https://img.shields.io/badge/Svelte-5-orange?style=flat-square)](https://svelte.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square)](https://tailwindcss.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/42426761-a58f-496b-b013-13290e291495/deploy-status)](https://app.netlify.com/projects/bmi-calculator-c/deploys)

A privacy-first, client-side BMI calculator that classifies a person's Body Mass Index against multiple authoritative standards (WHO, China Ministry of Health/Education), adapting to the person's life stage and locale.

> BMI 计算器 —— 分龄分性别、多标准评估的健康体重指数计算器，纯前端无数据上传。

## Features

- **Multi-standard classification** — 5 authoritative standards across 3 life stages (Student / Adult / Senior)
- **Age- and gender-specific** — gender-differentiated thresholds for student & child standards; grade-aware for Chinese students
- **Visual gauge** — semicircle gauge with animated needle, color-coded segments, and zoom-to-level for precision reading
- **Healthy weight range** — derived normal weight range for your height, displayed in your chosen unit
- **Dual-unit weight input** — kg / 斤 (jin) for zh locale, kg / lb for en locale, with real-time conversion
- **i18n** — English and Chinese (Simplified) with inlang/paraglide
- **Privacy-first** — all computation is client-side; no data is collected, stored, or transmitted

## Standards

| Category | Locale | Standard | Levels | Authority |
|----------|--------|----------|-------|-----------|
| Student | zh | China Student | 4 (underweight / normal / overweight / obese) | Ministry of Education, 2014 Revision |
| Student | en | WHO Child (5–19y) | 5 (severe thinness / thinness / normal / overweight / obese) | WHO Growth Reference |
| Adult | zh | China Adult | 4 (underweight / normal / overweight / obese) | WS/T 428-2013 |
| Adult | en | WHO Adult | 6 (underweight / normal / pre-obesity / obese class I / II / III) | WHO BMI Classification |
| Senior | both | China Elderly | 3 (underweight / normal / overweight–obese) | WS/T 428-2013 |

Each standard faithfully reflects its source document — level counts and thresholds are not normalized across standards.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | [Svelte 5](https://svelte.dev) (Runes — `$state`, `$derived`, `$effect`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Testing | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) |
| i18n | [inlang/paraglide-js](https://inlang.com) |
| Adapter | [@sveltejs/adapter-static](https://kit.svelte.dev/docs/adapter-static) |
| Package manager | [pnpm](https://pnpm.io) |

## Getting Started

```bash
git clone https://github.com/cup113/BMI-Calculator.git
cd BMI-Calculator
pnpm install
pnpm dev          # start dev server at http://localhost:5173
pnpm build        # production build → build/
pnpm test         # run tests
pnpm check        # type-check with svelte-check
```

### Test

```bash
pnpm test          # vitest run
pnpm test:watch    # vitest watch mode
pnpm coverage      # run with coverage report
```

## Data Sources

- **China Student Standard** — *National Student Physical Fitness Standard (2014 Revision)*, Ministry of Education
- **China Adult & Elderly Standards** — *WS/T 428-2013: Criteria of Weight for Adults*, National Health Commission
- **WHO Adult Standard** — *WHO BMI Classification*, World Health Organization
- **WHO Child Standard** — *WHO Growth Reference (5–19 years)*, World Health Organization

## Privacy

This website does not collect, store, or transmit any personal information. All BMI calculations are performed locally in your browser.

## Deployment

```bash
pnpm build
```

Static files are output to the `build/` directory, ready for deployment to GitHub Pages, Vercel, Netlify, or any static host.

## License

[Apache-2.0](LICENSE)
