/* global WebImporter */
export default function parse(element, { document }) {
  // Find the sitemap row containing all columns
  const row = element.querySelector('.row.sitemap');
  if (!row) return;

  // Find all direct children .col-6 (the columns)
  const colEls = row.querySelectorAll(':scope > .col-6');
  if (!colEls.length) return;

  // Helper to extract all section groups (h4 + ul) in a column
  function extractColumnContent(colEl) {
    const groups = [];
    // In a column, find all h4.sitemap
    const h4s = colEl.querySelectorAll('h4.sitemap');
    h4s.forEach((h4) => {
      // Group the h4 with the following ul.sitemap, if any
      let ul = h4.nextElementSibling;
      while (ul && (ul.nodeType !== 1 || !ul.matches('ul.sitemap'))) {
        ul = ul.nextElementSibling;
      }
      if (ul) {
        // Group h4 and ul in a wrapper div
        const groupDiv = document.createElement('div');
        groupDiv.appendChild(h4);
        groupDiv.appendChild(ul);
        groups.push(groupDiv);
      }
    });
    // If nothing found, just use the column as fallback
    if (groups.length === 0) {
      return colEl;
    } else if (groups.length === 1) {
      return groups[0];
    }
    // Otherwise, wrap all groups in a div
    const colDiv = document.createElement('div');
    groups.forEach(g => colDiv.appendChild(g));
    return colDiv;
  }

  // Compose table cells
  const headerRow = ['Columns (columns47)'];
  const contentRow = Array.from(colEls).map(extractColumnContent);
  const cells = [headerRow, contentRow];

  // Create and replace with the new table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
