import { describe, it, expect, beforeEach } from "vitest";
import { scanDocusaurus } from "../src/scanner.js";
import { DEFAULT_CLASSES } from "../src/types.js";
import type { ResolvedConfig } from "../src/types.js";
import { docusaurusFixtures } from "./fixtures/docusaurus.fixtures.js";

function makeConfig(root: Element): ResolvedConfig {
  return {
    root,
    triggerStyle: "docusaurus",
    classes: { ...DEFAULT_CLASSES },
    theme: null,
  };
}

/** Create a container div with the fixture's innerHTML and run the scanner. */
function setupAndScan(html: string) {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  const config = makeConfig(container);
  scanDocusaurus(config);
  return container;
}

// Clean up after each test
beforeEach(() => {
  document.body.innerHTML = "";
});

// ---------------------------------------------------------------------------
// Positive transforms — single admonition
// ---------------------------------------------------------------------------

const singlePositive = docusaurusFixtures.filter(
  (f) => f.expectedType !== null && !f.expectedTypes,
);

describe("scanDocusaurus — positive transforms", () => {
  for (const fixture of singlePositive) {
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
        expect(iconEl!.getAttribute("aria-hidden")).toBe("true");
        expect(iconEl!.querySelector("svg")).not.toBeNull();

        // Body child count (children after the title element)
        if (fixture.expectedBodyChildCount !== undefined) {
          const bodyChildren = Array.from(output.children).slice(1);
          expect(bodyChildren.length).toBe(fixture.expectedBodyChildCount);
        }

        // Opening and closing <p> markers should be removed from the DOM
        const allPs = container.querySelectorAll("p");
        for (const p of allPs) {
          const text = p.textContent?.trim() ?? "";
          // No remaining opening markers or bare :::
          if (p.closest("[data-adomonitions]")) continue; // skip inside the output
          expect(text).not.toMatch(
            /^:::(note|tip|important|info|warning|caution|danger)/i,
          );
          expect(text).not.toBe(":::");
        }
      });
    });
  }
});

// ---------------------------------------------------------------------------
// Non-matching / malformed — DOM should NOT be modified
// ---------------------------------------------------------------------------

const negative = docusaurusFixtures.filter(
  (f) => f.expectedType === null && !f.expectedTypes,
);

describe("scanDocusaurus — non-matching", () => {
  for (const fixture of negative) {
    it(`${fixture.id}: ${fixture.description}`, () => {
      const container = setupAndScan(fixture.input);
      const wrapper = container.querySelector('[data-adomonitions="true"]');
      expect(wrapper).toBeNull();

      // DOM should be unchanged
      expect(container.innerHTML).toBe(fixture.input);
    });
  }
});

// ---------------------------------------------------------------------------
// Adjacent admonitions
// ---------------------------------------------------------------------------

const multiFixtures = docusaurusFixtures.filter((f) => f.expectedTypes);

describe("scanDocusaurus — multiple admonitions", () => {
  for (const fixture of multiFixtures) {
    it(`${fixture.id}: ${fixture.description}`, () => {
      const container = setupAndScan(fixture.input);
      const wrappers = container.querySelectorAll('[data-adomonitions="true"]');

      expect(wrappers.length).toBe(fixture.expectedCount);

      if (fixture.expectedTypes) {
        for (let i = 0; i < fixture.expectedTypes.length; i++) {
          expect(
            wrappers[i].classList.contains(
              `adomonitions-${fixture.expectedTypes[i]}`,
            ),
          ).toBe(true);
        }
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Surrounding content preservation
// ---------------------------------------------------------------------------

describe("scanDocusaurus — surrounding content", () => {
  it("content-before-and-after: preserves non-admonition siblings", () => {
    const container = setupAndScan(
      "<p>Before text.</p><p>:::tip</p><p>Tip body.</p><p>:::</p><p>After text.</p>",
    );

    // Should have: <p>Before</p>, <div wrapper>, <p>After</p>
    const children = Array.from(container.children);
    expect(children.length).toBe(3);

    expect(children[0].tagName).toBe("P");
    expect(children[0].textContent).toBe("Before text.");

    expect(children[1].getAttribute("data-adomonitions")).toBe("true");

    expect(children[2].tagName).toBe("P");
    expect(children[2].textContent).toBe("After text.");
  });
});

// ---------------------------------------------------------------------------
// Idempotency
// ---------------------------------------------------------------------------

describe("scanDocusaurus — idempotency", () => {
  it("calling scanDocusaurus twice does not double-process", () => {
    const container = document.createElement("div");
    container.innerHTML = "<p>:::note</p><p>Content.</p><p>:::</p>";
    document.body.appendChild(container);
    const config = makeConfig(container);

    scanDocusaurus(config);
    const firstPassHTML = container.innerHTML;

    scanDocusaurus(config);
    expect(container.innerHTML).toBe(firstPassHTML);

    const wrappers = container.querySelectorAll('[data-adomonitions="true"]');
    expect(wrappers.length).toBe(1);
  });
});
