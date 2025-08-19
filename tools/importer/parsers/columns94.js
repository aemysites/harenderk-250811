/* global WebImporter */
export default function parse(element, { document }) {
  // Block name for header
  const headerRow = ['Columns (columns94)'];
  // Find row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = Array.from(row.children);
  // We'll create 2 columns: Left (heading) and Right (view all link)
  let leftCol = null;
  let rightCol = null;
  cols.forEach(col => {
    // The left column has the heading content
    if (col.querySelector('h2')) {
      leftCol = col.querySelector('h2'); // Reference the actual heading element
    }
    // The right column has the 'View All' link
    if (col.querySelector('a')) {
      rightCol = col.querySelector('a'); // Reference the actual link element
    }
  });
  // Fallback: if not found, use empty placeholder so table structure is preserved
  if (!leftCol) leftCol = document.createElement('div');
  if (!rightCol) rightCol = document.createElement('div');
  const cellsRow = [leftCol, rightCol];
  // Create the table in the required structure
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellsRow
  ], document);
  // Replace original element with block table
  element.replaceWith(table);
}
