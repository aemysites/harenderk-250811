/* global WebImporter */
export default function parse(element, { document }) {
  // Find the form (contains all inputs and button)
  const form = element.querySelector('form.retrieve-pnr-form');
  if (!form) return;

  // Find all input-boxes
  const inputBoxes = Array.from(form.querySelectorAll('.form-row .input-box'));
  // Find the button
  const button = form.querySelector('.form-button-container button');

  // Build the main row: inputs then button
  const row = [
    inputBoxes[0] || '',
    inputBoxes[1] || '',
    button || ''
  ];
  const columnsCount = row.length;

  // Use WebImporter.DOMUtils.createTable to make the table
  let cells = [];
  // Create header row as a single cell, matching the exact example
  cells.push(['Columns (columns50)']);
  cells.push(row);
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Fix header row to span all columns
  const headerTr = block.querySelector('tr:first-child');
  const headerTh = headerTr && headerTr.querySelector('th');
  if (headerTh && columnsCount > 1) {
    headerTh.setAttribute('colspan', columnsCount);
  }

  // Replace the element
  element.replaceWith(block);
}
