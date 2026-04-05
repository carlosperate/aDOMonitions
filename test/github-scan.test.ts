import { describe, it, expect, beforeEach } from "vitest";
import { scanGitHub } from "../src/scanner.js";
import { DEFAULT_CLASSES, DEFAULT_TYPE_CLASSES } from "../src/types.js";
import type { ResolvedConfig } from "../src/types.js";
import { githubFixtures } from "./fixtures/github.fixtures.js";

function makeConfig(root: Element): ResolvedConfig {
  return {
    root,
    triggerStyle: "github",
    classes: { ...DEFAULT_CLASSES, types: { ...DEFAULT_TYPE_CLASSES } },
    theme: null,
  };
}

/** Create a container with the fixture HTML and run the scanner. */
function setupAndScan(
  html: string,
  classOverrides?: ResolvedConfig["classes"],
) {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  const config = makeConfig(container);
  if (classOverrides) config.classes = classOverrides;
  scanGitHub(config);
  return container;
}

/** Body child elements from wrapper (everything after the title `<p>`). */
function getBodyChildren(wrapper: Element): Element[] {
  return Array.from(wrapper.children).slice(1);
}

function bodyHTML(elements: Element[]): string {
  return elements.map((el) => el.outerHTML).join("");
}

beforeEach(() => {
  document.body.innerHTML = "";
});

// ---------------------------------------------------------------------------
// Fixture-driven tests
// ---------------------------------------------------------------------------

const positive = githubFixtures.filter((f) => f.expectedType !== null);
const negative = githubFixtures.filter((f) => f.expectedType === null);

describe("scanGitHub — positive transforms", () => {
  for (const fixture of positive) {
    describe(fixture.id, () => {
      it(fixture.description, () => {
        const container = setupAndScan(fixture.input);
        const wrapper = container.querySelector('[data-adomonitions="true"]');

        expect(wrapper).not.toBeNull();
        const output = wrapper!;

        // Wrapper is a <div>
        expect(output.tagName).toBe("DIV");

        // Correct classes
        expect(output.classList.contains("adomonitions")).toBe(true);
        expect(
          output.classList.contains(`adomonitions-${fixture.expectedType}`),
        ).toBe(true);

        // data-adomonitions attribute
        expect(output.getAttribute("data-adomonitions")).toBe("true");

        // ARIA role
        if (fixture.expectedRole) {
          expect(output.getAttribute("role")).toBe(fixture.expectedRole);
        }

        // aria-label
        if (fixture.expectedTitle) {
          expect(output.getAttribute("aria-label")).toBe(fixture.expectedTitle);
        }

        // Title element
        const titleEl = output.querySelector(".adomonitions-title");
        expect(titleEl).not.toBeNull();
        expect(titleEl!.tagName).toBe("P");
        if (fixture.expectedTitle) {
          expect(titleEl!.textContent!.trim()).toContain(fixture.expectedTitle);
        }

        // Icon
        const iconEl = titleEl!.querySelector(".adomonitions-icon");
        expect(iconEl).not.toBeNull();
        expect(iconEl!.tagName).toBe("SPAN");
        expect(iconEl!.getAttribute("aria-hidden")).toBe("true");
        expect(iconEl!.querySelector("svg")).not.toBeNull();

        // Body content
        const bodyChildren = getBodyChildren(output);

        if (fixture.expectedBody !== undefined) {
          expect(bodyHTML(bodyChildren)).toBe(fixture.expectedBody);
        }

        if (fixture.expectedBodyChildCount !== undefined) {
          expect(bodyChildren.length).toBe(fixture.expectedBodyChildCount);
        }

        // Original blockquote should be replaced
        expect(container.querySelector("blockquote")).toBeNull();
      });
    });
  }
});

// ---------------------------------------------------------------------------
// Non-matching elements — blockquote should remain untouched
// ---------------------------------------------------------------------------

describe("scanGitHub — non-matching", () => {
  for (const fixture of negative) {
    it(`${fixture.id}: ${fixture.description}`, () => {
      const container = setupAndScan(fixture.input);

      // DOM should be unchanged
      expect(container.innerHTML).toBe(fixture.input);
    });
  }
});

// ---------------------------------------------------------------------------
// Custom class overrides
// ---------------------------------------------------------------------------

describe("scanGitHub — custom classes", () => {
  it("uses custom wrapper, title, and icon class names", () => {
    const container = setupAndScan(
      "<blockquote><p>[!NOTE]</p><p>Body.</p></blockquote>",
      {
        wrapper: "my-callout",
        title: "my-callout-title",
        icon: "my-callout-icon",
        types: { ...DEFAULT_TYPE_CLASSES, note: "my-callout-note" },
      },
    );
    const output = container.querySelector('[data-adomonitions="true"]')!;

    expect(output.classList.contains("my-callout")).toBe(true);
    expect(output.classList.contains("my-callout-note")).toBe(true);
    expect(output.querySelector(".my-callout-title")).not.toBeNull();
    expect(output.querySelector(".my-callout-icon")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Idempotency
// ---------------------------------------------------------------------------

describe("scanGitHub — idempotency", () => {
  it("calling scanGitHub twice does not double-process", () => {
    const container = document.createElement("div");
    container.innerHTML =
      "<blockquote><p>[!NOTE]</p><p>Content.</p></blockquote>";
    document.body.appendChild(container);
    const config = makeConfig(container);

    scanGitHub(config);
    const firstPassHTML = container.innerHTML;

    scanGitHub(config);
    expect(container.innerHTML).toBe(firstPassHTML);

    const wrappers = container.querySelectorAll('[data-adomonitions="true"]');
    expect(wrappers.length).toBe(1);
  });
});
