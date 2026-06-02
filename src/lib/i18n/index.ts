import { getLocale, setLocale } from "$lib/paraglide/runtime";

export function setI18nLocale(localeStr: string) {
  setLocale(localeStr as Parameters<typeof setLocale>[0]);
  if (typeof document !== "undefined") {
    document.documentElement.lang = localeStr;
  }
}

export function getI18nLocale(): string {
  return getLocale();
}
