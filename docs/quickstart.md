---
nav_order: 1
---

# Quick Start

Add these two lines to your HTML:

```html
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>adomonitions.init();</script>
```

And that's it! 🚀

By default this:

- Injects the (configurable) `default-light` theme CSS into `<head>`
- Scans `document.body` for GitHub Flavored Markdown (GFM) `[!TYPE]` (also configurable to Docusaurus-style `:::type`) converted to HTML
- Transforms matching blockquotes into styled callout boxes

For all options, see the [Configuration reference](config/configuration.md).

## Different style fences

If your Markdown uses `:::type` fences instead of `[!TYPE]` blockquotes:

```html
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  adomonitions.init({ triggerStyle: "docusaurus" });
</script>
```

## Pick a theme

Multiple themes are included and built-in.


| Theme           | Description |
|-----------------|-------------|
| `default-light` <br> `default-dark` <br> `default-auto` | Tinted background with rounded corners, **default**. |
| `github-light`  <br> `github-dark`  <br> `github-auto`  | GitHub callout style, with transparent bg, left border highlighted. |
| `material`      | MkDocs Material style, with full border, colour in title background, smaller text size. |
| `docusaurus`    | Docusaurus/Infima style, with thick border, heavier title. |

Pass their name to the `init()` function to use one:

```html
<script src="https://unpkg.com/adomonitions/dist/adomonitions.umd.min.js"></script>
<script>
  adomonitions.init({ theme: "material" });
</script>
```

The theme only controls CSS colours and styles, the generated HTML remains the same.

You can preview all themes in the [aDOMonitions live demo page](https://carlosperate.github.io/aDOMonitions/demo.html).

## Scope to a container

Avoid scanning the entire page by passing a `root` element/selector:

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
      theme: "default-light",
    });
  </script>
</body>
</html>
```

## Usage as an npm dependency

If you prefer a bundler-based workflow:

```bash
npm install adomonitions
```

```js
import { init } from "adomonitions";

init();
```

## Next steps

- [Configuration reference](config/configuration.md): All options explained
- [Customisation guide](config/customization.md): CSS overrides, dark mode, custom icons
