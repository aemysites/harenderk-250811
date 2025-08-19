/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards98)'];
  const cells = [headerRow];

  // The carousel 'track' contains all the cards as direct children
  const track = element.querySelector('.slick-list .slick-track');
  if (!track) return;
  const slides = track.querySelectorAll(':scope > .slick-slide');

  slides.forEach((slide) => {
    // Card container
    const card = slide.querySelector('div > div.col-md-3.ig-slide-item');
    if (!card) return;
    // Find img
    const img = card.querySelector('.picture-effects img');
    // Find title text (may be in h6 or .ig-common-title)
    let title = card.querySelector('.ig-common-title');
    let textCell;
    if (title) {
      // Use a <div> for text cell to allow for possible future description expansion
      const div = document.createElement('div');
      // Use <strong> for the title as in the example
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      div.appendChild(strong);
      textCell = div;
    } else {
      textCell = '';
    }
    cells.push([
      img ? img : '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
