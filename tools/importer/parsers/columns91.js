/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, exactly as in the example
  const headerRow = ['Columns (columns91)'];

  // Find the container holding the columns (stat blocks)
  const flex = element.querySelector('.d-flex');
  if (!flex) return;

  // Each direct child is a column
  const statBlocks = Array.from(flex.children).filter(child => child.classList.contains('wrapper-flight-blocks'));

  // Defensive: If there are no stat blocks, fallback to using the flex block as a single column
  const columnsRow = statBlocks.length ? statBlocks : [flex];

  // Final cells array: header is a single-cell row, second row is N columns
  const cells = [
    headerRow,
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
