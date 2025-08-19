/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be a single column as per the example
  const headerRow = ['Tabs (tabs29)'];
  const rows = [headerRow];

  // Select the tabs navigation
  const tabsContainer = element.querySelector('.common-tabs ul.nav-tabs');
  if (!tabsContainer) return;

  // Get all tab <li> elements
  const tabLis = Array.from(tabsContainer.children).filter(child => child.tagName === 'LI');

  // For each tab, add a row with two columns: label (as <a> element), content (empty string, since not present)
  tabLis.forEach(li => {
    const link = li.querySelector('a');
    if (!link) return;
    rows.push([link, '']);
  });

  // Create table with the correct structure and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
