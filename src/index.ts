/**
 * Main entry point for aDOMonitions.
 *
 * Wires together config resolution, CSS injection, and DOM scanning.
 *
 * @module
 */

import type { ADOMonitionsConfig, ResolvedConfig } from "./types.js";
import { DEFAULTS, DEFAULT_CLASSES, ADMONITION_TYPES } from "./types.js";
import { injectCSS } from "./css-injector.js";
import { scan } from "./scanner.js";

/**
 * Merges user-provided options with defaults and resolves the `root` element.
 *
 * @param options - User-provided configuration, or `undefined` for all defaults.
 * @returns A fully resolved configuration object.
 * @throws If `root` is a CSS selector string that matches no element.
 */
function resolveConfig(options?: ADOMonitionsConfig): ResolvedConfig {
  const triggerStyle = options?.triggerStyle ?? DEFAULTS.triggerStyle;
  const theme = options?.theme === undefined ? DEFAULTS.theme : options.theme;
  const wrapper = options?.classes?.wrapper ?? DEFAULT_CLASSES.wrapper;
  const userTypes = options?.classes?.types ?? {};
  const types = Object.fromEntries(
    ADMONITION_TYPES.map((t) => [t, userTypes[t] ?? `${wrapper}-${t}`]),
  ) as Record<(typeof ADMONITION_TYPES)[number], string>;
  const classes = {
    wrapper,
    title: options?.classes?.title ?? DEFAULT_CLASSES.title,
    icon: options?.classes?.icon ?? DEFAULT_CLASSES.icon,
    types,
  };

  let root: Element;
  if (options?.root == null) {
    root = document.body;
  } else if (typeof options.root === "string") {
    const el = document.querySelector(options.root);
    if (!el) {
      throw new Error(
        `aDOMonitions: root selector "${options.root}" matched no element`,
      );
    }
    root = el;
  } else {
    root = options.root;
  }

  return { root, triggerStyle, classes, theme };
}

/**
 * Initializes aDOMonitions: injects the CSS theme (if configured) and scans
 * the DOM for admonition markers, transforming them into styled callout boxes.
 *
 * @param options - Optional configuration. See {@link ADOMonitionsConfig}.
 */
export function init(options?: ADOMonitionsConfig): void {
  const config = resolveConfig(options);

  if (config.theme !== null) {
    injectCSS(config.theme);
  }

  scan(config);
}

export type {
  ADOMonitionsConfig,
  ADOMonitionsClasses,
  ThemeName,
} from "./types.js";
