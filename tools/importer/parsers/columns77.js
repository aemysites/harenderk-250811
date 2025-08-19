/* global WebImporter */
export default function parse(element, { document }) {
  // Get all tuples (blocks of left/right columns)
  const tuples = element.querySelectorAll('.office-add-tupple');
  // Determine max number of columns in any row (should always be 2 here)
  let maxCols = 0;
  const contentRows = [];

  tuples.forEach(tuple => {
    const rowDiv = tuple.querySelector('.row');
    if (!rowDiv) return;
    const cols = rowDiv.querySelectorAll(':scope > div');
    if (cols.length < 2) return;

    // Left cell: full content
    const leftCol = cols[0];
    // Right cell: if iframe, convert to link
    const iframe = cols[1].querySelector('iframe');
    let rightContent;
    if (iframe && iframe.src) {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = 'View map';
      rightContent = link;
    } else {
      rightContent = cols[1];
    }
    contentRows.push([leftCol, rightContent]);
    if (cols.length > maxCols) maxCols = cols.length;
  });

  // Create header row with single cell that will span all columns
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Columns (columns77)';
  if (maxCols > 1) {
    headerCell.colSpan = maxCols;
  }
  const headerRow = [headerCell];

  // Build table from header and rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...contentRows
  ], document);
  element.replaceWith(table);
}
