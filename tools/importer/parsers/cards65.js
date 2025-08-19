/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must match exactly
  const headerRow = ['Cards (cards65)'];
  const cells = [headerRow];

  // Find the carousel root - use a flexible query for source variations
  // Get all cards (.promotional-slide--carosuel--item inside .slick-slide)
  const slides = element.querySelectorAll('.servicescarousel .promotional-slide .slick-slide');
  slides.forEach((slide) => {
    // Find the card wrapper
    const card = slide.querySelector('.promotional-slide--carosuel--item') || slide.querySelector('.get-inspired-carausel');
    if (!card) return;
    // Find the image in the card
    const img = card.querySelector('img');

    // For text content, gather all children of .get-inspired-carausel--description, or fallback to all <p>
    let textCellContent = [];
    const descBox = card.querySelector('.get-inspired-carausel--description');
    if (descBox) {
      // Include all elements (not clone!), not just <p>
      Array.from(descBox.childNodes).forEach(node => {
        if (node.nodeType === 1 || node.nodeType === 3) {
          // If element or text node and not empty
          if (node.nodeType === 3 && !node.textContent.trim()) return;
          textCellContent.push(node);
        }
      });
    } else {
      // Fallback: include all <p> children
      card.querySelectorAll('p').forEach(p => textCellContent.push(p));
    }
    // Defensive: if no text found, fallback to all textContent
    if (textCellContent.length === 0) {
      const txt = card.textContent.trim();
      if (txt) {
        const p = document.createElement('p');
        p.textContent = txt;
        textCellContent.push(p);
      }
    }
    // Defensive: only add row if both image and text
    if (!img || textCellContent.length === 0) return;
    cells.push([
      img,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });
  // Create and replace table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
