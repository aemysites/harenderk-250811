/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must be single cell spanning all columns
  const headerRow = ['Columns (columns38)'];

  // Columns: left side (title), right side (share/search)
  const leftSection = element.querySelector('.left-section');
  const rightSection = element.querySelector('.addons-right-section');

  // Compose left column: include all children of leftSection (usually title)
  const leftColumn = leftSection ? Array.from(leftSection.childNodes).filter((el) => {
    // Remove empty text nodes and .subtitle elements (d-none)
    if (el.nodeType === Node.TEXT_NODE && !el.textContent.trim()) return false;
    if (el.nodeType === Node.ELEMENT_NODE && el.classList.contains('subtitle')) return false;
    return true;
  }) : [];

  // Compose right column: include share and search
  const rightColumn = [];
  if (rightSection) {
    const shareBtn = rightSection.querySelector('.ats-share-btn');
    if (shareBtn) rightColumn.push(shareBtn);
    const searchForm = rightSection.querySelector('.addons-search-form');
    if (searchForm) {
      // Compose a wrapper for icon and input
      const icon = searchForm.querySelector('i.icon-search-new');
      const input = searchForm.querySelector('input.addons-search-input');
      const wrapper = document.createElement('div');
      if (icon) wrapper.appendChild(icon);
      if (input) wrapper.appendChild(input);
      rightColumn.push(wrapper);
    }
  }

  // The block table must have: header row as single cell, second row as two columns
  const cells = [
    [headerRow[0]], // single cell header row
    [leftColumn, rightColumn] // multi-column row
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Set colspan on header cell so it spans all columns
  const headerTh = block.querySelector('tr:first-child th');
  if (headerTh) {
    headerTh.setAttribute('colspan', '2');
  }

  // Replace original element
  element.replaceWith(block);
}
