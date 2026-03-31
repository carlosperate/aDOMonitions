/**
 * Test helpers that read CSS files from disk, bypassing Vite's CSS pipeline
 * which returns empty strings in the jsdom test environment.
 *
 * Applies the same comment-stripping transform as the Rollup cssString plugin
 * so the values match what ends up in the JS bundle at build time.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

function readCSS(filename: string): string {
  const raw = readFileSync(resolve("src/themes", filename), "utf-8");
  return raw.replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

export const expectedCoreCSS = readCSS("core.css");
export const expectedThemeCSS: Record<string, string> = {
  "default-light": readCSS("default-light.css"),
  "default-dark": readCSS("default-dark.css"),
  "github-light": readCSS("github-light.css"),
  "github-dark": readCSS("github-dark.css"),
  material: readCSS("material.css"),
  docusaurus: readCSS("docusaurus.css"),
};
