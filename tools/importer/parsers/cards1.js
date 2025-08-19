/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards1)'];
  const cells = [headerRow];

  // Find the card grid (most direct child with .commonAdOnsWrap)
  let grid = element.querySelector('.commonAdOnsWrap');
  if (!grid) {
    grid = Array.from(element.querySelectorAll('div')).find(div => div.classList && div.classList.contains('commonAdOnsWrap'));
  }
  if (!grid) return;

  // Each card is a .commonBottomAdon child
  const cards = Array.from(grid.children).filter(el => el.classList && el.classList.contains('commonBottomAdon'));
  cards.forEach(card => {
    // Find anchor, which wraps card content
    const anchor = card.querySelector('a');
    if (!anchor) return;

    // Find image (first img inside anchor)
    let img = anchor.querySelector('img');
    let imgCell = img || '';

    // Build the text cell by referencing the container of all text
    // Use .ig-common-desc-top if present, otherwise collect headings and paragraphs inside anchor
    let textContainer = anchor.querySelector('.ig-common-desc-top');
    let textCell;
    if (textContainer) {
      // Reference the whole container so formatting/structure is preserved
      textCell = textContainer;
    } else {
      // Fallback: collect h1-h6, p, span inside anchor
      const parts = Array.from(anchor.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span'));
      if (parts.length > 0) {
        textCell = parts;
      } else {
        textCell = '';
      }
    }

    cells.push([imgCell, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
