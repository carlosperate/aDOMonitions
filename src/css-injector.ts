/**
 * CSS theme injection.
 *
 * Injects a bundled CSS theme as a `<style>` tag in `<head>`.
 * Tracks the active theme via a `data-theme` attribute to support
 * switching themes without manual DOM removal.
 *
 * @module
 */

import type { ThemeName } from "./types.js";
import { coreCSS, getThemeCSS } from "./themes/index.js";

/** ID used on the injected `<style>` element for duplicate detection. */
const STYLE_ID = "adomonitions-theme";

/** Data attribute storing the active theme name on the `<style>` element. */
const THEME_ATTR = "data-theme";

/**
 * Injects core structural CSS and the selected theme's color CSS into
 * the document `<head>` as a single `<style id="adomonitions-theme">`
 * element.
 *
 * - If no style element exists, creates one.
 * - If one exists with a different `data-theme`, replaces its content.
 * - If one exists with the same `data-theme`, does nothing (idempotent).
 * - If one exists without `data-theme` (manually added), leaves it alone.
 *
 * @param theme - The name of the bundled theme to inject.
 */
export function injectCSS(theme: ThemeName): void {
  const existing = document.getElementById(STYLE_ID);

  if (existing) {
    // Manually added style (no data-theme attr), don't touch it
    if (!existing.hasAttribute(THEME_ATTR)) return;

    // Same theme already active, nothing to do
    if (existing.getAttribute(THEME_ATTR) === theme) return;

    // Different theme, replace content
    existing.textContent = coreCSS + "\n" + getThemeCSS(theme);
    existing.setAttribute(THEME_ATTR, theme);
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.setAttribute(THEME_ATTR, theme);
  style.textContent = coreCSS + "\n" + getThemeCSS(theme);
  document.head.appendChild(style);
}
