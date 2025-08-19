/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Columns (columns9)'];

  // Find the three main column containers in order
  // Use direct descendant traversal because multiple wrappers exist
  const aboutIndigo = element.querySelector('.aboutIndigo');
  if (!aboutIndigo) return;
  const grid = aboutIndigo.querySelector('.aem-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children).filter(c => c.classList.contains('text') && c.classList.contains('accordRow'));

  // Defensive: If no columns found, bail
  if (!columns.length) return;

  // For each, get the cmp-text div (holds the heading and paragraph)
  const cells = columns.map(col => {
    const content = col.querySelector('.cmp-text');
    // If cmp-text is missing, fallback to the column itself
    return content || col;
  });

  // If fewer than 3 columns, pad to maintain structure
  while (cells.length < 3) {
    cells.push(document.createElement('div'));
  }

  // Compose the table: header and one row of columns
  const tableData = [
    headerRow,
    cells
  ];

  // Use the provided helper to create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
