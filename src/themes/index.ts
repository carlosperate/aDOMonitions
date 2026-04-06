/**
 * Theme CSS strings, imported at build time and inlined in the bundle.
 * Comments are stripped by the Rollup cssString plugin at build time.
 * Also available as standalone `.css` files in `dist/themes/`.
 *
 * @module
 */

import type { ThemeName } from "../types.js";
import core from "./core.css";
import defaultLight from "./default-light.css";
import defaultDark from "./default-dark.css";
import githubLight from "./github-light.css";
import githubDark from "./github-dark.css";
import material from "./material.css";
import docusaurus from "./docusaurus.css";

/** Structural CSS that is always needed (layout, flexbox, custom property wiring). */
export const coreCSS: string = core;

/**
 * Composes default-auto from the default light and dark theme strings,
 * avoiding a third copy of the same color definitions in the bundle.
 * The standalone `default-auto.css` file in `dist/themes/` is still
 * available for users who prefer a `<link>` tag.
 */
const defaultAuto =
  defaultLight +
  `\n@media (prefers-color-scheme: light) {\n${defaultLight}\n}\n` +
  `@media (prefers-color-scheme: dark) {\n${defaultDark}\n}`;

/**
 * Composes github-auto from the github light and dark theme strings,
 * avoiding a third copy of the same color definitions in the bundle.
 * The standalone `github-auto.css` file in `dist/themes/` is still
 * available for users who prefer a `<link>` tag.
 */
const githubAuto =
  githubLight +
  `\n@media (prefers-color-scheme: light) {\n${githubLight}\n}\n` +
  `@media (prefers-color-scheme: dark) {\n${githubDark}\n}`;

/** Map of theme names to their CSS string content (colors + optional style overrides). */
const themes: Record<ThemeName, string> = {
  "default-light": defaultLight,
  "default-dark": defaultDark,
  "default-auto": defaultAuto,
  "github-light": githubLight,
  "github-dark": githubDark,
  "github-auto": githubAuto,
  material: material,
  docusaurus: docusaurus,
};

/**
 * Returns the CSS string for the given bundled theme.
 *
 * @param name - The theme name.
 * @returns The CSS content as a string.
 */
export function getThemeCSS(name: ThemeName): string {
  return themes[name];
}
