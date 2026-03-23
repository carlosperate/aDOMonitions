/**
 * CSS theme injection.
 *
 * Injects a bundled CSS theme as a `<style>` tag in `<head>`.
 * Checks for an existing tag to avoid duplicates.
 *
 * @module
 */

import type { ThemeName } from "./types.js";
import { getThemeCSS } from "./themes/index.js";

/** ID used on the injected `<style>` element for duplicate detection. */
const STYLE_ID = "adomonitions-theme";

/**
 * Injects the CSS for the given theme into the document `<head>` as a
 * `<style id="adomonitions-theme">` element. Skips injection if the
 * style element already exists (prevents duplicates).
 *
 * @param theme - The name of the bundled theme to inject.
 */
export function injectCSS(theme: ThemeName): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = getThemeCSS(theme);
  document.head.appendChild(style);
}
