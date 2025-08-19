/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row must match the example exactly
  const headerRow = ['Columns (columns21)'];

  // 2. Get the .row direct child
  const row = element.querySelector(':scope > .row');

  // 3. Extract left and right column content preserving all text and structure
  let leftCell = '';
  let rightCell = '';

  if (row) {
    // LEFT COLUMN: .col-md-10 or .col-12
    const leftCol = row.querySelector('.col-md-10, .col-12');
    if (leftCol) {
      // Reference all children, including both element and non-empty text nodes
      const leftParts = Array.from(leftCol.childNodes)
        .filter(n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
      // If only one part, use that directly; if multiple, use array; if none, use trimmed text
      if (leftParts.length === 1) {
        leftCell = leftParts[0];
      } else if (leftParts.length > 1) {
        leftCell = leftParts;
      } else {
        leftCell = leftCol.textContent.trim();
      }
    }

    // RIGHT COLUMN: .col-md-2 or .col-3
    const rightCol = row.querySelector('.col-md-2, .col-3');
    if (rightCol) {
      const rightParts = Array.from(rightCol.childNodes)
        .filter(n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
      if (rightParts.length === 1) {
        rightCell = rightParts[0];
      } else if (rightParts.length > 1) {
        rightCell = rightParts;
      } else {
        rightCell = rightCol.textContent.trim();
      }
    }
  } else {
    // Fallback: use all content from element if .row is missing
    leftCell = element.innerHTML;
    rightCell = '';
  }

  // 4. Compose cells array (table rows)
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // 5. Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
