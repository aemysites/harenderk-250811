/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: match example EXACTLY
  const cells = [['Accordion (accordion103)']];

  // Find all .textblock.section > .container.container-mob with actual content
  const containers = Array.from(element.querySelectorAll('.textblock.section > .container.container-mob'))
    .filter(c => c && c.textContent.trim());

  // If no content containers, create header-only block
  if (containers.length === 0) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
    return;
  }

  // Use only the first contentful container (as shown in example)
  const container = containers[0];
  // Gather all child nodes (including text nodes)
  const nodes = Array.from(container.childNodes);
  let i = 0;
  let currentTitle = null;
  let currentContent = [];

  // Helper to push accordion rows
  function pushAccordionRow(title, contentArr) {
    // Clean content: remove empty text and elements
    const filtered = contentArr.filter(n => {
      if (n.nodeType === 1) return n.textContent.trim();
      if (n.nodeType === 3) return n.textContent.trim();
      return false;
    });
    if (!filtered.length && !title) return;
    let titleCell = title ? title : 'Content';
    let contentCell = filtered.length === 1 ? filtered[0] : filtered;
    cells.push([titleCell, contentCell]);
  }

  // Iterate through nodes and parse accordion items
  while (i < nodes.length) {
    const node = nodes[i];
    if (node.nodeType === 1 && (/^H[2-4]$/.test(node.tagName))) {
      if (currentTitle || currentContent.length) {
        pushAccordionRow(currentTitle, currentContent);
      }
      currentTitle = node;
      currentContent = [];
    } else {
      currentContent.push(node);
    }
    i++;
  }
  // Push last accordion row
  if (currentTitle || currentContent.length) {
    pushAccordionRow(currentTitle, currentContent);
  }

  // Edge case: if no headings present, group all as one accordion item
  if (cells.length === 1) {
    const filtered = nodes.filter(n => {
      if (n.nodeType === 1) return n.textContent.trim();
      if (n.nodeType === 3) return n.textContent.trim();
      return false;
    });
    if (filtered.length) {
      cells.push(['Content', filtered.length === 1 ? filtered[0] : filtered]);
    }
  }

  // Construct the block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
