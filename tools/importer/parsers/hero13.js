/* global WebImporter */
export default function parse(element, { document }) {
  // Header row - matches example exactly
  const headerRow = ['Hero (hero13)'];

  // Block does not contain background image, so image row is empty string per example
  const imageRow = [''];

  // Get all direct child divs of the element
  const divs = element.querySelectorAll(':scope > div');
  // Defensive: fallback if not found
  let contentCol = null;
  let ctaCol = null;
  if (divs.length === 2) {
    contentCol = divs[0];
    ctaCol = divs[1];
  } else {
    // fallback: try by class
    contentCol = element.querySelector('.col-md-10, .col-9');
    ctaCol = element.querySelector('.col-md-2, .col-3');
  }
  // Headline extraction
  let headline = contentCol ? contentCol.querySelector('h2') : null;
  // Subheading extraction
  let subhead = null;
  if (contentCol) {
    // Subhead is inside a p within an a, but robustly grab first p (there's only one in examples)
    subhead = contentCol.querySelector('p');
  }
  // CTA link extraction
  let ctaLink = ctaCol ? ctaCol.querySelector('a') : null;

  // Compose second cell: Use array of all present elements (in order: headline, subhead, cta)
  const contentArr = [];
  if (headline) contentArr.push(headline);
  if (subhead) contentArr.push(subhead);
  if (ctaLink) contentArr.push(ctaLink);

  const contentRow = [contentArr];

  // Compose the block table
  const cells = [headerRow, imageRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the newly created table
  element.replaceWith(blockTable);
}
