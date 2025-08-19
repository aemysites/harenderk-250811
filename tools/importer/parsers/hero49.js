/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name
  const headerRow = ['Hero (hero49)'];

  // Background image row: none in source
  const backgroundImageRow = [''];

  // Content row: collect all content that is visually part of the banner
  // We want all text and CTA (button)
  // Select the .common-info--banners--block--right (contains all visible banner content)
  const right = element.querySelector('.common-info--banners--block--right');
  let contentCell;
  if (right) {
    // Reference the block itself (allows for structure, ensures all text/CTA is included)
    contentCell = [right];
  } else {
    // Fallback: gather all <p> and <a> directly under element (should not be needed for this structure, but ensures robustness)
    const fallback = [];
    element.querySelectorAll('p, a').forEach(el => fallback.push(el));
    contentCell = fallback.length ? fallback : [''];
  }

  const cells = [
    headerRow,
    backgroundImageRow,
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
