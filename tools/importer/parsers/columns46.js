/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all direct children divs (each column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Build the header row: a single cell with the block name
  const headerRow = ['Columns (columns46)'];
  // Content row: one cell per column
  const contentRow = columns.map(col => col);
  // If there are fewer than 3 columns, pad with empty string
  while (contentRow.length < 3) contentRow.push('');
  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
