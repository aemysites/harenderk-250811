/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match example exactly
  const cells = [['Cards (cards53)']];

  // Find the carousel track containing the cards
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Each .slick-slide contains one card
  const slides = slickTrack.querySelectorAll('.slick-slide');
  slides.forEach(slide => {
    // Card container
    const cardItem = slide.querySelector('.ig-carosuel-item, .ig-slide-item');
    if (!cardItem) return;

    // Image extraction: always use the actual <img>
    const img = cardItem.querySelector('img');

    // Text cell extraction: include title and subtitle
    const desc = cardItem.querySelector('.ig-common-desc-top');
    let textCell;
    if (desc) {
      // Use the actual desc element (contains h6 + p)
      textCell = desc;
    } else {
      // Fallback: concatenate any heading and p
      const frag = document.createElement('div');
      const heading = cardItem.querySelector('h6, h5, h4');
      const para = cardItem.querySelector('p');
      if (heading) frag.appendChild(heading);
      if (para) frag.appendChild(para);
      textCell = frag;
    }

    // Only add card row if we have both image and text
    if (img && textCell && (textCell.textContent.trim() !== '')) {
      cells.push([img, textCell]);
    }
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
