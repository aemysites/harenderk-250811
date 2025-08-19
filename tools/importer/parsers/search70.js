/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Search (search70)'];

  // Collect all visible and user-facing text content from the element
  const contentParts = [];

  // 1. Placeholder (from input)
  const input = element.querySelector('input[placeholder]');
  if (input && input.placeholder && input.placeholder.trim()) {
    contentParts.push(input.placeholder.trim());
  }

  // 2. Popular Searches label (if exists)
  const popularLabel = element.querySelector('.popular-destination .text');
  if (popularLabel && popularLabel.textContent.trim()) {
    contentParts.push(popularLabel.textContent.trim());
  }

  // 3. All location titles (city/country suggestions)
  const locationTitles = element.querySelectorAll('.dropdown-option .location-title');
  locationTitles.forEach(loc => {
    if (loc.textContent && loc.textContent.trim()) {
      contentParts.push(loc.textContent.trim());
    }
  });

  // If there is any text content, create a paragraph element for it
  let textContentEl = null;
  if (contentParts.length > 0) {
    textContentEl = document.createElement('p');
    textContentEl.textContent = contentParts.join(' | ');
  }

  // The query index URL must be included as a clickable link in the cell
  // This is the same as in the block spec/example
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const link = document.createElement('a');
  link.href = queryIndexUrl;
  link.textContent = queryIndexUrl;

  // Compose the cell: ensure all extracted text and the link are included, preserving order
  const cellContent = textContentEl ? [textContentEl, link] : [link];

  // Build the block table in the required structure
  const cells = [
    headerRow,
    [cellContent]
  ];

  // Create table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
