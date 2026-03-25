/**
 * DOM scanning logic.
 *
 * Queries qualifying elements within the root scope, delegates parsing
 * to {@link module:parse}, builds output via {@link module:build}, and
 * handles body-content assembly and DOM replacement.
 *
 * @module
 */

import type { ResolvedConfig } from "./types.js";
import { parseGitHub, parseDocusaurusFence } from "./parse.js";
import { buildAdmonition } from "./build.js";

// ---------------------------------------------------------------------------
// GitHub scanner
// ---------------------------------------------------------------------------

/**
 * Scans the root element for GitHub-style `[!TYPE]` blockquotes and transforms
 * them into admonition wrapper elements.
 *
 * @param config - Resolved configuration with root element and class names.
 */
export function scanGitHub(config: ResolvedConfig): void {
  const blockquotes = Array.from(config.root.querySelectorAll("blockquote"));

  for (const bq of blockquotes) {
    if (bq.getAttribute("data-adomonitions") === "true") continue;

    const result = parseGitHub(bq);
    if (!result) continue;

    const { parsed, markerP, inlineText, hasBodySiblings, bodyNodesAfterBr } =
      result;
    const doc = bq.ownerDocument;
    const wrapper = buildAdmonition(parsed, doc, config);

    // Compact variant: content after <br> becomes its own <p>
    if (bodyNodesAfterBr.length > 0) {
      const bodyP = doc.createElement("p");
      for (const node of bodyNodesAfterBr) {
        bodyP.appendChild(node.cloneNode(true));
      }
      if (bodyP.firstChild && bodyP.firstChild.nodeType === 3) {
        bodyP.firstChild.textContent = bodyP.firstChild.textContent!.replace(
          /^\s+/,
          "",
        );
      }
      wrapper.appendChild(bodyP);
    } else if (inlineText) {
      // Inline text without <br> is always body content, not a custom title
      const bodyP = doc.createElement("p");
      bodyP.textContent = inlineText;
      wrapper.appendChild(bodyP);
    }

    // Clone remaining sibling elements from the blockquote (after the marker <p>)
    let sibling = markerP.nextElementSibling;
    while (sibling) {
      wrapper.appendChild(sibling.cloneNode(true));
      sibling = sibling.nextElementSibling;
    }

    bq.parentNode!.replaceChild(wrapper, bq);
  }
}

// ---------------------------------------------------------------------------
// Docusaurus scanner
// ---------------------------------------------------------------------------

/**
 * Scans the root element for Docusaurus-style `:::type` fences and transforms
 * them into admonition wrapper elements.
 *
 * @remarks
 * Algorithm:
 * 1. Walk all `<p>` elements inside root.
 * 2. When a `<p>`'s trimmed textContent matches `:::type`, parse the fence.
 * 3. Build the admonition wrapper, move body elements into it.
 * 4. Remove the opening and closing markers from the DOM.
 *
 * @param config - Resolved configuration with root element and class names.
 */
export function scanDocusaurus(config: ResolvedConfig): void {
  // Snapshot <p> elements — the DOM will be mutated during iteration.
  const paragraphs = Array.from(config.root.querySelectorAll("p"));
  const consumed = new WeakSet<Element>();

  for (const p of paragraphs) {
    if (consumed.has(p)) continue;
    if (p.closest('[data-adomonitions="true"]')) continue;

    const result = parseDocusaurusFence(p);
    if (!result) continue;

    const { parsed, bodyElements, closingP } = result;
    const wrapper = buildAdmonition(parsed, p.ownerDocument, config);

    // Move the original body elements into the wrapper
    for (const el of bodyElements) {
      wrapper.appendChild(el);
      consumed.add(el);
    }

    p.parentNode!.insertBefore(wrapper, p);
    p.remove();
    closingP.remove();

    consumed.add(p);
    consumed.add(closingP);
  }
}

// ---------------------------------------------------------------------------
// Top-level dispatch
// ---------------------------------------------------------------------------

/**
 * Top-level scanner dispatch. Selects the appropriate scanning strategy
 * based on `config.triggerStyle` and transforms matching elements.
 *
 * @param config - Resolved configuration object.
 */
export function scan(config: ResolvedConfig): void {
  switch (config.triggerStyle) {
    case "github":
      scanGitHub(config);
      break;
    case "docusaurus":
      scanDocusaurus(config);
      break;
    default:
      throw new Error(
        `aDOMonitions: unknown triggerStyle "${config.triggerStyle as string}"`,
      );
  }
}
