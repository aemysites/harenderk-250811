/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Columns (columns61)'];

  // Find the .row inside the main block
  const row = element.querySelector('.row');
  // Find all immediate child columns
  let cols = [];
  if (row) {
    // Only select direct children with column classes (to avoid accidental extra wrappers)
    cols = Array.from(row.children).filter(
      c => c.classList.contains('col-md-10') || c.classList.contains('col-md-2') || c.classList.contains('col-12') || c.classList.contains('col-3')
    );
  }

  // Edge case: if no columns found, fallback to all children
  if (cols.length === 0 && row) {
    cols = Array.from(row.children);
  }

  // Compose contents for each cell, referencing existing nodes
  const cellContents = cols.map(col => {
    // If col has children, include them all; otherwise, include textContent or empty string
    if (col.children.length > 0) {
      return Array.from(col.children);
    } else if (col.textContent && col.textContent.trim().length > 0) {
      return col.textContent.trim();
    } else {
      return '';
    }
  });

  // Build the table data: header row plus one content row
  const cells = [
    headerRow,
    cellContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
