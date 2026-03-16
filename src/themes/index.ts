// Theme CSS strings, imported at build time and inlined in the bundle.
// Also available as standalone .css files in dist/themes/.

import type { ThemeName } from '../types.js';

// TODO: Import actual CSS files in Phase 7
// import githubLight from './github-light.css';
// import githubDark from './github-dark.css';
// import githubAuto from './github-auto.css';
// import material from './material.css';
// import docusaurus from './docusaurus.css';

const themes: Record<ThemeName, string> = {
  'github-light': '',
  'github-dark': '',
  'github-auto': '',
  'material': '',
  'docusaurus': '',
};

export function getThemeCSS(name: ThemeName): string {
  return themes[name] ?? '';
}
