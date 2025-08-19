/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row containing all stats columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Get all stat columns
  const statCols = Array.from(row.children).filter(child => child.classList.contains('innerwrap-stats'));
  if (statCols.length === 0) return;
  // The header row should be a single cell
  const cells = [
    ['Columns (columns3)'], // header row: single column
    statCols                // second row: each stat column as one cell
  ];
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(table);
}
