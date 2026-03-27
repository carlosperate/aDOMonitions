---
layout: default
nav_exclude: true
---

# aDOMonitions

Styled admonition callouts generated on page load, for static site generators
whose Markdown renderer doesn't support them.

Checkout the [Quickstart](docs/quickstart.md) to get up and running right away!

Look at the [Demo page](demo.html) to view all the callouts and themes.

![Example callout boxes](img/demo-screenshot.png)

## What is this?

This JavaScript library scans the DOM for admonition markers in HTML generated
by a static site generator without built-in admonition support.

Admonitions are highlighted callout boxes — "Note", "Warning", "Tip", etc —
used to draw attention to important content.
Normally Markdown renderers only support these via build-time plugins,
so without them the markers end up as plain text in the HTML.

aDOMonitions looks for either GitHub-style or Docusaurus-style markers
and transforms the corresponding HTML into styled, accessible callout boxes
with icons, colours, and ARIA roles.

### Before

A GitHub-style admonition in Markdown:

```markdown
> [!WARNING]
> This will delete all data.
```

Is rendered as plain HTML by most static site generators:

```html
<blockquote>
  <p>[!WARNING]</p>
  <p>This will delete all data.</p>
</blockquote>
```

### After

Running aDOMonitions transforms it into a styled callout box:

```html
<div class="adomonitions adomonitions-warning" role="alert" aria-label="Warning">
  <p class="adomonitions-title">
    <span class="adomonitions-icon" aria-hidden="true"><!-- SVG --></span> Warning
  </p>
  <p>This will delete all data.</p>
</div>
```

![Rendered callout box](img/admonition-warning.png)

## Features

- **Zero dependencies** — single script tag, no build step required
- **Two trigger styles** — GitHub (`[!TYPE]` blockquotes) and Docusaurus (`:::type` fences)
- **Five bundled themes** — `github-light`, `github-dark`, `github-auto`, `material`, `docusaurus`
- **Accessible** — ARIA roles and labels on every callout
- **Scoped scanning** — target a specific container instead of the whole page
- **BYO CSS** — skip the built-in themes and use your own existing or new styles
- **ESM and UMD** — works with bundlers or a plain `<script>` tag
