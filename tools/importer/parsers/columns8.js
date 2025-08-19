/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must be exactly as in the example)
  const headerRow = ['Columns (columns8)'];

  // Find the form
  const form = element.querySelector('form');
  if (!form) return;

  // First row: Name | Organisation name | Telephone (3 columns)
  let row1 = [];
  const firstRow = form.querySelector('.row');
  if (firstRow) {
    const cols = firstRow.querySelectorAll(':scope > .col-12');
    if (cols.length >= 3) {
      row1.push(cols[0]); // Name
      row1.push(cols[1]); // Organisation name
      // Telephone is inside another .row in the 3rd col
      const telCol = cols[2].querySelector('.row .col-12');
      row1.push(telCol ? telCol : cols[2]);
    }
  }

  // Second row: Email | Query Related to (2 columns)
  let row2 = [];
  const queryCols = form.querySelectorAll('.col-12.col-md-6.col-space');
  if (queryCols.length >= 2) {
    row2.push(queryCols[0]); // Email
    row2.push(queryCols[1]); // Query related to
  }

  // Remaining rows: Each is a single block, placed in a one-column row
  const detailCol = form.querySelector('.col-12.col-sm-12.col-space');
  const privacy = form.querySelector('.tncWrap');
  const button = form.querySelector('.buttonWrap');

  // Compose table
  const cells = [
    headerRow,
    row1,
    row2,
  ];
  if (detailCol) cells.push([detailCol]);
  if (privacy) cells.push([privacy]);
  if (button) cells.push([button]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
