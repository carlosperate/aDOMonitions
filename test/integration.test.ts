import { describe, it, expect, beforeEach } from "vitest";
import { init } from "../src/index.js";
import { expectedCoreCSS, expectedThemeCSS } from "./helpers/css.js";

const STYLE_ID = "adomonitions-theme";

beforeEach(() => {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
});

// ---------------------------------------------------------------------------
// Default configuration
// ---------------------------------------------------------------------------

describe("init — defaults", () => {
  it("transforms GitHub blockquotes by default", () => {
    document.body.innerHTML =
      "<blockquote><p>[!NOTE]</p><p>Body text.</p></blockquote>";

    init();

    expect(document.querySelector('[data-adomonitions="true"]')).not.toBeNull();
    expect(document.querySelector("blockquote")).toBeNull();
  });

  it("injects CSS into <head> by default", () => {
    document.body.innerHTML =
      "<blockquote><p>[!TIP]</p><p>Body.</p></blockquote>";

    init();

    const style = document.getElementById(STYLE_ID);
    expect(style).not.toBeNull();
    expect(style!.tagName).toBe("STYLE");
  });

  it("injects core CSS alongside the theme CSS", () => {
    init();

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(expectedCoreCSS);
  });

  it("uses default-light as the default theme", () => {
    init();

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(expectedThemeCSS["default-light"]);
  });

  it("core CSS comes before theme CSS in the injected style", () => {
    init();

    const content = document.getElementById(STYLE_ID)!.textContent!;
    const coreIndex = content.indexOf(expectedCoreCSS);
    const themeIndex = content.indexOf(expectedThemeCSS["default-light"]);
    expect(coreIndex).toBeGreaterThanOrEqual(0);
    expect(themeIndex).toBeGreaterThan(coreIndex);
  });
});

// ---------------------------------------------------------------------------
// Trigger style
// ---------------------------------------------------------------------------

describe("init — triggerStyle", () => {
  it("transforms Docusaurus fences when triggerStyle is 'docusaurus'", () => {
    document.body.innerHTML = "<p>:::note</p><p>Body.</p><p>:::</p>";

    init({ triggerStyle: "docusaurus" });

    expect(document.querySelector('[data-adomonitions="true"]')).not.toBeNull();
  });

  it("ignores Docusaurus markers when triggerStyle is 'github' (default)", () => {
    document.body.innerHTML = "<p>:::note</p><p>Body.</p><p>:::</p>";

    init();

    expect(document.querySelector('[data-adomonitions="true"]')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Root scoping
// ---------------------------------------------------------------------------

describe("init — root", () => {
  it("accepts a CSS selector string as root", () => {
    document.body.innerHTML =
      '<div id="app"><blockquote><p>[!NOTE]</p><p>Inside.</p></blockquote></div>' +
      "<blockquote><p>[!WARNING]</p><p>Outside.</p></blockquote>";

    init({ root: "#app" });

    const app = document.getElementById("app")!;
    expect(app.querySelector('[data-adomonitions="true"]')).not.toBeNull();
    // The outside blockquote is a sibling of #app, not inside it
    const outsideBq = document.body.querySelector(":scope > blockquote");
    expect(outsideBq).not.toBeNull();
  });

  it("accepts an Element as root", () => {
    const root = document.createElement("div");
    root.innerHTML = "<blockquote><p>[!TIP]</p><p>Body.</p></blockquote>";
    document.body.appendChild(root);

    init({ root });

    expect(root.querySelector('[data-adomonitions="true"]')).not.toBeNull();
  });

  it("throws when root selector matches no element", () => {
    expect(() => init({ root: "#nonexistent" })).toThrow(/matched no element/);
  });

  it("defaults to document.body when root is omitted", () => {
    document.body.innerHTML =
      "<blockquote><p>[!NOTE]</p><p>Body.</p></blockquote>";

    init();

    expect(
      document.body.querySelector('[data-adomonitions="true"]'),
    ).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Theme: null (bring your own CSS)
// ---------------------------------------------------------------------------

describe("init — theme: null", () => {
  it("does not inject any CSS when theme is null", () => {
    document.body.innerHTML =
      "<blockquote><p>[!NOTE]</p><p>Body.</p></blockquote>";

    init({ theme: null });

    expect(document.getElementById(STYLE_ID)).toBeNull();
    // But DOM scanning still happens
    expect(document.querySelector('[data-adomonitions="true"]')).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Theme selection
// ---------------------------------------------------------------------------

describe("init — theme selection", () => {
  const themeNames = [
    "default-light",
    "default-dark",
    "default-auto",
    "github-light",
    "github-dark",
    "github-auto",
    "material",
    "docusaurus",
  ] as const;

  for (const name of themeNames) {
    it(`injects ${name} theme CSS when specified`, () => {
      init({ theme: name });

      const style = document.getElementById(STYLE_ID);
      expect(style).not.toBeNull();
      expect(style!.textContent!.length).toBeGreaterThan(0);
      // Core CSS always present
      expect(style!.textContent).toContain(expectedCoreCSS);
    });
  }
});

// ---------------------------------------------------------------------------
// Idempotency
// ---------------------------------------------------------------------------

describe("init — idempotency", () => {
  it("calling init twice does not duplicate the style element", () => {
    init();
    init();

    const styles = document.querySelectorAll(`#${STYLE_ID}`);
    expect(styles.length).toBe(1);
  });

  it("calling init twice does not double-process the DOM", () => {
    document.body.innerHTML =
      "<blockquote><p>[!NOTE]</p><p>Body.</p></blockquote>";

    init();
    const firstPassHTML = document.body.innerHTML;

    init();
    expect(document.body.innerHTML).toBe(firstPassHTML);
    expect(document.querySelectorAll('[data-adomonitions="true"]').length).toBe(
      1,
    );
  });
});

// ---------------------------------------------------------------------------
// Theme switching
// ---------------------------------------------------------------------------

describe("init — theme switching", () => {
  it("switches theme CSS when init is called again with a different theme", () => {
    init({ theme: "github-light" });
    init({ theme: "material" });

    const style = document.getElementById(STYLE_ID);
    expect(style!.getAttribute("data-theme")).toBe("material");
    expect(style!.textContent).toContain(expectedThemeCSS["material"]);
  });

  it("does not create a second style element on theme switch", () => {
    init({ theme: "github-light" });
    init({ theme: "github-dark" });

    const styles = document.querySelectorAll(`#${STYLE_ID}`);
    expect(styles.length).toBe(1);
  });

  it("preserves core CSS after theme switch", () => {
    init({ theme: "github-light" });
    init({ theme: "docusaurus" });

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(expectedCoreCSS);
  });
});

// ---------------------------------------------------------------------------
// Custom classes
// ---------------------------------------------------------------------------

describe("init — custom classes", () => {
  it("applies custom wrapper class to output", () => {
    document.body.innerHTML =
      "<blockquote><p>[!NOTE]</p><p>Body.</p></blockquote>";

    init({ classes: { wrapper: "my-callout" } });

    const wrapper = document.querySelector(".my-callout");
    expect(wrapper).not.toBeNull();
    expect(wrapper!.classList.contains("my-callout-note")).toBe(true);
  });
});
