/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must exactly match 'Cards (cards82)'
  const headerRow = ['Cards (cards82)'];
  const rows = [headerRow];

  // Each card is inside .ig-slide-item
  const slideItems = element.querySelectorAll('.ig-slide-item');
  slideItems.forEach((slide) => {
    // Each .ig-slide-item > .col-lg-4. Defensive: may not exist.
    const card = slide.querySelector('.col-lg-4');
    if (!card) return;
    // The card link wraps the image and text
    const link = card.querySelector('a');
    let imageCell = null;
    let textCellContent = [];

    // Get image for first cell
    if (link) {
      const picture = link.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Get title, description and CTA for the second cell
    const textDiv = document.createElement('div');
    if (link) {
      const descTop = link.querySelector('.ig-common-desc-top');
      if (descTop) {
        // Title (h6)
        const h6 = descTop.querySelector('h6');
        if (h6 && h6.textContent.trim().length > 0) {
          const strong = document.createElement('strong');
          strong.textContent = h6.textContent.trim();
          textDiv.appendChild(strong);
        }
        // Description (p)
        const p = descTop.querySelector('p');
        if (p && p.textContent.trim().length > 0) {
          if (textDiv.childNodes.length > 0) {
            textDiv.appendChild(document.createElement('br'));
          }
          const span = document.createElement('span');
          span.textContent = p.textContent.trim();
          textDiv.appendChild(span);
        }
      }
      // Card-level CTA: if the link covers the whole card, don't repeat. If partial, include as text or button.
      // In this HTML, the CTA is the card itself, not separate.
    }
    textCellContent.push(textDiv);

    rows.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
