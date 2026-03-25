/**
 * Test fixtures for the GitHub trigger style.
 *
 * Each fixture describes a single <blockquote> input and the expected
 * transformation result. `expectedType: null` means the element should
 * NOT be transformed (transformElement returns null).
 */

export interface GitHubFixture {
  id: string;
  description: string;
  /** Raw HTML string — the blockquote to transform. */
  input: string;
  /** Expected admonition type, or null if it should not transform. */
  expectedType: string | null;
  /** Expected title text (default title or custom). */
  expectedTitle?: string;
  /** Expected body innerHTML (for simple single-child bodies). */
  expectedBody?: string;
  /** Expected number of child elements in the body (for multi-block). */
  expectedBodyChildCount?: number;
  /** Expected ARIA role on the wrapper. */
  expectedRole?: string;
}

// ---------------------------------------------------------------------------
// Input variant fixtures — all use [!NOTE] to isolate the parsing logic
// ---------------------------------------------------------------------------

const inputVariants: GitHubFixture[] = [
  {
    id: "note-compact",
    description: "[!NOTE] with body on same paragraph, separated by <br>",
    input: "<blockquote><p>[!NOTE]<br>Body text.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBody: "<p>Body text.</p>",
    expectedRole: "note",
  },
  {
    id: "note-separated",
    description: "[!NOTE] with body in a separate paragraph",
    input: "<blockquote><p>[!NOTE]</p><p>Body text.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBody: "<p>Body text.</p>",
    expectedRole: "note",
  },
  {
    id: "note-inline",
    description: "[!NOTE] with body as inline text (no <br>)",
    input: "<blockquote><p>[!NOTE] Body text here.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBody: "<p>Body text here.</p>",
    expectedRole: "note",
  },
  {
    id: "note-custom-title",
    description: "[!NOTE] with inline custom title text",
    input: "<blockquote><p>[!NOTE] My Custom Title<br>Body.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "My Custom Title",
    expectedBody: "<p>Body.</p>",
    expectedRole: "note",
  },
  {
    id: "note-inline-with-siblings",
    description:
      "[!NOTE] with inline text and siblings — inline text is body, not title",
    input:
      "<blockquote><p>[!NOTE] First paragraph.</p><p>Second paragraph.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBodyChildCount: 2,
    expectedRole: "note",
  },
];

// ---------------------------------------------------------------------------
// All five GitHub types — verify type detection, default title, and role
// ---------------------------------------------------------------------------

const allTypes: GitHubFixture[] = [
  {
    id: "type-note",
    description: "[!NOTE] type detection",
    input: "<blockquote><p>[!NOTE]</p><p>Content.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedRole: "note",
  },
  {
    id: "type-tip",
    description: "[!TIP] type detection",
    input: "<blockquote><p>[!TIP]</p><p>Content.</p></blockquote>",
    expectedType: "tip",
    expectedTitle: "Tip",
    expectedRole: "note",
  },
  {
    id: "type-important",
    description: "[!IMPORTANT] type detection",
    input: "<blockquote><p>[!IMPORTANT]</p><p>Content.</p></blockquote>",
    expectedType: "important",
    expectedTitle: "Important",
    expectedRole: "note",
  },
  {
    id: "type-warning",
    description: "[!WARNING] type detection",
    input: "<blockquote><p>[!WARNING]</p><p>Content.</p></blockquote>",
    expectedType: "warning",
    expectedTitle: "Warning",
    expectedRole: "alert",
  },
  {
    id: "type-caution",
    description: "[!CAUTION] type detection",
    input: "<blockquote><p>[!CAUTION]</p><p>Content.</p></blockquote>",
    expectedType: "caution",
    expectedTitle: "Caution",
    expectedRole: "alert",
  },
];

// ---------------------------------------------------------------------------
// Case insensitivity
// ---------------------------------------------------------------------------

const caseVariants: GitHubFixture[] = [
  {
    id: "case-lower",
    description: "[!note] lowercase marker",
    input: "<blockquote><p>[!note]</p><p>Body.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedRole: "note",
  },
  {
    id: "case-mixed",
    description: "[!Note] mixed-case marker",
    input: "<blockquote><p>[!Note]</p><p>Body.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedRole: "note",
  },
  {
    id: "case-upper",
    description: "[!WARNING] uppercase marker (standard form)",
    input: "<blockquote><p>[!WARNING]</p><p>Body.</p></blockquote>",
    expectedType: "warning",
    expectedTitle: "Warning",
    expectedRole: "alert",
  },
  {
    id: "case-mixed-warning",
    description: "[!Warning] mixed-case warning",
    input: "<blockquote><p>[!Warning]</p><p>Body.</p></blockquote>",
    expectedType: "warning",
    expectedTitle: "Warning",
    expectedRole: "alert",
  },
];

// ---------------------------------------------------------------------------
// Multi-block body content
// ---------------------------------------------------------------------------

const multiBlock: GitHubFixture[] = [
  {
    id: "warning-multiblock",
    description: "[!WARNING] with multiple child elements",
    input:
      "<blockquote><p>[!WARNING]</p><p>First para.</p><ul><li>Item</li></ul></blockquote>",
    expectedType: "warning",
    expectedTitle: "Warning",
    expectedBodyChildCount: 2,
    expectedRole: "alert",
  },
  {
    id: "note-multiblock-rich",
    description: "[!NOTE] with paragraphs, code block, and list",
    input:
      "<blockquote><p>[!NOTE]</p><p>Intro text.</p><pre><code>code here</code></pre><p>Final note.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBodyChildCount: 3,
    expectedRole: "note",
  },
];

// ---------------------------------------------------------------------------
// Non-matching / skip cases — transformElement should return null
// ---------------------------------------------------------------------------

const nonMatching: GitHubFixture[] = [
  {
    id: "not-admonition",
    description: "Regular blockquote with no marker — should not transform",
    input: "<blockquote><p>Regular quote with no marker.</p></blockquote>",
    expectedType: null,
  },
  {
    id: "not-admonition-no-p",
    description: "Blockquote with no <p> child — should not transform",
    input: "<blockquote>Just raw text, no paragraph.</blockquote>",
    expectedType: null,
  },
  {
    id: "not-admonition-unknown-type",
    description: "Blockquote with unknown [!TYPE] — should not transform",
    input: "<blockquote><p>[!UNKNOWN]</p><p>Body.</p></blockquote>",
    expectedType: null,
  },
  {
    id: "not-admonition-mid-text",
    description: "Marker not at start of text — should not transform",
    input: "<blockquote><p>Some text [!NOTE] not at start.</p></blockquote>",
    expectedType: null,
  },
  {
    id: "already-processed",
    description: 'Element with data-adomonitions="true" — should skip',
    input:
      '<blockquote data-adomonitions="true"><p>[!NOTE]</p><p>Body.</p></blockquote>',
    expectedType: null,
  },
];

// ---------------------------------------------------------------------------
// Whitespace edge cases
// ---------------------------------------------------------------------------

const whitespace: GitHubFixture[] = [
  {
    id: "whitespace-leading-space",
    description: "Marker with leading whitespace in text node",
    input: "<blockquote><p>  [!NOTE]</p><p>Body.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedRole: "note",
  },
  {
    id: "whitespace-trailing-space",
    description: "Marker with trailing whitespace",
    input: "<blockquote><p>[!NOTE]  </p><p>Body.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedRole: "note",
  },
  {
    id: "whitespace-around-br",
    description: "Whitespace around <br> in compact form",
    input: "<blockquote><p>[!TIP]  <br>  Body text.</p></blockquote>",
    expectedType: "tip",
    expectedTitle: "Tip",
    expectedBody: "<p>Body text.</p>",
    expectedRole: "note",
  },
];

// ---------------------------------------------------------------------------
// Empty body
// ---------------------------------------------------------------------------

const emptyBody: GitHubFixture[] = [
  {
    id: "empty-body-marker-only",
    description: "[!NOTE] with marker only, no body content",
    input: "<blockquote><p>[!NOTE]</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBodyChildCount: 0,
    expectedRole: "note",
  },
];

// ---------------------------------------------------------------------------
// Body content with inline formatting (should be preserved)
// ---------------------------------------------------------------------------

const richBody: GitHubFixture[] = [
  {
    id: "body-with-inline-formatting",
    description: "Body paragraph with bold, italic, code",
    input:
      "<blockquote><p>[!NOTE]</p><p>Text with <strong>bold</strong>, <em>italic</em>, and <code>code</code>.</p></blockquote>",
    expectedType: "note",
    expectedTitle: "Note",
    expectedBody:
      "<p>Text with <strong>bold</strong>, <em>italic</em>, and <code>code</code>.</p>",
    expectedRole: "note",
  },
  {
    id: "body-with-link",
    description: "Body paragraph with an anchor link",
    input:
      '<blockquote><p>[!TIP]</p><p>Check <a href="https://example.com">this link</a>.</p></blockquote>',
    expectedType: "tip",
    expectedTitle: "Tip",
    expectedBody: '<p>Check <a href="https://example.com">this link</a>.</p>',
    expectedRole: "note",
  },
];

// ---------------------------------------------------------------------------
// Export all fixtures as a flat array
// ---------------------------------------------------------------------------

export const githubFixtures: GitHubFixture[] = [
  ...inputVariants,
  ...allTypes,
  ...caseVariants,
  ...multiBlock,
  ...nonMatching,
  ...whitespace,
  ...emptyBody,
  ...richBody,
];
