/* global WebImporter */
export default function parse(element, { document }) {
  // The block name as the header row, exactly as required
  const headerRow = ['Accordion (accordion101)'];
  const rows = [headerRow];

  // This function finds all top-level li.panel.panel-default.panel-heading elements that are direct accordion items
  // (not those in nested accordions)
  function getTopLevelPanels(root) {
    // The top-level panels are under: .container > div[role=tablist].carriage-conditions-wrapper > ul.accordion-group > div.accordionpanel.section > li.panel.panel-default.panel-heading
    const tablists = root.querySelectorAll(':scope > .container > div[role="tablist"].carriage-conditions-wrapper, :scope > .container > div[role="tablist"].panel-group');
    let panels = [];
    tablists.forEach(tablist => {
      const groupPanels = tablist.querySelectorAll(':scope > ul.accordion-group > div.accordionpanel.section > li.panel.panel-default.panel-heading');
      groupPanels.forEach(p => panels.push(p));
    });
    return panels;
  }

  // Find all top-level panels to be rows in the table
  const panels = getTopLevelPanels(element);

  panels.forEach(panel => {
    // Title cell: the <a> element's first <span> (the label)
    let title = '';
    const a = panel.querySelector(':scope > a');
    if (a) {
      const span = a.querySelector('span');
      if (span) {
        title = span.textContent.trim();
      } else {
        title = a.textContent.trim();
      }
    }
    // Content cell: the direct .collapse (which contains the body, possibly with nested accordions)
    let content = '';
    const collapse = panel.querySelector(':scope > div.collapse');
    if (collapse) {
      content = collapse;
    }
    rows.push([title, content]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
