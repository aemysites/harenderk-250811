/* global WebImporter */
export default function parse(element, { document }) {
  // Find all top-level columns in the grid
  const columns = Array.from(element.querySelectorAll(':scope > div.container > div.contact-other-loc > div.row > div.col-12'));
  // Extract block sections in order: FAQ, Ask Us, International Reservation Centres
  const faqCol = columns[0]?.querySelector(':scope > div.section') || columns[0];
  const askUsCol = columns[1]?.querySelector(':scope > div.section') || columns[1];
  const intlCol = columns[2]?.querySelector(':scope > div.section') || columns[2];

  // Compose the table as a 2x2 grid (as in the markdown example)
  const headerRow = ['Columns (columns31)'];
  const firstRow = [faqCol, askUsCol];
  const secondRow = [intlCol, null]; // Second cell is intentionally empty (no 4th block)
  const cells = [headerRow, firstRow, secondRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
