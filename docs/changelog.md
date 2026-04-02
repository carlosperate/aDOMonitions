---
nav_order: 2
---

# Changelog

## v0.3.0 (Unreleased)

### New

- .

### Changed

- Default theme tweaked to be a bit more distinctive from the others.

### Fixed

- Docusaurus theme colours and styling updated to be more faithful to the original.


# Changelog

## v0.2.0 (2026-04-01)

### New

- `default` theme family, in light, dark, and auto (OS detected) variants.
- minified UMD build now contains copyright and license info in a header comment.

### Changed

- Admonition types (info, warning, etc) were different for the GitHub and Docusaurus trigger styles, now they have been unfied and all are available in
both trigger styles.
- `idea` and `note` callouts now use different icons and slightly different colours in the default theme.
- Improved docs and built site configuration (via GitHub Pages)

### Fixed

- GitHub theme colours and styling updated to be more faithful to GitHub's callouts.
- Material theme updated to better match the MkDocs Material callouts.
- GitHub marker scanner now moves nodes instead of cloning them, avoids duplicated element IDs in the page and preserves any event listeners attached to child nodes.


## v0.1.0 (2026-03-26)

Initial release.

- GitHub-style (`[!TYPE]` blockquote) and Docusaurus-style (`:::type` fence) trigger styles
- Themes: `github-light`, `github-dark`, `github-auto`, `material`, `docusaurus`
- Zero runtime dependencies, ESM + UMD builds
- Scoped scanning via `root` config option
- BYO CSS support (`theme: null`)
- Accessible output with ARIA roles and labels
