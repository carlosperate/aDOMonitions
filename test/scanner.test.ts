import { describe, it, expect, beforeEach } from "vitest";
import { scan } from "../src/scanner.js";
import { DEFAULT_CLASSES } from "../src/types.js";
import type { ResolvedConfig } from "../src/types.js";

function makeConfig(
  root: Element,
  triggerStyle: ResolvedConfig["triggerStyle"] = "github",
): ResolvedConfig {
  return {
    root,
    triggerStyle,
    classes: { ...DEFAULT_CLASSES },
    theme: null,
  };
}

beforeEach(() => {
  document.body.innerHTML = "";
});

// ---------------------------------------------------------------------------
// scan() dispatch
// ---------------------------------------------------------------------------

describe("scan — dispatch", () => {
  it("dispatches to GitHub scanner when triggerStyle is 'github'", () => {
    const container = document.createElement("div");
    container.innerHTML = "<blockquote><p>[!NOTE]</p><p>Body.</p></blockquote>";
    document.body.appendChild(container);

    scan(makeConfig(container, "github"));

    expect(
      container.querySelector('[data-adomonitions="true"]'),
    ).not.toBeNull();
    expect(container.querySelector("blockquote")).toBeNull();
  });

  it("dispatches to Docusaurus scanner when triggerStyle is 'docusaurus'", () => {
    const container = document.createElement("div");
    container.innerHTML = "<p>:::note</p><p>Body.</p><p>:::</p>";
    document.body.appendChild(container);

    scan(makeConfig(container, "docusaurus"));

    expect(
      container.querySelector('[data-adomonitions="true"]'),
    ).not.toBeNull();
  });

  it("throws for unknown triggerStyle", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const config = makeConfig(container);
    // Force an invalid triggerStyle
    (config as { triggerStyle: string }).triggerStyle = "unknown";

    expect(() => scan(config)).toThrow(/unknown triggerStyle/);
  });

  it("GitHub scan ignores Docusaurus markers", () => {
    const container = document.createElement("div");
    container.innerHTML = "<p>:::note</p><p>Body.</p><p>:::</p>";
    document.body.appendChild(container);

    scan(makeConfig(container, "github"));

    expect(container.querySelector('[data-adomonitions="true"]')).toBeNull();
  });

  it("Docusaurus scan ignores GitHub markers", () => {
    const container = document.createElement("div");
    container.innerHTML = "<blockquote><p>[!NOTE]</p><p>Body.</p></blockquote>";
    document.body.appendChild(container);

    scan(makeConfig(container, "docusaurus"));

    expect(container.querySelector('[data-adomonitions="true"]')).toBeNull();
    expect(container.querySelector("blockquote")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Root scoping
// ---------------------------------------------------------------------------

describe("scan — root scoping", () => {
  it("GitHub: only transforms blockquotes inside root", () => {
    const inside = document.createElement("div");
    inside.id = "scoped";
    inside.innerHTML = "<blockquote><p>[!NOTE]</p><p>Inside.</p></blockquote>";

    const outside = document.createElement("div");
    outside.innerHTML =
      "<blockquote><p>[!WARNING]</p><p>Outside.</p></blockquote>";

    document.body.appendChild(inside);
    document.body.appendChild(outside);

    scan(makeConfig(inside, "github"));

    // Inside root: transformed
    expect(inside.querySelector('[data-adomonitions="true"]')).not.toBeNull();
    expect(inside.querySelector("blockquote")).toBeNull();

    // Outside root: untouched
    expect(outside.querySelector('[data-adomonitions="true"]')).toBeNull();
    expect(outside.querySelector("blockquote")).not.toBeNull();
  });

  it("Docusaurus: only transforms fences inside root", () => {
    const inside = document.createElement("div");
    inside.innerHTML = "<p>:::tip</p><p>Inside.</p><p>:::</p>";

    const outside = document.createElement("div");
    outside.innerHTML = "<p>:::warning</p><p>Outside.</p><p>:::</p>";

    document.body.appendChild(inside);
    document.body.appendChild(outside);

    scan(makeConfig(inside, "docusaurus"));

    // Inside root: transformed
    expect(inside.querySelector('[data-adomonitions="true"]')).not.toBeNull();

    // Outside root: untouched
    expect(outside.querySelector('[data-adomonitions="true"]')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Multiple admonitions via scan()
// ---------------------------------------------------------------------------

describe("scan — multiple admonitions", () => {
  it("GitHub: transforms multiple blockquotes in one scan", () => {
    const container = document.createElement("div");
    container.innerHTML =
      "<blockquote><p>[!NOTE]</p><p>First.</p></blockquote>" +
      "<p>Regular paragraph.</p>" +
      "<blockquote><p>[!WARNING]</p><p>Second.</p></blockquote>";
    document.body.appendChild(container);

    scan(makeConfig(container, "github"));

    const wrappers = container.querySelectorAll('[data-adomonitions="true"]');
    expect(wrappers.length).toBe(2);
    expect(wrappers[0].classList.contains("adomonitions-note")).toBe(true);
    expect(wrappers[1].classList.contains("adomonitions-warning")).toBe(true);

    // Regular paragraph preserved (direct child of container, not inside a wrapper)
    const directPs = Array.from(container.children).filter(
      (el) => el.tagName === "P",
    );
    expect(directPs.length).toBe(1);
    expect(directPs[0].textContent).toBe("Regular paragraph.");
  });

  it("GitHub: mixed content — only matching blockquotes are transformed", () => {
    const container = document.createElement("div");
    container.innerHTML =
      "<blockquote><p>[!TIP]</p><p>Admonition.</p></blockquote>" +
      "<blockquote><p>Just a regular quote.</p></blockquote>";
    document.body.appendChild(container);

    scan(makeConfig(container, "github"));

    const wrappers = container.querySelectorAll('[data-adomonitions="true"]');
    expect(wrappers.length).toBe(1);
    expect(wrappers[0].classList.contains("adomonitions-tip")).toBe(true);

    // Regular blockquote still there
    expect(container.querySelector("blockquote")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Idempotency via scan()
// ---------------------------------------------------------------------------

describe("scan — idempotency", () => {
  it("GitHub: calling scan twice does not double-process", () => {
    const container = document.createElement("div");
    container.innerHTML = "<blockquote><p>[!NOTE]</p><p>Body.</p></blockquote>";
    document.body.appendChild(container);
    const config = makeConfig(container, "github");

    scan(config);
    const firstPassHTML = container.innerHTML;

    scan(config);
    expect(container.innerHTML).toBe(firstPassHTML);
    expect(
      container.querySelectorAll('[data-adomonitions="true"]').length,
    ).toBe(1);
  });

  it("Docusaurus: calling scan twice does not double-process", () => {
    const container = document.createElement("div");
    container.innerHTML = "<p>:::note</p><p>Body.</p><p>:::</p>";
    document.body.appendChild(container);
    const config = makeConfig(container, "docusaurus");

    scan(config);
    const firstPassHTML = container.innerHTML;

    scan(config);
    expect(container.innerHTML).toBe(firstPassHTML);
    expect(
      container.querySelectorAll('[data-adomonitions="true"]').length,
    ).toBe(1);
  });
});
