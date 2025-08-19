/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must be a single column with 'Tabs (tabs12)'
  const headerRow = ['Tabs (tabs12)'];

  // Find tab labels (nav-tabs)
  const tabsHeader = element.querySelector('.nav-tabs');
  if (!tabsHeader) return;
  const tabLinks = Array.from(tabsHeader.querySelectorAll(':scope > li > a'));

  // Compose tab rows: each row is [label, content]
  const rows = [];
  tabLinks.forEach((link) => {
    const label = link.textContent.trim();
    const href = link.getAttribute('href');
    let pane = null;
    if (href && href.startsWith('#')) {
      pane = element.querySelector(href);
    }
    if (!pane) return;

    // Collect all visible child nodes (element and text)
    const contentNodes = [];
    Array.from(pane.childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        const style = node.getAttribute('style') || '';
        if (/display\s*:\s*none/i.test(style)) return;
        contentNodes.push(node);
      } else if (node.nodeType === 3) {
        const txt = node.textContent.trim();
        if (txt) {
          contentNodes.push(document.createTextNode(txt));
        }
      }
    });
    let content;
    if (contentNodes.length > 0) {
      content = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    } else if (pane.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = pane.textContent.trim();
      content = p;
    } else {
      content = '';
    }
    rows.push([label, content]);
  });

  // Assemble table rows: headerRow (single column), then each tab row (2 columns)
  const tableRows = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
