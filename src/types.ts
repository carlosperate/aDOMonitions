/** All admonition type identifiers. Supported by both trigger styles. */
export type AdmonitionType =
  | "note"
  | "tip"
  | "important"
  | "info"
  | "warning"
  | "caution"
  | "danger";

/** Configurable CSS class names for the output HTML. */
export interface ADOMonitionsClasses {
  /** Class applied to the wrapper div. Also used as prefix for type class. Default: 'adomonitions' */
  wrapper?: string;
  /** Class applied to the title paragraph. Default: 'adomonitions-title' */
  title?: string;
  /** Class applied to the icon span. Default: 'adomonitions-icon' */
  icon?: string;
  /** Per-type class applied to the wrapper div alongside the wrapper class. Defaults to `{wrapper}-{type}`. */
  types?: Partial<Record<AdmonitionType, string>>;
}

/** Available bundled themes. Set to null to bring your own CSS. */
export type ThemeName =
  | "default-light"
  | "default-dark"
  | "default-auto"
  | "github-light"
  | "github-dark"
  | "github-auto"
  | "material"
  | "docusaurus";

/** Configuration options for init(). All fields are optional. */
export interface ADOMonitionsConfig {
  /** CSS selector or Element to scope scanning. Default: document.body */
  root?: string | Element;
  /** Parser / trigger style. Default: 'github' */
  triggerStyle?: "github" | "docusaurus";
  /** Output HTML class names. */
  classes?: ADOMonitionsClasses;
  /** Bundled CSS theme to inject. null = bring your own. Default: 'github-light' */
  theme?: ThemeName | null;
}

/** Resolved config with all defaults applied. */
export interface ResolvedConfig {
  root: Element;
  triggerStyle: "github" | "docusaurus";
  classes: {
    wrapper: string;
    title: string;
    icon: string;
    types: Record<AdmonitionType, string>;
  };
  theme: ThemeName | null;
}

/** All admonition type identifiers as a runtime array (mirrors the AdmonitionType union). */
export const ADMONITION_TYPES: readonly AdmonitionType[] = [
  "note",
  "tip",
  "important",
  "info",
  "warning",
  "caution",
  "danger",
];

/** Default class names (excluding type classes, which depend on the resolved wrapper). */
export const DEFAULT_CLASSES = {
  wrapper: "adomonitions",
  title: "adomonitions-title",
  icon: "adomonitions-icon",
};

/** Default per-type class names, computed from the default wrapper prefix. */
export const DEFAULT_TYPE_CLASSES: Record<AdmonitionType, string> = {
  note: "adomonitions-note",
  tip: "adomonitions-tip",
  important: "adomonitions-important",
  info: "adomonitions-info",
  warning: "adomonitions-warning",
  caution: "adomonitions-caution",
  danger: "adomonitions-danger",
};

/** Default configuration values. */
export const DEFAULTS = {
  triggerStyle: "github" as const,
  theme: "default-light" as ThemeName,
  classes: DEFAULT_CLASSES,
};

/** ARIA roles by admonition type. Informational types get "note", alerting types get "alert". */
export const ARIA_ROLES: Record<AdmonitionType, string> = {
  note: "note",
  tip: "note",
  important: "note",
  info: "note",
  warning: "alert",
  caution: "alert",
  danger: "alert",
};

/** Default titles by admonition type (title-cased). */
export const DEFAULT_TITLES: Record<AdmonitionType, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  info: "Info",
  warning: "Warning",
  caution: "Caution",
  danger: "Danger",
};
