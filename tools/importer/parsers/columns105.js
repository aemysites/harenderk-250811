/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns105)'];

  // --- Extract Left Column (Menu) ---
  // The left navigation menu is inside the first .col-lg-2
  const leftCol = element.querySelector('.col-lg-2');
  // We'll use the entire left column, as its structure is significant (contains headings and all menu links)

  // --- Extract Right Column (Main Content) ---
  // The right column is inside the .col-12.col-lg-10
  const rightCol = element.querySelector('.col-12.col-lg-10');
  // We'll use the entire right column, as it includes headings, banner/image, instructions, form, etc.

  // If either column is missing, use an empty string for fallback
  const rowColumns = [
    leftCol || '',
    rightCol || ''
  ];

  // Construct table rows
  const rows = [headerRow, rowColumns];

  // Create table block
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element in the document
  element.replaceWith(blockTable);
}
