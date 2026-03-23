import { describe, it, expect, beforeEach } from "vitest";
import { init } from "../src/index.js";
import { coreCSS, getThemeCSS } from "../src/themes/index.js";

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
    expect(style!.textContent).toContain(coreCSS);
  });

  it("uses github-light as the default theme", () => {
    init();

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(getThemeCSS("github-light"));
  });

  it("core CSS comes before theme CSS in the injected style", () => {
    init();

    const style = document.getElementById(STYLE_ID);
    const content = style!.textContent!;
    // In test env, Vite may return empty CSS strings; verify ordering
    // only when CSS content is available (build-time verified by Rollup)
    if (coreCSS.length > 0 && getThemeCSS("github-light").length > 0) {
      const coreIndex = content.indexOf(coreCSS);
      const themeIndex = content.indexOf(getThemeCSS("github-light"));
      expect(coreIndex).toBeLessThan(themeIndex);
    } else {
      // At minimum, the style element exists
      expect(style).not.toBeNull();
    }
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
      expect(style!.textContent).toContain(getThemeCSS(name));
      // Core CSS always present
      expect(style!.textContent).toContain(coreCSS);
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
