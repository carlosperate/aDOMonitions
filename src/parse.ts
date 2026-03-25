/**
 * Style-specific parsing for admonition markers.
 *
 * Each trigger style has its own parser that extracts structured data from
 * the DOM. Scanners in {@link module:scanner} consume these results and
 * delegate output construction to {@link module:build}.
 *
 * @module
 */

import type { AdmonitionType, GitHubType, DocusaurusType } from "./types.js";
import { DEFAULT_TITLES } from "./types.js";

// ---------------------------------------------------------------------------
// Shared parsed data
// ---------------------------------------------------------------------------

/**
 * Style-agnostic parsed admonition metadata. Both GitHub and Docusaurus
 * parsers produce this, and {@link buildAdmonition} consumes it to
 * construct the output wrapper (title + icon).
 */
export interface ParsedAdmonition {
  /** The admonition type (lowercased). */
  type: AdmonitionType;
  /** Display title (default or custom). */
  title: string;
}

// ---------------------------------------------------------------------------
// GitHub parsing
// ---------------------------------------------------------------------------

/**
 * Matches `[!TYPE]` with optional trailing text (custom title or inline body).
 * Leading whitespace is tolerated. Case-insensitive.
 */
const GITHUB_MARKER_RE =
  /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)/i;

/** Result of parsing a GitHub-style `[!TYPE]` marker from a `<blockquote>`. */
export interface GitHubParseResult {
  /** Parsed admonition metadata (type + title). */
  parsed: ParsedAdmonition;
  /** The first `<p>` that contained the marker. */
  markerP: Element;
  /** Text after `[!TYPE]` on the same line (before any `<br>`). May be empty. */
  inlineText: string;
  /** Whether the marker `<p>` has sibling elements in the blockquote. */
  hasBodySiblings: boolean;
  /** DOM nodes that appear after a `<br>` in the marker `<p>` (compact variant). */
  bodyNodesAfterBr: Node[];
}

/**
 * Parses a `<blockquote>` element for a GitHub-style `[!TYPE]` marker.
 *
 * @param element - The blockquote element to parse.
 * @returns Structured parse result, or `null` if the element doesn't match.
 */
export function parseGitHub(element: Element): GitHubParseResult | null {
  const firstP = element.querySelector(":scope > p");
  if (!firstP) return null;

  const markerResult = parseGitHubMarker(firstP);
  if (!markerResult) return null;

  const { type, inlineText, bodyNodesAfterBr } = markerResult;
  const hasBodySiblings = firstP.nextElementSibling !== null;

  const title = resolveGitHubTitle(
    type,
    inlineText,
    bodyNodesAfterBr.length > 0,
  );

  return {
    parsed: { type, title },
    markerP: firstP,
    inlineText,
    hasBodySiblings,
    bodyNodesAfterBr,
  };
}

// ---------------------------------------------------------------------------
// GitHub internal helpers
// ---------------------------------------------------------------------------

/** Result of parsing the marker text from a single `<p>` element. */
interface GitHubMarkerResult {
  /** The detected admonition type (lowercased). */
  type: GitHubType;
  /** Text after `[!TYPE]` on the same line (before any `<br>`). May be empty. */
  inlineText: string;
  /** DOM nodes that appear after a `<br>` in the same `<p>` (compact variant). */
  bodyNodesAfterBr: Node[];
}

/**
 * Parses the first `<p>` of a blockquote looking for a GitHub-style `[!TYPE]` marker.
 *
 * @param p - The `<p>` element to parse.
 * @returns The parsed marker data, or `null` if no valid marker is found.
 */
function parseGitHubMarker(p: Element): GitHubMarkerResult | null {
  let markerText = "";
  let foundBr = false;
  const bodyNodesAfterBr: Node[] = [];

  for (const node of Array.from(p.childNodes)) {
    if (!foundBr) {
      if (node.nodeType === 3 /* TEXT */) {
        markerText += node.textContent ?? "";
      } else if (node.nodeName === "BR") {
        foundBr = true;
      } else {
        // Non-text, non-br node before marker is complete → not a marker
        break;
      }
    } else {
      bodyNodesAfterBr.push(node);
    }
  }

  const match = GITHUB_MARKER_RE.exec(markerText);
  if (!match) return null;

  return {
    type: match[1].toLowerCase() as GitHubType,
    inlineText: match[2].trim(),
    bodyNodesAfterBr,
  };
}

/**
 * Determines the display title for a GitHub-style admonition.
 *
 * @remarks
 * Resolution rules:
 * - If there's a `<br>` with content after it AND inline text: inline text is the custom title.
 * - Otherwise: use the default title for the type.
 *
 * GitHub's alert syntax doesn't support custom titles — text after `[!TYPE]`
 * on the same line (without a `<br>`) is body content, not a title. Only
 * the compact `<br>` variant allows a custom title because the `<br>`
 * explicitly separates the title from the body.
 *
 * @param type - The admonition type.
 * @param inlineText - Text found after the `[!TYPE]` marker on the same line.
 * @param hasBrBody - Whether content was found after a `<br>` in the marker `<p>`.
 * @returns The resolved title string.
 */
function resolveGitHubTitle(
  type: GitHubType,
  inlineText: string,
  hasBrBody: boolean,
): string {
  if (inlineText && hasBrBody) {
    return inlineText;
  }
  return DEFAULT_TITLES[type];
}

// ---------------------------------------------------------------------------
// Docusaurus parsing
// ---------------------------------------------------------------------------

/** Matches `:::type` with optional custom title. Case-insensitive. */
const DOCUSAURUS_OPEN_RE = /^:::(note|tip|info|warning|danger)(?:\s+(.+))?$/i;

/** Matches the closing `:::` marker (exactly, no extra text). */
const DOCUSAURUS_CLOSE_RE = /^:::$/;

/** Result of parsing a Docusaurus-style `:::type` fence. */
export interface DocusaurusFenceResult {
  /** Parsed admonition metadata (type + title). */
  parsed: ParsedAdmonition;
  /** The body elements collected between the markers (originals, not clones). */
  bodyElements: Element[];
  /** The closing `<p>:::` element. */
  closingP: Element;
}

/**
 * Parses a Docusaurus-style `:::type` fence starting from an opening `<p>`.
 *
 * @remarks
 * Walks forward through sibling elements collecting body content until a
 * closing `<p>:::` is found. Returns `null` if the fence is malformed
 * (no closing marker).
 *
 * @param openingP - The `<p>` element whose textContent matches `:::type`.
 * @returns The parsed fence data, or `null` if malformed.
 */
export function parseDocusaurusFence(
  openingP: Element,
): DocusaurusFenceResult | null {
  const text = (openingP.textContent ?? "").trim();
  const match = DOCUSAURUS_OPEN_RE.exec(text);
  if (!match) return null;

  const type = match[1].toLowerCase() as DocusaurusType;
  const customTitle = match[2]?.trim() || null;

  const bodyElements: Element[] = [];
  let closingP: Element | null = null;
  let sibling = openingP.nextElementSibling;

  while (sibling) {
    if (
      sibling.tagName === "P" &&
      DOCUSAURUS_CLOSE_RE.test((sibling.textContent ?? "").trim())
    ) {
      closingP = sibling;
      break;
    }
    bodyElements.push(sibling);
    sibling = sibling.nextElementSibling;
  }

  if (!closingP) return null;

  const title = customTitle ?? DEFAULT_TITLES[type];

  return { parsed: { type, title }, bodyElements, closingP };
}
