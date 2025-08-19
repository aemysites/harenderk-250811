/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main stats wrapper
  const statsWrapper = element.querySelector('.stats-ig-wrapper');
  if (!statsWrapper) return;

  // Find the row containing all the column blocks
  const columnsContainer = statsWrapper.querySelector('.d-flex');
  if (!columnsContainer) return;

  // Get the column block elements (each stat)
  const columnBlocks = Array.from(columnsContainer.children).filter(
    (child) => child.classList && child.classList.contains('wrapper-flight-blocks')
  );
  
  // Defensive: exit if no columns found
  if (!columnBlocks.length) return;

  // Header row: single cell, exactly as specified
  const headerRow = ['Columns (columns54)'];

  // Table second row: as many columns as needed
  const contentRow = columnBlocks;

  // Compose the table
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
