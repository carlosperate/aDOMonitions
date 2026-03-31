/**
 * Vitest setup: mocks src/themes/index.js so that CSS imports return real
 * file content instead of the empty strings Vite produces in jsdom.
 */

import { vi } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

function readCSS(filename: string): string {
  const raw = readFileSync(resolve("src/themes", filename), "utf-8");
  return raw.replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

const coreCSS = readCSS("core.css");
const defaultLight = readCSS("default-light.css");
const defaultDark = readCSS("default-dark.css");
const githubLight = readCSS("github-light.css");
const githubDark = readCSS("github-dark.css");
const materialCSS = readCSS("material.css");
const docusaurusCSS = readCSS("docusaurus.css");

const defaultAuto =
  `@media (prefers-color-scheme: light) {\n${defaultLight}\n}\n` +
  `@media (prefers-color-scheme: dark) {\n${defaultDark}\n}\n` +
  defaultLight;

const githubAuto =
  `@media (prefers-color-scheme: light) {\n${githubLight}\n}\n` +
  `@media (prefers-color-scheme: dark) {\n${githubDark}\n}\n` +
  githubLight;

const themes: Record<string, string> = {
  "default-light": defaultLight,
  "default-dark": defaultDark,
  "default-auto": defaultAuto,
  "github-light": githubLight,
  "github-dark": githubDark,
  "github-auto": githubAuto,
  material: materialCSS,
  docusaurus: docusaurusCSS,
};

vi.mock("../src/themes/index.js", () => ({
  coreCSS,
  getThemeCSS: (name: string) => themes[name] ?? "",
}));
