import type { BmiStandard, BmiCategory } from "./types";
import { whoAdultStandard } from "./who-adult";
import { chinaAdultStandard } from "./china-adult";
import { usAdultStandard } from "./us-adult";
import { chinaElderlyStandard } from "./china-elderly";
import { chinaStudentStandard } from "./china-student";
import { whoChildStandard } from "./who-child";

const registry = new Map<string, BmiStandard>();

const allStandards: BmiStandard[] = [
  whoAdultStandard,
  chinaAdultStandard,
  usAdultStandard,
  chinaElderlyStandard,
  chinaStudentStandard,
  whoChildStandard,
];

for (const s of allStandards) {
  registry.set(s.id, s);
}

export function getStandard(id: string): BmiStandard | undefined {
  return registry.get(id);
}

export function getAllStandards(): BmiStandard[] {
  return allStandards;
}

export function getOrderedStandards(locale: string): BmiStandard[] {
  const sorted = [...allStandards].sort(
    (a, b) => (a.localeOrder[locale] ?? 99) - (b.localeOrder[locale] ?? 99)
  );
  return sorted;
}

export function getDefaultStandardId(locale: string): string {
  return locale.startsWith("zh") ? "china-adult" : "who-adult";
}

const categories: BmiCategory[] = ["student", "adult", "senior"];

export function getCategories(): BmiCategory[] {
  return categories;
}

export function getStandardsByCategory(category: BmiCategory, locale: string): BmiStandard[] {
  const filtered = allStandards.filter((s) => s.category === category);
  return filtered.sort((a, b) => (a.localeOrder[locale] ?? 99) - (b.localeOrder[locale] ?? 99));
}
