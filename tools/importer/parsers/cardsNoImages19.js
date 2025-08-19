/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the 'Customize your journey' block
  // The cards block is the .skyplus-card--align-center .cmp-text
  const headerRow = ['Cards'];
  const rows = [];

  // Defensive: find the block
  const cardsBlock = element.querySelector('.skyplus-card--align-center .cmp-text > div');
  if (cardsBlock) {
    // Each <a> is a card containing icon (possibly <i> or <img>), <h3> (title), <span> with description/CTA
    const cardLinks = Array.from(cardsBlock.querySelectorAll('a'));
    cardLinks.forEach((a) => {
      // We'll accumulate the content in proper order: icon/img, heading, description/CTA (all direct children)
      const parts = [];
      // Only add direct children (to preserve structure and formatting)
      Array.from(a.childNodes).forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent.trim())) {
          parts.push(child);
        }
      });
      rows.push([parts]);
    });
  }
  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
    element.replaceWith(table);
  }
}
