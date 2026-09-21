"use client";

import { Moon, Sun } from "lucide-react";

export const THEME_STORAGE_KEY = "samrin_theme";

/**
 * Light / dark switch. Both icons are always rendered and CSS (`dark:`) shows the right one, so
 * server and client markup match. The theme itself is applied before paint by the inline script
 * in layout.tsx, so there is no flash.
 */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // storage unavailable: the choice simply lasts for this visit
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      title="Switch between light and dark mode"
      className="text-ink hover:bg-surface-3 grid size-11 place-items-center rounded-full transition-colors"
    >
      <Sun aria-hidden className="hidden size-5 dark:block" strokeWidth={1.7} />
      <Moon aria-hidden className="size-5 dark:hidden" strokeWidth={1.7} />
    </button>
  );
}
