/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per specification
  const headerRow = ['Cards (cards96)'];
  const cells = [headerRow];
  // get the carousel track containing all cards
  const track = element.querySelector('.slick-track');
  if (track) {
    // Each .slick-slide represents a card
    const slides = track.querySelectorAll('.slick-slide');
    slides.forEach((slide) => {
      // Each slide contains a card (image + text)
      const cardContainer = slide.querySelector('.col-md-3.ig-slide-item.ig-carosuel-item');
      if (!cardContainer) return;
      // Image/Icon (mandatory)
      const iconDiv = cardContainer.querySelector('.ig-icon-discount');
      let imgEl = null;
      if (iconDiv) {
        const img = iconDiv.querySelector('img');
        if (img) {
          imgEl = img;
        }
      }
      // Text content (mandatory)
      const textSpan = cardContainer.querySelector('.ig-latest-text-second');
      let textEl = null;
      if (textSpan) {
        textEl = textSpan;
      }
      // Push the card row: [Image/Icon, TextContent]
      cells.push([imgEl, textEl]);
    });
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
