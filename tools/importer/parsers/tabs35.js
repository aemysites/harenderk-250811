/* global WebImporter */
export default function parse(element, { document }) {
  // Header: first row, single cell
  const cells = [['Tabs (tabs35)']];

  // Prefer mobile tabs if present
  const mobileTabsWrap = element.querySelector('.truely-tiles-mob');
  if (mobileTabsWrap) {
    const navLinks = mobileTabsWrap.querySelectorAll('.nav-link');
    const tabContentWrappers = mobileTabsWrap.querySelectorAll('.tabs-mob-content');
    for (let i = 0; i < navLinks.length && i < tabContentWrappers.length; i++) {
      const label = navLinks[i].textContent.trim();
      const contentEl = tabContentWrappers[i];
      // Collect all child nodes as an array, referencing original nodes (not clones)
      const tabContent = Array.from(contentEl.childNodes).filter(node => {
        return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
      });
      cells.push([label, tabContent]); // one row, two columns: [label, content]
    }
  } else {
    // Desktop fallback: two tabs, two blocks
    const sectionDesktop = element.querySelector('.section-1.menu-wrapper');
    if (sectionDesktop) {
      const tilesContainers = sectionDesktop.querySelectorAll('.tiles-container.text-center');
      tilesContainers.forEach((tilesEl, idx) => {
        let label = '';
        const img = tilesEl.querySelector('img[alt]');
        if (img && img.getAttribute('alt')) {
          label = img.getAttribute('alt').trim();
        } else {
          const h4 = tilesEl.querySelector('h4');
          if (h4) label = h4.textContent.trim();
        }
        if (!label) label = `Tab ${idx + 1}`;
        const tabContent = Array.from(tilesEl.childNodes).filter(node => {
          return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
        });
        cells.push([label, tabContent]);
      });
    }
  }

  // If no tabs found, fallback to whole block as a single tab
  if (cells.length === 1) {
    const contentNodes = Array.from(element.childNodes).filter(node => {
      return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
    });
    cells.push(['Cards', contentNodes]);
  }

  // Adjust: Make sure header row has only 1 column, all other rows have exactly 2 columns
  // This is already enforced by code above

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
