/* global WebImporter */
export default function parse(element, { document }) {
  // Find all table elements within the given element
  const tables = element.querySelectorAll('table');
  if (!tables.length) return;

  tables.forEach((table) => {
    // The block table header row as specified by the example
    const headerRow = ['Table (bordered, tableBordered79)'];
    // For each row of the original table, collect the direct th/td elements only -- DO NOT wrap
    const tableRows = Array.from(table.rows).map(row => Array.from(row.cells));
    // Build the cells array: header + content rows
    const cells = [headerRow, ...tableRows];
    // Create the block table
    const blockTable = WebImporter.DOMUtils.createTable(cells, document);
    // Replace the original table with the new block table
    table.replaceWith(blockTable);
  });
}
