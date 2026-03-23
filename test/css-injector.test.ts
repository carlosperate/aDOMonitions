import { describe, it, expect, beforeEach } from "vitest";
import { injectCSS } from "../src/css-injector.js";
import { coreCSS, getThemeCSS } from "../src/themes/index.js";

const STYLE_ID = "adomonitions-theme";

beforeEach(() => {
  document.head.innerHTML = "";
});

// ---------------------------------------------------------------------------
// Basic injection
// ---------------------------------------------------------------------------

describe("injectCSS", () => {
  it("injects a <style> element into <head>", () => {
    injectCSS("github-light");

    const style = document.getElementById(STYLE_ID);
    expect(style).not.toBeNull();
    expect(style!.tagName).toBe("STYLE");
  });

  it("sets the correct id on the style element", () => {
    injectCSS("github-light");

    const style = document.getElementById(STYLE_ID);
    expect(style!.id).toBe(STYLE_ID);
  });

  it("contains core CSS and theme CSS content", () => {
    injectCSS("github-light");

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(coreCSS);
    expect(style!.textContent).toContain(getThemeCSS("github-light"));
  });

  it("injects the correct theme when a different theme is specified", () => {
    injectCSS("material");

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(coreCSS);
    expect(style!.textContent).toContain(getThemeCSS("material"));
  });
});

// ---------------------------------------------------------------------------
// Duplicate prevention
// ---------------------------------------------------------------------------

describe("injectCSS — duplicate prevention", () => {
  it("does not inject a second <style> if one already exists", () => {
    injectCSS("github-light");
    injectCSS("github-light");

    const styles = document.querySelectorAll(`#${STYLE_ID}`);
    expect(styles.length).toBe(1);
  });

  it("does not overwrite existing style when called again with different theme", () => {
    injectCSS("github-light");
    const firstContent = document.getElementById(STYLE_ID)!.textContent;

    injectCSS("material");

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toBe(firstContent);
  });

  it("skips injection if a style with the id was manually added", () => {
    const manual = document.createElement("style");
    manual.id = STYLE_ID;
    manual.textContent = "/* custom */";
    document.head.appendChild(manual);

    injectCSS("github-light");

    const styles = document.querySelectorAll(`#${STYLE_ID}`);
    expect(styles.length).toBe(1);
    expect(styles[0].textContent).toBe("/* custom */");
  });
});

// ---------------------------------------------------------------------------
// All theme names accepted
// ---------------------------------------------------------------------------

describe("injectCSS — all themes", () => {
  const themeNames = [
    "github-light",
    "github-dark",
    "github-auto",
    "material",
    "docusaurus",
  ] as const;

  for (const name of themeNames) {
    it(`accepts theme "${name}" without error`, () => {
      expect(() => injectCSS(name)).not.toThrow();
      expect(document.getElementById(STYLE_ID)).not.toBeNull();
      // Clean up for next iteration
      document.head.innerHTML = "";
    });
  }
});
