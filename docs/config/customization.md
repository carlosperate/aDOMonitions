---
nav_order: 2
---

# Customisation

## CSS custom properties

All bundled themes use two CSS custom properties per admonition type:

```css
.adomonitions-note {
  --adomonitions-color: #1f6feb; /* border + title colour */
  --adomonitions-bg: #ddf4ff;    /* background colour */
}
```

Override these to change colours without replacing the entire theme:

```css
.adomonitions-warning {
  --adomonitions-color: #d4380d;
  --adomonitions-bg: #fff7e6;
}
```

## Bring your own CSS

Set `theme: null` to disable automatic CSS injection:

```js
adomonitions.init({ theme: null });
```

Then either use a standalone CSS file from the npm package via `<link>`:

```html
<link rel="stylesheet" href="node_modules/adomonitions/dist/themes/core.css" />
<link rel="stylesheet" href="node_modules/adomonitions/dist/themes/default-light.css" />
```

Or write fully custom CSS targeting the output classes:

```css
.adomonitions {
  padding: 1em;
  border-left: 4px solid var(--adomonitions-color);
  background: var(--adomonitions-bg);
}
.adomonitions-title {
  font-weight: bold;
  color: var(--adomonitions-color);
}
```

### Standalone CSS files

The npm package `themes/` directory (or `dist/themes/` in the built project) contains individual CSS files that can be loaded independently:

| File                | Purpose |
|---------------------|---------|
| `core.css`          | Structural layout (flexbox, spacing, custom property wiring), always needed |
| `default-light.css` | Tinted background + rounded corners, light,  **default** |
| `default-dark.css`  | Tinted background + rounded corners, dark |
| `default-auto.css`  | Light + dark with `prefers-color-scheme` media queries + light fallback |
| `github-light.css`  | GitHub callout style (transparent bg, no radius), light |
| `github-dark.css`   | GitHub callout style (transparent bg, no radius), dark |
| `github-auto.css`   | GitHub style light + dark with `prefers-color-scheme` + light fallback |
| `material.css`      | Material Design colours + style overrides (shadow, uppercase title) |
| `docusaurus.css`    | Docusaurus/Infima colours + style overrides (thick border, larger icons) |

When using standalone files, always include `core.css` alongside a colour theme. The bundled JS themes include core automatically.

These files can be imported in package-aware environments:

```js
import "adomonitions/themes/core.css";
import "adomonitions/themes/material.css";
```

## Dark mode

### Using `default-auto` or `github-auto`

The `default-auto` and `github-auto` themes use `prefers-color-scheme` media queries to switch between light and dark colours based on the OS setting:

```js
adomonitions.init({ theme: "default-auto" });
// or
adomonitions.init({ theme: "github-auto" });
```

This responds to the operating system preference only. It does not respond to JavaScript-based theme toggles (e.g. a dark mode button on your site).

### Manual dark mode toggle

For sites with a JS-based theme toggle, use `theme: null` and swap CSS classes or stylesheets yourself:

```js
adomonitions.init({ theme: null });

// Your toggle logic adds/removes a class on <html> or <body>
// Then scope the admonition colours accordingly:
```

```css
/* Light */
.adomonitions-note {
  --adomonitions-color: #1f6feb;
  --adomonitions-bg: #ddf4ff;
}

/* Dark — scoped under your toggle class */
.dark .adomonitions-note {
  --adomonitions-color: #4493f8;
  --adomonitions-bg: #121d2f;
}
```

### Switching themes dynamically

Calling `init()` with a different theme automatically replaces the CSS — no manual DOM removal needed:

```js
// Initial setup
adomonitions.init({ theme: "default-light" });

// Later, switch to dark
adomonitions.init({ theme: "default-dark" });
```

The injected `<style>` element tracks the active theme via a `data-theme` attribute. Same-theme calls are idempotent (no DOM changes).

## Custom class names

Override output class names to integrate with an existing design system:

```js
adomonitions.init({
  theme: null,
  classes: {
    wrapper: "my-callout",
    title: "my-callout-header",
    icon: "my-callout-icon",
  },
});
```

The wrapper class is also used as a prefix for the type modifier: `my-callout my-callout-warning`.

## Styling individual types

Target specific admonition types using the type class:

```css
/* Only style danger admonitions differently */
.adomonitions-danger {
  border-width: 4px;
  font-weight: bold;
}

/* Hide the icon on tip admonitions */
.adomonitions-tip .adomonitions-icon {
  display: none;
}
```

## Overriding icons

Icons are inline SVGs inside the `.adomonitions-icon` span. To replace them with CSS:

```css
/* Hide the default SVG */
.adomonitions-note .adomonitions-icon svg {
  display: none;
}

/* Add your own icon via background or ::before */
.adomonitions-note .adomonitions-icon::before {
  content: "i";
  font-weight: bold;
  font-size: 1.2em;
}
```
