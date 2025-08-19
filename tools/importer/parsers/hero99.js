/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Hero (hero99)'];

  // Background Image row: No image exists in the provided HTML, so row is empty string
  const bgImageRow = [''];

  // Content row: extract title and CTA (if present)
  const content = [];

  // Extract all immediate child divs
  const divs = element.querySelectorAll(':scope > div');

  // Extract the first h2 inside divs as title
  let titleEl = null;
  divs.forEach(div => {
    if (!titleEl) {
      const h2 = div.querySelector('h2');
      if (h2) titleEl = h2;
    }
  });
  if (titleEl) {
    content.push(titleEl);
  }

  // Extract CTA if present (a.view-all-cta)
  let ctaEl = null;
  divs.forEach(div => {
    const a = div.querySelector('a.view-all-cta');
    if (a && !ctaEl) {
      ctaEl = a;
    }
  });
  if (ctaEl) {
    content.push(ctaEl);
  }

  // If neither title nor CTA, cell will be empty array
  const contentRow = [content];

  // Table cells as specified: header, bg image row, content row
  const tableCells = [headerRow, bgImageRow, contentRow];

  // Create and replace with the new block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
