/* global WebImporter */
export default function parse(element, { document }) {
  // Build the cells array for the columns block table
  // Header row: must be a single cell with EXACT text
  const cells = [['Columns (columns75)']];

  // Second row: each cell is one column's content
  const columns = Array.from(element.querySelectorAll(':scope > .col-md-2'));
  const columnCells = columns.map(col => col);

  cells.push(columnCells);

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
