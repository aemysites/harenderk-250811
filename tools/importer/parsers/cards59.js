/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cards block section within the HTML
  const cardsWrap = element.querySelector('.addonsandservices.section .commonAdOnsWrap');
  if (!cardsWrap) return;
  const cardEls = Array.from(cardsWrap.querySelectorAll('.commonBottomAdon'));
  if (!cardEls.length) return;

  // Create the header row exactly as shown in the example
  const rows = [['Cards (cards59)']];

  cardEls.forEach((card) => {
    // Find the image for the card
    const img = card.querySelector('img');
    // Gather all text content for the card (title and description)
    const descTop = card.querySelector('.ig-common-desc-top');
    const textCell = [];

    if (descTop) {
      // Iterate through children to preserve formatting and semantic meaning
      Array.from(descTop.childNodes).forEach((node) => {
        // If node is an element and has text, preserve tags (e.g., h6 for title, p for description)
        if (node.nodeType === 1) {
          // If it's a heading, style with <strong> as in example
          if (node.tagName === 'H6') {
            const strong = document.createElement('strong');
            strong.textContent = node.textContent.trim();
            textCell.push(strong);
            textCell.push(document.createElement('br'));
          } else if (node.tagName === 'P') {
            textCell.push(node);
          } else {
            textCell.push(node);
          }
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // If it's a non-empty text node, preserve it
          textCell.push(document.createTextNode(node.textContent.trim()));
        }
      });
      // Remove extra <br> at the end if present
      if (textCell.length && textCell[textCell.length - 1].tagName === 'BR') {
        textCell.pop();
      }
    }

    rows.push([
      img,
      textCell.length === 1 ? textCell[0] : textCell
    ]);
  });

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
