import { describe, it, expect } from "vitest";

describe("project setup", () => {
  it("jsdom environment is available", () => {
    expect(document).toBeDefined();
    expect(document.createElement).toBeInstanceOf(Function);
  });

  it("can import types", async () => {
    const types = await import("../src/types.js");
    expect(types.DEFAULTS.triggerStyle).toBe("github");
    expect(types.DEFAULTS.theme).toBe("github-light");
    expect(types.DEFAULT_CLASSES.wrapper).toBe("adomonitions");
  });
});
