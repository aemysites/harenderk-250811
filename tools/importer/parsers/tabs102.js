/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // =====================
  // 1. Get Tab Labels
  // =====================
  let tabLabels = [];
  const tabNav = element.querySelector('.nav.nav-tabs');
  if (tabNav) {
    const tabLinks = tabNav.querySelectorAll('a');
    tabLabels = Array.from(tabLinks).map(a => a.textContent.trim());
  }
  
  // =====================
  // 2. Get Tab Panes
  // =====================
  let tabPanes = [];
  const tabContent = element.querySelector('.tab-content');
  if (tabContent) {
    tabPanes = Array.from(tabContent.querySelectorAll('.tab-pane'));
  } else {
    tabPanes = Array.from(element.querySelectorAll('.tab-pane'));
  }

  // =====================
  // 3. Build Block Table
  // =====================
  // Header: block name (per requirements)
  const headerRow = ['Tabs (tabs102)'];
  // Columns: Tab Label | Tab Content
  const colHeaderRow = tabLabels.length > 0 ? tabLabels : tabPanes.map((_, i) => `Tab ${i + 1}`);
  // The correct structure per the markdown and description is:
  // First row: block name as a single cell
  // Each following row: tab label (cell 1), tab content (cell 2)
  const table = [headerRow];

  for (let i = 0; i < tabPanes.length; i++) {
    // Tab label
    const label = tabLabels[i] || `Tab ${i + 1}`;
    // Tab content: reference the correct content inside the tab pane
    // Usually within .textblock.section .container, but fallback to .textblock.section or .tab-pane itself
    let contentElem = null;
    let textblock = tabPanes[i].querySelector('.textblock.section');
    if (textblock) {
      let mainContainer = textblock.querySelector('.container.container-mob');
      contentElem = mainContainer || textblock;
    } else {
      contentElem = tabPanes[i];
    }
    // Remove any inner nav, tab headers, or tab-content duplication inside contentElem
    // (defensively, but these should not occur)
    const innerNavs = contentElem.querySelectorAll('.nav, .nav-tabs, .tab-content');
    innerNavs.forEach(nav => nav.remove());
    // Push row: [label, contentElem]
    table.push([label, contentElem]);
  }

  // =====================
  // 4. Replace Original Element
  // =====================
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}