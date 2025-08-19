/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards14) block header
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Find all card containers in this block
  // .image-wrapper elements across all slides
  const cardNodes = element.querySelectorAll('.image-wrapper');
  cardNodes.forEach(cardNode => {
    // 1. Get the image (img element)
    const img = cardNode.querySelector('img');
    
    // 2. Get text content: name, location, credits
    const wrap = cardNode.querySelector('.content-wrap');
    let spans = wrap ? wrap.querySelectorAll('span') : [];
    let name = spans[0]?.textContent.trim() || '';
    let location = spans[1]?.textContent.trim() || '';
    let credits = spans[2]?.textContent.trim() || '';
    // Remove empty credit
    if (credits === '') credits = undefined;

    // Compose text cell, referencing existing DOM elements
    const textCell = document.createElement('div');
    if (name) {
      // Title as strong
      const strong = document.createElement('strong');
      strong.textContent = name;
      textCell.appendChild(strong);
    }
    if (location) {
      if (name) textCell.appendChild(document.createElement('br'));
      const locDiv = document.createElement('span');
      locDiv.textContent = location;
      textCell.appendChild(locDiv);
    }
    if (credits) {
      textCell.appendChild(document.createElement('br'));
      const credDiv = document.createElement('span');
      credDiv.textContent = credits;
      textCell.appendChild(credDiv);
    }
    // Add [img, textCell] only if image exists and text is non-empty
    if (img && (name || location || credits)) {
      rows.push([img, textCell]);
    }
  });
  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
