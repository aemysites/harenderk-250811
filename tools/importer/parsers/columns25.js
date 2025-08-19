/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be a single column ONLY, matching the example
  const headerRow = ['Columns (columns25)'];

  // Extract column elements from the widget container
  const fromCol = element.querySelector('.from-destination');
  const toCol = element.querySelector('.to-destination');
  const dateCol = element.querySelector('.date-container');
  const searchButton = element.querySelector('button.custom-button');
  let searchCell = '';
  if (searchButton) {
    // Wrap button in a div for consistency
    const div = document.createElement('div');
    div.appendChild(searchButton);
    searchCell = div;
  }

  // Second row: must be an array with as many cells as columns
  const columnsRow = [fromCol, toCol, dateCol, searchCell];

  // Compose the cells array: first row is a single header cell, second row is multiple columns
  const cells = [headerRow, columnsRow];

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
