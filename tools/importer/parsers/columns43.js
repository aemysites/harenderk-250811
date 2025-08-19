/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the block root
  const refundSection = element.querySelector('.initiate-refund.section');
  if (!refundSection) return;

  // 2. Find the main container holding the columns
  const container = refundSection.querySelector('.container.track-refund-summary');
  if (!container) return;

  // 3. Each direct child of the container is a column (form, div, etc.)
  // Only include visible content blocks (forms, divs)
  const contentColumns = Array.from(container.children).filter(child => {
    // Only keep elements that are forms or divs with visible content
    // Ignore config, script, empty divs, etc.
    if(
      child.tagName === 'FORM' ||
      (child.tagName === 'DIV' && child.childNodes.length > 0 && !child.classList.contains('track-refund-config'))
    ) {
      return true;
    }
    return false;
  });

  // Edge case: If there are no visible columns, exit
  if(contentColumns.length === 0) return;

  // 4. Table header, exact match from example
  const headerRow = ['Columns (columns43)'];

  // 5. Second row: each column as a cell, referencing existing elements
  const contentRow = contentColumns;

  // 6. Create the columns block table
  const blockTable = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // 7. Replace the original element with the new block table
  element.replaceWith(blockTable);
}
