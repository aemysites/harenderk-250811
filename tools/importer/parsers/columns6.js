/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main visual horizontal row inside this element
  const mainRow = element.querySelector('.row.check-avail');
  if (!mainRow) return;

  // Get all direct children of the main row; these are the visual columns
  const columns = Array.from(mainRow.children).filter(col => {
    // Only include columns that have some visible or meaningful content
    // (text, form fields, buttons, or links)
    // Use col.textContent for text or check if there are input/button/a children
    if (col.textContent.trim()) return true;
    if (col.querySelector('input,button,a')) return true;
    return false;
  });

  // For each column, collect all content (including text nodes and elements)
  const row = columns.map(col => {
    // If the column only contains one block element, use that block
    // Otherwise, include all childNodes (to get text and elements)
    // This is necessary to retain all content, including text
    const nodes = [];
    col.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        nodes.push(span);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        nodes.push(node);
      }
    });
    // If there are no childNodes, fallback to the column itself
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;
    return col;
  });

  // Header row must exactly match example
  const header = ['Columns (columns6)'];
  const tableCells = [header, row];

  // Create the table block and replace original element
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
