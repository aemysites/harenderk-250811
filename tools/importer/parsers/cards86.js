/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per spec
  const headerRow = ['Cards (cards86)'];
  const rows = [headerRow];

  // Find the carousel track containing the cards
  const track = element.querySelector('.slick-track');
  if (!track) return;

  // Extract each card from .ig-slide-item
  const cardItems = Array.from(track.querySelectorAll('.ig-slide-item'));

  cardItems.forEach(cardRoot => {
    // Image (mandatory) - use existing <img> element
    const img = cardRoot.querySelector('img');

    // Title (mandatory) - use existing heading element
    let title = cardRoot.querySelector('.ig-common-title');
    if (title && !/^h/i.test(title.tagName)) {
      // If not already a heading, wrap in <h6>
      const h6 = document.createElement('h6');
      h6.textContent = title.textContent;
      title = h6;
    }

    // Description (optional): In this HTML, there is no extra description per card
    // We'll only use the title as text content in the second cell
    // If future HTML has more text, this will still work
    const textCell = [];
    if (title) {
      textCell.push(title);
    }

    // If for some reason there is more text in the cardRoot that's not in the heading, add that too
    // For example, any <p> tags or direct text
    Array.from(cardRoot.querySelectorAll('p')).forEach((p) => {
      if (p.textContent.trim()) {
        textCell.push(p);
      }
    });

    // Compose the row
    rows.push([
      img,
      textCell.length ? textCell : ''
    ]);
  });

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
