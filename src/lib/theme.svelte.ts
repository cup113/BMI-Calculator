const isBrowser = typeof window !== "undefined";
const hasDocument = typeof document !== "undefined";

function getInitial(): "light" | "dark" {
  if (isBrowser) {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch {
      // localStorage or matchMedia unavailable (e.g., test environment)
    }
  }
  return "light";
}

export const theme = $state({ value: getInitial() as "light" | "dark" });

if (hasDocument) {
  document.documentElement.classList.toggle("dark", theme.value === "dark");
}

export function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
  if (isBrowser) localStorage.setItem("theme", theme.value);
  if (hasDocument) document.documentElement.classList.toggle("dark", theme.value === "dark");
}
