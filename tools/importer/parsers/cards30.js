/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards30)'];

  // Collect card rows
  const rows = Array.from(element.querySelectorAll(':scope > a')).map(card => {
    // Get image element (reference existing)
    const picture = card.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    
    // Get title text from <p> (reference existing)
    const p = picture ? picture.querySelector('p') : null;
    let textCellContent;
    if (p && p.textContent.trim()) {
      // Use <strong> for the card title
      const strong = document.createElement('strong');
      strong.textContent = p.textContent.trim();
      textCellContent = strong;
    } else {
      // Fallback: use alt text or link text if no <p>
      const strong = document.createElement('strong');
      if (img && img.alt) {
        strong.textContent = img.alt.trim();
      } else {
        strong.textContent = card.textContent.trim();
      }
      textCellContent = strong;
    }
    // Return row: [image, title]
    return [img, textCellContent];
  });

  // Compose table: header row + card rows
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with new block table
  element.replaceWith(block);
}
