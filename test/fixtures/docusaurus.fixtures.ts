/**
 * Test fixtures for the Docusaurus trigger style.
 *
 * Unlike GitHub fixtures, Docusaurus operates on sibling <p> elements within
 * a parent container. The `input` is the innerHTML of a wrapper <div> that
 * contains the opening :::type marker, body content, and closing ::: marker.
 *
 * `expectedType: null` means the content should NOT be transformed.
 */

export interface DocusaurusFixture {
  id: string;
  description: string;
  /** innerHTML of a wrapper div — contains <p> markers and content siblings. */
  input: string;
  /** Expected admonition type, or null if it should not transform. */
  expectedType: string | null;
  /** Expected title text (default title or custom). */
  expectedTitle?: string;
  /** Expected number of content elements inside the output wrapper (excluding title). */
  expectedBodyChildCount?: number;
  /** Expected ARIA role on the wrapper. */
  expectedRole?: string;
  /** Number of admonitions expected (for multi-admonition tests). Default: 1. */
  expectedCount?: number;
  /**
   * For multi-admonition tests, expected types for each admonition in order.
   * Overrides expectedType when present.
   */
  expectedTypes?: string[];
}

// ---------------------------------------------------------------------------
// Basic single-type fixtures — one of each Docusaurus type
// ---------------------------------------------------------------------------

const allTypes: DocusaurusFixture[] = [
  {
    id: "type-note",
    description: ":::note basic admonition",
    input: "<p>:::note</p><p>Note content here.</p><p>:::</p>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBodyChildCount: 1,
    expectedRole: "note",
  },
  {
    id: "type-tip",
    description: ":::tip basic admonition",
    input: "<p>:::tip</p><p>Tip content here.</p><p>:::</p>",
    expectedType: "tip",
    expectedTitle: "Tip",
    expectedBodyChildCount: 1,
    expectedRole: "note",
  },
  {
    id: "type-info",
    description: ":::info basic admonition",
    input: "<p>:::info</p><p>Info content here.</p><p>:::</p>",
    expectedType: "info",
    expectedTitle: "Info",
    expectedBodyChildCount: 1,
    expectedRole: "note",
  },
  {
    id: "type-warning",
    description: ":::warning basic admonition",
    input: "<p>:::warning</p><p>Warning content here.</p><p>:::</p>",
    expectedType: "warning",
    expectedTitle: "Warning",
    expectedBodyChildCount: 1,
    expectedRole: "alert",
  },
  {
    id: "type-danger",
    description: ":::danger basic admonition",
    input: "<p>:::danger</p><p>Danger content here.</p><p>:::</p>",
    expectedType: "danger",
    expectedTitle: "Danger",
    expectedBodyChildCount: 1,
    expectedRole: "alert",
  },
  {
    id: "type-important",
    description: ":::important basic admonition",
    input: "<p>:::important</p><p>Important content here.</p><p>:::</p>",
    expectedType: "important",
    expectedTitle: "Important",
    expectedBodyChildCount: 1,
    expectedRole: "note",
  },
  {
    id: "type-caution",
    description: ":::caution basic admonition",
    input: "<p>:::caution</p><p>Caution content here.</p><p>:::</p>",
    expectedType: "caution",
    expectedTitle: "Caution",
    expectedBodyChildCount: 1,
    expectedRole: "alert",
  },
];

// ---------------------------------------------------------------------------
// Case insensitivity
// ---------------------------------------------------------------------------

const caseVariants: DocusaurusFixture[] = [
  {
    id: "case-upper",
    description: ":::NOTE uppercase",
    input: "<p>:::NOTE</p><p>Content.</p><p>:::</p>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBodyChildCount: 1,
    expectedRole: "note",
  },
  {
    id: "case-mixed",
    description: ":::Warning mixed case",
    input: "<p>:::Warning</p><p>Content.</p><p>:::</p>",
    expectedType: "warning",
    expectedTitle: "Warning",
    expectedBodyChildCount: 1,
    expectedRole: "alert",
  },
];

// ---------------------------------------------------------------------------
// Custom title
// ---------------------------------------------------------------------------

const customTitle: DocusaurusFixture[] = [
  {
    id: "custom-title-note",
    description: ":::note with custom title text",
    input: "<p>:::note My Custom Title</p><p>Body content.</p><p>:::</p>",
    expectedType: "note",
    expectedTitle: "My Custom Title",
    expectedBodyChildCount: 1,
    expectedRole: "note",
  },
  {
    id: "custom-title-danger",
    description: ":::danger with custom title text",
    input: "<p>:::danger CRITICAL ISSUE</p><p>Details here.</p><p>:::</p>",
    expectedType: "danger",
    expectedTitle: "CRITICAL ISSUE",
    expectedBodyChildCount: 1,
    expectedRole: "alert",
  },
];

// ---------------------------------------------------------------------------
// Multi-element body
// ---------------------------------------------------------------------------

const multiElement: DocusaurusFixture[] = [
  {
    id: "multi-para",
    description: "Multiple paragraphs between markers",
    input:
      "<p>:::note</p><p>First paragraph.</p><p>Second paragraph.</p><p>:::</p>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBodyChildCount: 2,
    expectedRole: "note",
  },
  {
    id: "mixed-elements",
    description: "Mixed element types between markers (p, ul, pre)",
    input:
      "<p>:::tip</p><p>Intro text.</p><ul><li>Item A</li><li>Item B</li></ul><pre><code>example</code></pre><p>:::</p>",
    expectedType: "tip",
    expectedTitle: "Tip",
    expectedBodyChildCount: 3,
    expectedRole: "note",
  },
];

// ---------------------------------------------------------------------------
// Inline formatting in body (should be preserved)
// ---------------------------------------------------------------------------

const richContent: DocusaurusFixture[] = [
  {
    id: "inline-formatting",
    description: "Body with bold, italic, code formatting preserved",
    input:
      "<p>:::info</p><p>Some <strong>bold</strong> and <em>italic</em> and <code>code</code>.</p><p>:::</p>",
    expectedType: "info",
    expectedTitle: "Info",
    expectedBodyChildCount: 1,
    expectedRole: "note",
  },
];

// ---------------------------------------------------------------------------
// Malformed — should NOT transform
// ---------------------------------------------------------------------------

const malformed: DocusaurusFixture[] = [
  {
    id: "malformed-no-closing",
    description: "Opening :::note without closing ::: — should not transform",
    input: "<p>:::note</p><p>Body without close.</p><p>More text.</p>",
    expectedType: null,
  },
  {
    id: "malformed-unknown-type",
    description: ":::unknown type — should not transform",
    input: "<p>:::unknown</p><p>Body.</p><p>:::</p>",
    expectedType: null,
  },
  {
    id: "malformed-closing-only",
    description: "Closing ::: without opening — should not transform",
    input: "<p>Some text.</p><p>:::</p>",
    expectedType: null,
  },
  {
    id: "malformed-extra-text-on-closing",
    description: "Closing marker with extra text — should not match as closing",
    input: "<p>:::note</p><p>Body.</p><p>::: extra</p>",
    expectedType: null,
  },
];

// ---------------------------------------------------------------------------
// Adjacent admonitions — two in a row
// ---------------------------------------------------------------------------

const adjacent: DocusaurusFixture[] = [
  {
    id: "adjacent-two",
    description: "Two admonitions back to back",
    input:
      "<p>:::note</p><p>First note.</p><p>:::</p><p>:::warning</p><p>A warning.</p><p>:::</p>",
    expectedCount: 2,
    expectedTypes: ["note", "warning"],
    expectedType: null, // overridden by expectedTypes
  },
];

// ---------------------------------------------------------------------------
// Content surrounding admonition (should be left untouched)
// ---------------------------------------------------------------------------

const surrounding: DocusaurusFixture[] = [
  {
    id: "content-before-and-after",
    description: "Regular content before and after the admonition is preserved",
    input:
      "<p>Before text.</p><p>:::tip</p><p>Tip body.</p><p>:::</p><p>After text.</p>",
    expectedType: "tip",
    expectedTitle: "Tip",
    expectedBodyChildCount: 1,
    expectedRole: "note",
  },
];

// ---------------------------------------------------------------------------
// Export all fixtures as a flat array
// ---------------------------------------------------------------------------

export const docusaurusFixtures: DocusaurusFixture[] = [
  ...allTypes,
  ...caseVariants,
  ...customTitle,
  ...multiElement,
  ...richContent,
  ...malformed,
  ...adjacent,
  ...surrounding,
];
