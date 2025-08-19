/* global WebImporter */
export default function parse(element, { document }) {
  // Header must exactly match the example
  const headerRow = ['Cards (cards2)'];

  // Find carousel row
  const carouselRow = element.querySelector('.row');
  if (!carouselRow) return;

  // Get all cards
  const slides = carouselRow.querySelectorAll('.slick-slide > div > .col-md-3');
  if (!slides.length) return;

  const rows = Array.from(slides).map(card => {
    // Image element
    const img = card.querySelector('img');
    const imageCell = img || '';

    // Collect all child nodes of .ig-common-desc-top (including heading and any extra text)
    const descTop = card.querySelector('.ig-common-desc-top');
    let textCell = '';
    if (descTop) {
      // Reference original descTop element directly, so all its children (heading + description + any other markup) are included
      textCell = descTop;
    } else {
      textCell = card.textContent.trim(); // Fallback: all text from card
    }
    return [imageCell, textCell];
  });

  // Build and replace
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
