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

**Type:** `string | Element`
**Default:** `document.body`

Limits the scan to a specific element. Takes a CSS selector string or an Element reference. Only admonitions inside this element are transformed.

Useful on large pages where you don't want to scan the entire DOM.

```js
// CSS selector
adomonitions.init({ root: "#article-content" });

// Element reference
const el = document.getElementById("article-content");
adomonitions.init({ root: el });
```

Throws an error if the selector matches no element.

### `triggerStyle`

**Type:** `"github" | "docusaurus"`
**Default:** `"github"`

Selects which marker syntax to look for.

Both styles recognise all seven admonition types: `note`, `tip`, `important`, `info`, `warning`, `caution`, `danger`.

- **`"github"`** — Scans `<blockquote>` elements for `[!TYPE]` markers in the first `<p>`. This is the typical HTML generated when using the Admonition syntax GitHub uses in Markdown.
  ```markdown
  > [!WARNING]
  > This is the warning text.
  ```
  - https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts

- **`"docusaurus"`** — Scans sibling `<p>` elements for `:::type` / `:::` fence pairs. This is the typical HTML generated when using the Admonition syntax Docusaurus uses in Markdown.
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

**Type:** `"default-light" | "default-dark" | "default-auto" | "github-light" | "github-dark" | "github-auto" | "material" | "docusaurus" | null`
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

The injected `<style>` element is tracked by `id="adomonitions-theme"` and a `data-theme` attribute storing the active theme name. Calling `init()` again with a different theme will automatically replace the CSS content — no need to remove the element manually. Calling `init()` with the same theme is a no-op (idempotent).

If you manually add a `<style id="adomonitions-theme">` element (without a `data-theme` attribute), `init()` will leave it untouched.

### `classes`

**Type:** `{ wrapper?: string; title?: string; icon?: string }`
**Default:** `{ wrapper: "adomonitions", title: "adomonitions-title", icon: "adomonitions-icon" }`

Overrides the CSS class names on output elements. The wrapper class is also used as a prefix for the type-specific class (e.g. `adomonitions-warning`).

```js
adomonitions.init({
  classes: {
    wrapper: "callout",   // Output: <div class="callout callout-warning">
    title: "callout-hd",
    icon: "callout-icon",
  },
});
```

Note: if you change class names, the bundled themes will not match. Either use `theme: null` and provide your own CSS, or override only the classes you need and add corresponding CSS rules.

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
