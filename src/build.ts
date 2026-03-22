/**
 * Shared output builder for admonition elements.
 *
 * Constructs the wrapper `<div>` with title and icon from parsed metadata.
 * Body content is appended by the caller (scanner) since the strategy
 * differs per trigger style.
 *
 * @module
 */

import type { ResolvedConfig } from "./types.js";
import { ARIA_ROLES } from "./types.js";
import { getIcon } from "./icons.js";
import type { ParsedAdmonition } from "./parse.js";

/**
 * Builds the admonition wrapper element (title + icon) from parsed metadata.
 *
 * @remarks
 * The returned element contains only the title bar. Callers are responsible
 * for appending body content, since GitHub clones nodes while Docusaurus
 * moves originals.
 *
 * @param parsed - The parsed admonition metadata (type and title).
 * @param doc - The document to create elements in.
 * @param config - Resolved configuration (class names).
 * @returns The constructed wrapper `<div>` element with title and icon.
 */
export function buildAdmonition(
  parsed: ParsedAdmonition,
  doc: Document,
  config: ResolvedConfig,
): HTMLElement {
  const { type, title } = parsed;
  const {
    wrapper: wrapperClass,
    title: titleClass,
    icon: iconClass,
  } = config.classes;

  const wrapper = doc.createElement("div");
  wrapper.className = `${wrapperClass} ${wrapperClass}-${type}`;
  wrapper.setAttribute("role", ARIA_ROLES[type]);
  wrapper.setAttribute("aria-label", title);
  wrapper.setAttribute("data-adomonitions", "true");

  const titleEl = doc.createElement("p");
  titleEl.className = titleClass;

  const iconSpan = doc.createElement("span");
  iconSpan.className = iconClass;
  iconSpan.setAttribute("aria-hidden", "true");
  iconSpan.innerHTML = getIcon(type);

  titleEl.appendChild(iconSpan);
  titleEl.appendChild(doc.createTextNode(` ${title}`));
  wrapper.appendChild(titleEl);

  return wrapper;
}
