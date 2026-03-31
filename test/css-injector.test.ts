import { describe, it, expect, beforeEach } from "vitest";
import { injectCSS } from "../src/css-injector.js";
import { expectedCoreCSS, expectedThemeCSS } from "./helpers/css.js";

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

  it("sets data-theme attribute to the active theme name", () => {
    injectCSS("github-light");

    const style = document.getElementById(STYLE_ID);
    expect(style!.getAttribute("data-theme")).toBe("github-light");
  });

  it("contains core structural CSS", () => {
    injectCSS("github-light");

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(expectedCoreCSS);
  });

  it("contains the requested theme CSS", () => {
    injectCSS("github-light");

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(expectedThemeCSS["github-light"]);
  });

  it("injects the correct theme when a different theme is specified", () => {
    injectCSS("material");

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(expectedCoreCSS);
    expect(style!.textContent).toContain(expectedThemeCSS["material"]);
    expect(style!.getAttribute("data-theme")).toBe("material");
  });

  it("core CSS appears before theme CSS", () => {
    injectCSS("github-light");

    const content = document.getElementById(STYLE_ID)!.textContent!;
    const coreIndex = content.indexOf(expectedCoreCSS);
    const themeIndex = content.indexOf(expectedThemeCSS["github-light"]);
    expect(coreIndex).toBeGreaterThanOrEqual(0);
    expect(themeIndex).toBeGreaterThan(coreIndex);
  });
});

// ---------------------------------------------------------------------------
// Idempotency (same theme)
// ---------------------------------------------------------------------------

describe("injectCSS — same theme idempotency", () => {
  it("does not inject a second <style> if one already exists", () => {
    injectCSS("github-light");
    injectCSS("github-light");

    const styles = document.querySelectorAll(`#${STYLE_ID}`);
    expect(styles.length).toBe(1);
  });

  it("does not change content when called again with same theme", () => {
    injectCSS("github-light");
    const firstContent = document.getElementById(STYLE_ID)!.textContent;

    injectCSS("github-light");

    expect(document.getElementById(STYLE_ID)!.textContent).toBe(firstContent);
  });
});

// ---------------------------------------------------------------------------
// Theme switching
// ---------------------------------------------------------------------------

describe("injectCSS — theme switching", () => {
  it("replaces content when called with a different theme", () => {
    injectCSS("github-light");
    injectCSS("material");

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(expectedThemeCSS["material"]);
    expect(style!.getAttribute("data-theme")).toBe("material");
  });

  it("still contains core CSS after theme switch", () => {
    injectCSS("github-light");
    injectCSS("material");

    const style = document.getElementById(STYLE_ID);
    expect(style!.textContent).toContain(expectedCoreCSS);
  });

  it("does not create a second <style> element on theme switch", () => {
    injectCSS("github-light");
    injectCSS("material");

    const styles = document.querySelectorAll(`#${STYLE_ID}`);
    expect(styles.length).toBe(1);
  });

  it("no longer contains the previous theme CSS after switch", () => {
    injectCSS("github-light");
    injectCSS("material");

    const content = document.getElementById(STYLE_ID)!.textContent!;
    expect(content).not.toContain(expectedThemeCSS["github-light"]);
  });
});

// ---------------------------------------------------------------------------
// Manually added style element
// ---------------------------------------------------------------------------

describe("injectCSS — manual style element", () => {
  it("skips injection if a style with the id was manually added (no data-theme)", () => {
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
    it(`accepts theme "${name}" without error`, () => {
      expect(() => injectCSS(name)).not.toThrow();
      const style = document.getElementById(STYLE_ID);
      expect(style).not.toBeNull();
      expect(style!.textContent!.length).toBeGreaterThan(0);
      // Clean up for next iteration
      document.head.innerHTML = "";
    });
  }
});
