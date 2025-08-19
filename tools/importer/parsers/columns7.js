/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main block root containing the columns
  let blockRoot = element.querySelector('.ig-contact-us.contactus-custom.ig-common-bottom');
  if (!blockRoot) blockRoot = element;

  // Find the row with the columns
  let row = blockRoot.querySelector('.row');
  if (!row) row = blockRoot;

  // Find all direct children columns
  let columns = Array.from(row.children).filter((div) => div.classList.contains('col-12'));
  if (columns.length === 0) {
    columns = Array.from(row.querySelectorAll(':scope > .col-12'));
  }

  // Extract content from each column, preserving semantic structure and existing elements
  const columnCells = columns.map((col) => {
    // 1. Call column (contains .contact-phone-opt)
    const phoneBlock = col.querySelector('.contact-phone-opt');
    if (phoneBlock) {
      // Reference the full phoneBlock for maximum resilience
      return phoneBlock;
    }
    // 2. Feedback column (contains .contact-email-opt as an <a>)
    const feedbackLink = col.querySelector('a.contact-email-opt');
    if (feedbackLink) {
      return feedbackLink;
    }
    // 3. Chat column (contains .contact-us-contact-option-chat as an <a>)
    const chatLink = col.querySelector('a.contact-us-contact-option-chat');
    if (chatLink) {
      return chatLink;
    }
    // Fallback: return whole column if structure changes
    return col;
  });

  // Header row must be a single cell exactly as specified
  const headerRow = ['Columns (columns7)']; // length 1, not length = columns.length
  const cells = [
    headerRow,
    columnCells
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
