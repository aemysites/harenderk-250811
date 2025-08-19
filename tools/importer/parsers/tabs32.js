/* global WebImporter */
export default function parse(element, { document }) {
  // Header row - must match example exactly
  const headerRow = ['Tabs (tabs32)'];

  // Find the list of tabs
  const tabsList = element.querySelector('.common-tabs ul.nav-tabs');
  if (!tabsList) return;

  // Each <li> is a tab
  const tabLis = Array.from(tabsList.children);
  const tabRows = [];

  tabLis.forEach(li => {
    // Tab label: text of <a.nav-link>
    const tabLabelEl = li.querySelector('a.nav-link');
    const tabLabel = tabLabelEl ? tabLabelEl.textContent.trim() : '';

    // Tab content: Source HTML does not provide tab panel/content, only labels.
    // We must create an empty string for the content cell.
    // (If in future the HTML does include tab panels, this logic can be extended)
    tabRows.push([tabLabel, '']);
  });

  // Build the cells array for the table
  const cells = [headerRow, ...tabRows];

  // Create the block table and replace the element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
