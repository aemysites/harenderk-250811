/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion56)'];
  const rows = [];

  // Helper: find all top-level accordionpanel.section inside the given 'element'
  // (both as direct children or via ULs, for resiliency to HTML structure)
  let panels = Array.from(element.querySelectorAll(':scope > div.accordionpanel.section'));
  if (panels.length === 0) {
    // Try common fallback structure: they are under a UL.accordion-group as <div.accordionpanel.section>
    panels = Array.from(element.querySelectorAll(':scope ul.accordion-group > div.accordionpanel.section'));
  }

  panels.forEach(panel => {
    // Expect a <li class="panel panel-default panel-heading"> inside each accordionpanel
    const li = panel.querySelector('li.panel-heading, li.panel.panel-default.panel-heading');
    if (!li) return;

    // Find the clickable title: <a ...> <span>Title</span> ... </a>
    let titleEl = null;
    const a = li.querySelector('a.panel-title, a[data-toggle]');
    if (a) {
      // The clickable label is in the first <span> in the <a>
      const span = a.querySelector('span');
      titleEl = span ? span : document.createTextNode(a.textContent.trim());
    } else {
      // Fallback: take first element or text
      titleEl = li.textContent.trim() ? document.createTextNode(li.textContent.trim()) : '';
    }

    // Find the content: <div.role="tabpanel">...
    let contentEl = null;
    const collapse = li.querySelector('div[role="tabpanel"]');
    if (collapse) {
      // Prefer the .textblock.section inside collapse as semantic content
      const textblock = collapse.querySelector('.textblock.section');
      if (textblock) {
        contentEl = textblock;
      } else {
        // Fallback: use the collapse div itself
        contentEl = collapse;
      }
    } else {
      // Some panels may not have content
      contentEl = '';
    }

    rows.push([titleEl, contentEl]);
  });

  // Create the block table: always header, then rows, 2 columns
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
