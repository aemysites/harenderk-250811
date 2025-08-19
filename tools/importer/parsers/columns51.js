/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing columns
  const mainRow = element.querySelector('.row');
  if (!mainRow) return;

  // Find the two main columns
  const cols = mainRow.querySelectorAll(':scope > [class*=col-]');
  if (cols.length < 2) return;

  // ---- COL 1: Gather ALL content ----
  const col1 = cols[0];
  // Collect all visible child nodes from col1
  const col1Content = document.createElement('div');
  Array.from(col1.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
    col1Content.appendChild(node);
  });

  // ---- COL 2: Grab the first visible .neo-flight-image ----
  const col2 = cols[1];
  let col2Image = null;
  const neoFlightImages = col2.querySelectorAll('.neo-flight-image');
  for (const div of neoFlightImages) {
    if (!div.classList.contains('hidden')) {
      col2Image = div;
      break;
    }
  }
  if (!col2Image && neoFlightImages.length > 0) {
    col2Image = neoFlightImages[0];
  }
  if (!col2Image) {
    col2Image = document.createElement('div');
    Array.from(col2.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      col2Image.appendChild(node);
    });
  }

  // Build the cells array with a header row of ONE column, and a content row of TWO columns
  const headerRow = ['Columns (columns51)']; // exactly one column in the header
  const contentRow = [col1Content, col2Image]; // two columns for the content

  // To ensure correct output, we must create the table with rows of appropriate column counts
  // Use createTable as usual
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
