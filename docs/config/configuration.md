---
nav_order: 1
---

# Configuration

All options are optional, and passed to `init()` as an object.

```HTML
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  // These are all options with their default values:
  adomonitions.init({
    root: "#content",
    triggerStyle: "github",
    theme: "default-light",
    classes: {
      wrapper: "adomonitions",
      title: "adomonitions-title",
      icon: "adomonitions-icon",
    },
  });
</script>
```

## Options reference

### `root`

**Type:** `string | Element` <br>
**Default:** `document.body`

Limits the scan to a specific element. Takes a CSS selector string or an Element reference. Only admonitions inside this element are transformed.

Useful on large pages where you don't want to scan the entire DOM.

```js
// CSS selector
adomonitions.init({ root: "#article-content" });

// Element reference
adomonitions.init({ root: document.getElementById("article-content") });
```

Throws an error if the selector matches no element.

### `triggerStyle`

**Available Options:** `"github"`, `"docusaurus"` <br>
**Default:** `"github"`

Selects which marker syntax to look for.

Both styles recognise all seven admonition types: `note`, `tip`, `important`, `info`, `warning`, `caution`, `danger`.

- **`"github"`**: Scans `<blockquote>` elements for `[!TYPE]` markers in the first `<p>`. This is the typical HTML generated when rendering GitHub Flavored Markdown (GFM) callout syntax.
  ```markdown
  > [!WARNING]
  > This is the warning text.
  ```
  - https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts

- **`"docusaurus"`**: Scans sibling `<p>` elements for `:::type` / `:::` fence pairs. This is the typical HTML generated when using the `:::type` container syntax used by Docusaurus, VitePress, VuePress and others.
  ```markdown
  :::note
  This is the note text.
  :::
  ```
  - https://docusaurus.io/docs/markdown-features/admonitions


Both styles produce identical output HTML. The visual appearance is controlled entirely by the CSS theme.

```js
adomonitions.init({ triggerStyle: "github" });

adomonitions.init({ triggerStyle: "docusaurus" });
```

### `theme`

**Available Options:** `"default-light"`, `"default-dark"`, `"default-auto"`, `"github-light"`, `"github-dark"`, `"github-auto"`, `"material"`, `"docusaurus"`, `null` <br>
**Default:** `"default-light"`

Sets the CSS theme to inject into `<head>` as a `<style>` element.

Set to `null` to skip CSS injection entirely, useful when loading a standalone CSS file via `<link>` tag or providing custom styles.

```html
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  // Use Material theme
  adomonitions.init({ theme: "material" });
</script>
```
```html
<link rel="stylesheet" href="https://example.com/my-adomonitions-theme.css">
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  // Bring your own CSS
  adomonitions.init({ theme: null });
</script>
```

An injected `<style>` element is tracked by `id="adomonitions-theme"` and a `data-theme` attribute storing the active theme name. Calling `init()` again with a different theme will automatically replace the CSS content — no need to remove the element manually.

If you manually add a `<style id="adomonitions-theme">` element (without a `data-theme` attribute), `init()` will leave it untouched.

### `classes`

```ts
{
  wrapper?:  string  // default: "adomonitions"
  title?:    string  // default: "adomonitions-title"
  icon?:     string  // default: "adomonitions-icon"
  types?: {
    note?:      string  // default: "{wrapper}-note"
    tip?:       string  // default: "{wrapper}-tip"
    important?: string  // default: "{wrapper}-important"
    info?:      string  // default: "{wrapper}-info"
    warning?:   string  // default: "{wrapper}-warning"
    caution?:   string  // default: "{wrapper}-caution"
    danger?:    string  // default: "{wrapper}-danger"
  }
}
```

Overrides the CSS class names on output elements.

Each type-specific class defaults to `{wrapper}-{type}` (e.g. `adomonitions-warning`). You can override individual types via `classes.types` without affecting the others.

```js
// Override all type classes
adomonitions.init({
  classes: {
    wrapper: "callout",
    title: "callout-title",
    icon: "callout-icon",
    types: {
      note: "callout-note",
      tip: "callout-tip",
      important: "callout-important",
      info: "callout-info",
      warning: "callout-warning",
      caution: "callout-caution",
      danger: "callout-danger",
    },
  },
});
```

The example above generates output with the following classes:

```html
<div class="callout callout-note">
  <p class="callout-title"><span class="callout-icon">...</span> Note</p>
  <p>Content...</p>
</div>
```

You can also override only specific types. Unspecified types continue to use the `{wrapper}-{type}` default:

```js
// Only override the warning type class; all others keep their defaults
adomonitions.init({
  classes: {
    wrapper: "callout",
    types: {
      warning: "callout-alert",
    },
  },
});
// Produces: <div class="callout callout-alert"> for warnings
// Produces: <div class="callout callout-note">  for notes (default)
```

> [!NOTE]
>
> If you change class names, the bundled themes will not match. Either use `theme: null` and provide your own CSS, or override only the classes you need and add corresponding CSS rules.

## Output HTML structure

Every transformed admonition produces this structure:

```html
<div class="adomonitions adomonitions-{type}" role="note|alert" aria-label="{title}" data-adomonitions="true">
  <p class="adomonitions-title">
    <span class="adomonitions-icon" aria-hidden="true"><!-- inline SVG --></span>
    {title}
  </p>
  <!-- body content (paragraphs, lists, etc.) -->
</div>
```

- **`role`**: `"note"` for note, tip, important, info; `"alert"` for warning, caution, danger
- **`data-adomonitions="true"`**: prevents double-processing on subsequent `init()` calls
- **`aria-label`**: the display title for screen readers
