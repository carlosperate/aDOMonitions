// Main entry point: init() wires together config resolution, CSS injection, and DOM scanning.

import type { ADOMonitionsConfig, ResolvedConfig } from './types.js';
import { DEFAULTS, DEFAULT_CLASSES } from './types.js';
import { injectCSS } from './css-injector.js';
import { scan } from './scanner.js';

function resolveConfig(options?: ADOMonitionsConfig): ResolvedConfig {
  const triggerStyle = options?.triggerStyle ?? DEFAULTS.triggerStyle;
  const theme = options?.theme === undefined ? DEFAULTS.theme : options.theme;
  const classes = {
    wrapper: options?.classes?.wrapper ?? DEFAULT_CLASSES.wrapper,
    title: options?.classes?.title ?? DEFAULT_CLASSES.title,
    icon: options?.classes?.icon ?? DEFAULT_CLASSES.icon,
  };

  let root: Element;
  if (options?.root == null) {
    root = document.body;
  } else if (typeof options.root === 'string') {
    const el = document.querySelector(options.root);
    if (!el) {
      throw new Error(`aDOMonitions: root selector "${options.root}" matched no element`);
    }
    root = el;
  } else {
    root = options.root;
  }

  return { root, triggerStyle, classes, theme };
}

export function init(options?: ADOMonitionsConfig): void {
  const config = resolveConfig(options);

  if (config.theme !== null) {
    injectCSS(config.theme);
  }

  scan(config);
}

export type { ADOMonitionsConfig, ADOMonitionsClasses, ThemeName } from './types.js';
