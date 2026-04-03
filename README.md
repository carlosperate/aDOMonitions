# aDOMonitions

<img src="https://carlosperate.github.io/aDOMonitions/img/logo.svg" alt="aDOMonitions logo" width="128px" align="left">

Styled admonition callouts generated on page load, for static site generators
whose Markdown renderer doesn't support them.

Check out the [Quickstart](https://carlosperate.github.io/aDOMonitions/quickstart.html) to get up and running right away!

Look at the [Demo page](https://carlosperate.github.io/aDOMonitions/demo.html) to view all the callouts and themes:

![Example callout boxes](docs/img/demo-screenshot.png)

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

Check out the [Quick Start guide](https://carlosperate.github.io/aDOMonitions/quickstart.html) for more examples.


## Themes

Eight bundled themes. The active theme is injected automatically as a `<style>` tag:

| Theme           | Description |
|-----------------|-------------|
| `default-light` <br> `default-dark` <br> `default-auto` | Tinted background with rounded corners, **default** |
| `github-light`  <br> `github-dark`  <br> `github-auto`  | GitHub callout style (transparent bg, left border highlight), light |
| `material`      | MkDocs Material style (full border, colour in title background, smaller text size) |
| `docusaurus`    | Docusaurus/Infima style (thick border, heavier title) |

Set `theme: null` to skip CSS injection and bring your own styles. Standalone CSS files are also available at `dist/themes/` for use via `<link>` tags.

## Documentation

- [Quick start](https://carlosperate.github.io/aDOMonitions/quickstart.html): Install and init, full HTML example
- [Configuration reference](https://carlosperate.github.io/aDOMonitions/config/configuration.html): All options with defaults and examples
- [Customisation guide](https://carlosperate.github.io/aDOMonitions/config/customization.html): CSS overrides, custom icons, BYO themes, dark mode

## License & Acknowledgements

[MIT](LICENSE) licensed.

Icons are inline SVGs from [GitHub Octicons](https://primer.style/foundations/icons), MIT licensed (see [LICENSE-THIRD-PARTY](LICENSE-THIRD-PARTY)).

The bundled themes are inspired by and styled after the admonition designs of:

- **[GitHub](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)**: Alert syntax and visual style, colours from the [Primer design system](https://primer.style/foundations/color).
- **[Docusaurus](https://docusaurus.io/docs/markdown-features/admonitions)**:  Admonition syntax and visual style, colours from the [Infima CSS framework](https://infima.dev/).
- **[MkDocs Material](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)**: Admonition design, colours from the [Material Design palette](https://m2.material.io/design/color/the-color-system.html).

