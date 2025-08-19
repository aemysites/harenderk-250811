/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by block spec
  const headerRow = ['Cards (cards58)'];
  const cards = [];

  // Locate the a tags representing cards
  // Defensive: only proceed if structure is as expected
  const cmpTextDiv = element.querySelector('.cmp-text > div');
  if (cmpTextDiv) {
    const aTags = Array.from(cmpTextDiv.querySelectorAll(':scope > a'));
    aTags.forEach(a => {
      // The first child is <img>, second child is info <div>
      const img = a.querySelector('img');
      const infoDiv = a.querySelector('div');
      let textCellContent;
      // Defensive: if infoDiv exists, use it; else fallback to entire <a>
      if (infoDiv) {
        textCellContent = infoDiv;
      } else {
        textCellContent = a;
      }
      cards.push([img, textCellContent]);
    });
  }

  // Only create the block if there are cards
  if (cards.length > 0) {
    const tableRows = [headerRow, ...cards];
    const block = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(block);
  }
}
