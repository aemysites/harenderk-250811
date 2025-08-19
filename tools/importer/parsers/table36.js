/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with a single-cell header row per spec
  const cells = [["Table (table36)"]];

  // Find the table
  const table = element.querySelector('table');
  if (!table) return;

  // Get the column headers as the second row (multi-column)
  const thead = table.querySelector('thead');
  if (thead) {
    const tr = thead.querySelector('tr');
    if (tr) {
      const headerRow = Array.from(tr.children).map(th => th.textContent.trim());
      cells.push(headerRow);
    }
  }

  // Add visible table rows from tbody
  const tbody = table.querySelector('tbody');
  if (tbody) {
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(tr => {
      const style = tr.getAttribute('style');
      if (style && /display\s*:\s*none/i.test(style)) return;
      const tds = tr.querySelectorAll('td');
      // Each cell: include all contents (elements and text nodes)
      const row = Array.from(tds).map(td => {
        const contents = [];
        td.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            contents.push(document.createTextNode(node.textContent.trim()));
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            contents.push(node);
          }
        });
        if (contents.length === 1) return contents[0];
        if (contents.length > 1) return contents;
        return td.textContent.trim();
      });
      cells.push(row);
    });
  }

  // Replace the original element with the new block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
