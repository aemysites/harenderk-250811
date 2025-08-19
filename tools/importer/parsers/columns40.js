/* global WebImporter */
export default function parse(element, { document }) {
  // Get references for each visual column
  function getFooterColumns(footerRoot) {
    // Use .ig-footer-accordion for navigation columns (first 3 with content)
    const accordion = footerRoot.querySelector('.ig-footer-accordion');
    if (!accordion) return [];
    const cols = Array.from(
      accordion.querySelectorAll('.col-12.col-md-3.ig-acc-sitemap:not(.commonMarginSeparator)')
    ).slice(0, 3);
    return cols.map(col => {
      const linksSection = col.querySelector('.footer-links.section');
      return linksSection || col;
    });
  }

  function getSideColumn(footerRoot) {
    // Social/download/awards column
    return footerRoot.querySelector('.col-lg-3.social-downloads');
  }

  function getCopyrightBlock(footerRoot) {
    // Copyright block
    return footerRoot.querySelector('.col-md-12.copyright-blck');
  }

  const navColumns = getFooterColumns(element);
  const sideCol = getSideColumn(element);
  const copyrightBlock = getCopyrightBlock(element);

  // Collect all four columns for main content row
  const contentColumns = [
    navColumns[0] || document.createTextNode(''),
    navColumns[1] || document.createTextNode(''),
    navColumns[2] || document.createTextNode(''),
    sideCol || document.createTextNode('')
  ];

  // Build cells array. Header row: single cell. Remaining rows: same column count as content
  const cells = [];
  cells.push(['Columns (columns40)']); // Header row, single cell
  cells.push(contentColumns); // Content row, four columns
  if (copyrightBlock) {
    const copyrightCells = [
      document.createTextNode(''),
      document.createTextNode(''),
      document.createTextNode(''),
      copyrightBlock
    ];
    cells.push(copyrightCells);
  }

  // Create table block (header row will render as single <th> spanning all columns)
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
