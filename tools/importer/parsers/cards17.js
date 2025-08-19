/* global WebImporter */
export default function parse(element, { document }) {
  // Block header matches example
  const headerRow = ['Cards (cards17)'];

  // Find the carousel/slides container reliably
  const carousel = element.querySelector('.ig-horizontal-slide-mobile');
  if (!carousel) return;
  // Get all card slides
  const slides = carousel.querySelectorAll('.slick-slide');
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each slide: get its card item
    const card = slide.querySelector('.promotional-slide--carosuel--item');
    if (!card) return;
    // Get image (always present)
    const img = card.querySelector('.get-inspired-carausel--image');

    // Get text content (title and description)
    const textCellContent = [];
    const desc = card.querySelector('.get-inspired-carausel--description');
    if (desc) {
      // Title (must preserve heading semantics).
      const title = desc.querySelector('.get-inspired-carausel--title');
      if (title) {
        // Use original heading if present, or create h3
        let heading = title;
        if (!/^h/i.test(title.tagName)) {
          // If not a heading, create one
          heading = document.createElement('h3');
          heading.textContent = title.textContent;
        }
        textCellContent.push(heading);
      }
      // Description: use the div as-is (contains <p> and <br>). Ensure all text included.
      const subtitle = desc.querySelector('.get-inspired-carausel--subtitle');
      if (subtitle) {
        textCellContent.push(subtitle);
      }
    }
    // No explicit CTA in the source HTML - link is only a wrapper
    // Add row only if image and text content is present
    if (img && textCellContent.length) {
      rows.push([img, textCellContent]);
    }
  });

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
