# aDOMonitions

Styled admonition callouts, converted on page load, for static site generators
whose Markdown renderer doesn't support them.

## What is this?

This JavaScript library scans the DOM for Admonition markers in HTML generated
by a static site generator without built-in admonition support.

Admonitions are highlighted callout boxes, like "Note", "Warning", "Tip", etc;
used to draw attention to important content.
Normally Markdown renderers only support these via build-time plugins,
so without these plugins, the markers end up as plain text in the HTML.

aDOMonitions can look for either GitHub-style or Docusaurus-style markers.
When it finds them, it transforms the corresponding HTML into styled,
accessible callout boxes with icons, colours, and ARIA roles.

For example, a GitHub style Markdown Admonition:

```markdown
> [!WARNING]
> This will delete all data.
```

Is likely converted to this raw HTML by static site generators without
built-in admonition support:

```html
<blockquote>
  <p>[!WARNING]</p>
  <p>This will delete all data.</p>
</blockquote>
```

Running aDOMonitions transforms that HTML into this styled callout box,
with accompanying CSS for colours, layout, and an icon:

```html
<div class="adomonitions adomonitions-warning" role="alert" aria-label="Warning">
  <p class="adomonitions-title">
    <span class="adomonitions-icon" aria-hidden="true"><!-- SVG --></span> Warning
  </p>
  <p>This will delete all data.</p>
</div>
```

![Rendered callout box](docs/img/admonition-warning.png)

## Install and run

```bash
npm install adomonitions
```
```js
import { init } from "adomonitions";
init(); 
```

Or load via a `<script>` tag (UMD):

```html
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  adomonitions.init();
</script>
```

Check out the [Quick Start guide](docs/quickstart.md) for more examples.


## Themes

Five bundled themes, injected automatically as a `<style>` tag:

| Theme | Description |
|---|---|
| `github-light` | GitHub Primer colours (light) — **default** |
| `github-dark` | GitHub Primer colours (dark) |
| `github-auto` | Light/dark via `prefers-color-scheme` media query |
| `material` | MkDocs Material style (shadow, uppercase title, accent border) |
| `docusaurus` | Docusaurus/Infima style (thick left border, heavier title) |

Set `theme: null` to skip CSS injection and bring your own styles. Standalone CSS files are also available at `dist/themes/` for use via `<link>` tags.

## Documentation

- [Quick start](docs/quickstart.md) — install, first call, full HTML example
- [Configuration reference](docs/configuration.md) — all options with defaults and examples
- [Customisation guide](docs/customization.md) — CSS overrides, custom icons, BYO themes, dark mode

## License

[MIT](LICENSE)
