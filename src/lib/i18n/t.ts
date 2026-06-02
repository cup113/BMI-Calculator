import { m } from "$lib/paraglide/messages";

export function t(key: string): string {
  const fn = (m as Record<string, () => string>)[key];
  return fn ? fn() : key;
}
