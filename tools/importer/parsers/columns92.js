/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: MUST be exactly one cell, matching example
  const headerRow = ['Columns (columns92)'];

  // Find columns = immediate children of .container__links
  const linksContainer = element.querySelector('.container__links');
  if (!linksContainer) return;

  // Each .container__links__item is a column
  const colNodes = Array.from(linksContainer.querySelectorAll(':scope > .container__links__item'));

  // Each cell should contain the accordion's title and its links
  const contentCells = colNodes.map(col => {
    const accordion = col.querySelector('.cmp-accordion__item');
    if (!accordion) return document.createElement('div'); // Defensive
    // Header text (from <button> inside <h3>)
    const button = accordion.querySelector('h3 .cmp-accordion__button');
    let headerText = '';
    if (button) {
      button.childNodes.forEach(n => {
        if (n.nodeType === 3) headerText += n.textContent;
      });
      headerText = headerText.trim();
    }
    const strong = document.createElement('strong');
    strong.textContent = headerText;
    // Links list
    const panel = accordion.querySelector('.cmp-accordion__panel');
    let ul = panel ? panel.querySelector('ul.child-links') : null;
    // Compose cell content
    return ul ? [strong, ul] : strong;
  });

  // Table rows: header (single cell), then columns (array of cells)
  const tableRows = [headerRow, contentCells];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
