/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the three column blocks from the left
  const containerLinks = element.querySelector('.container__links');
  const columnCells = [];
  if (containerLinks) {
    const accordionItems = Array.from(containerLinks.children);
    accordionItems.forEach(acc => {
      // Heading
      const headingBtn = acc.querySelector('.cmp-accordion__button');
      let headingEl = '';
      if (headingBtn) {
        headingEl = document.createElement('div');
        headingEl.textContent = headingBtn.childNodes[0] ? headingBtn.childNodes[0].textContent.trim() : '';
        headingEl.style.fontWeight = 'bold';
      }
      // Links list
      let listEl = '';
      const panel = acc.querySelector('.cmp-accordion__panel');
      if (panel) {
        const childLinks = panel.querySelector('ul.child-links');
        if (childLinks) {
          listEl = childLinks;
        }
      }
      // Cell content
      const cell = [];
      if (headingEl) cell.push(headingEl);
      if (listEl) cell.push(listEl);
      columnCells.push(cell.length ? cell : '');
    });
  }
  // Extract the social block (rightmost column)
  const social = element.querySelector('.social-links');
  const socialCell = [];
  if (social) {
    // Social section
    const socialHeader = Array.from(social.querySelectorAll('h3')).find(h => h.textContent.trim().toLowerCase() === 'social');
    if (socialHeader) {
      socialCell.push(socialHeader);
      const mediaList = social.querySelector('.social-links__media');
      if (mediaList) socialCell.push(mediaList);
      const whatsappDiv = social.querySelector('.social-links__whatsappSupport');
      if (whatsappDiv) socialCell.push(whatsappDiv);
    }
    // Download section
    const downloadHeader = Array.from(social.querySelectorAll('h3')).find(h => h.textContent.trim().toLowerCase() === 'download');
    if (downloadHeader) {
      socialCell.push(downloadHeader);
      let downloadDiv = downloadHeader.nextElementSibling;
      if (downloadDiv && downloadDiv.classList.contains('social-links__whatsappSupport')) {
        socialCell.push(downloadDiv);
      }
    }
    // Awards section
    const awardsHeader = Array.from(social.querySelectorAll('h3')).find(h => h.textContent.trim().toLowerCase().includes('award'));
    if (awardsHeader) {
      socialCell.push(awardsHeader);
      let awardsDiv = awardsHeader.nextElementSibling;
      if (awardsDiv && awardsDiv.classList.contains('social-links__whatsappSupport')) {
        socialCell.push(awardsDiv);
      }
    }
  }
  // Compose header row (single column, as required)
  const headerRow = ['Columns (columns18)'];
  // Compose content row with four columns
  const contentRow = [
    columnCells[0] || '',
    columnCells[1] || '',
    columnCells[2] || '',
    socialCell.length ? socialCell : ''
  ];
  // The cells array is [[headerRow],[contentRow]], so header is one cell row, content is one row with 4 cells
  const cells = [headerRow, contentRow];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
