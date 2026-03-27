---
nav_order: 1
---

# Quick Start

Add these two lines to your HTML:

```html
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  adomonitions.init();
</script>
```

That's it. By default this:

- Scans `document.body` for GitHub-style `[!TYPE]` blockquotes
- Injects the `github-light` theme CSS into `<head>`
- Transforms matching blockquotes into styled callout boxes

For the complete description of all options, see the [Configuration reference](configuration.md).

## Docusaurus-style fences

If your Markdown uses `:::type` fences instead of `[!TYPE]` blockquotes:

```html
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  adomonitions.init({ triggerStyle: "docusaurus" });
</script>
```

## Pick a theme

Five bundled themes are available. The JS bundle includes all of them — just pass the name:

```html
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  adomonitions.init({ theme: "material" });
</script>
```

| Theme | Description |
|---|---|
| `github-light` | GitHub Primer colours (light) — **default** |
| `github-dark` | GitHub Primer colours (dark) |
| `github-auto` | Follows OS light/dark preference |
| `material` | MkDocs Material style (shadow, uppercase title) |
| `docusaurus` | Docusaurus/Infima style (thick border, heavier title) |

The theme controls colours and visual style only — both trigger styles produce the same output HTML.

## Scope to a container

Avoid scanning the entire page by passing a `root`:

```html
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  adomonitions.init({ root: "#article-content" });
</script>
```

## Full example

A complete HTML page with GitHub-style admonitions:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>My Page</title>
</head>
<body>
  <article id="content">
    <h1>Release Notes</h1>

    <blockquote>
      <p>[!NOTE]</p>
      <p>Version 2.0 has been released.</p>
    </blockquote>

    <blockquote>
      <p>[!WARNING]</p>
      <p>The old API has been removed.</p>
    </blockquote>
  </article>

  <script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
  <script>
    adomonitions.init({
      root: "#content",
      theme: "github-light",
    });
  </script>
</body>
</html>
```

## Using with npm

If you prefer a bundler-based workflow:

```bash
npm install adomonitions
```

```js
import { init } from "adomonitions";

init();
```

## Next steps

- [Configuration reference](configuration.md) — all options explained
- [Customisation guide](customization.md) — CSS overrides, dark mode, custom icons
