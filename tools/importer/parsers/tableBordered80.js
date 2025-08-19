/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to determine if a node is a table element
  function isTable(node) {
    return node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'table';
  }

  // Helper to determine if a node is ignorable (empty text node or whitespace-only)
  function isIgnorable(node) {
    if (!node) return true;
    if (node.nodeType === Node.TEXT_NODE) return !node.textContent.trim();
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Ignore empty divs, spans, etc.
      if (node.tagName === 'HR') return true;
      if (node.children.length === 0 && !node.textContent.trim()) return true;
    }
    return false;
  }

  // Helper to create a block table for a content chunk
  function createBlock(content) {
    const headerRow = ['Table (bordered, tableBordered80)'];
    return WebImporter.DOMUtils.createTable([headerRow, [content]], document);
  }

  // Step 1: Walk through child nodes, grouping contiguous narrative and table nodes separately.
  let blocks = [];
  let narrative = [];
  let nodeList = Array.from(element.childNodes);

  function flushNarrative() {
    const filtered = narrative.filter(n => !isIgnorable(n));
    if (filtered.length) {
      blocks.push(createBlock(filtered.length === 1 ? filtered[0] : filtered));
    }
    narrative = [];
  }

  nodeList.forEach(node => {
    if (isIgnorable(node)) return;
    if (isTable(node)) {
      flushNarrative();
      blocks.push(createBlock(node));
    } else {
      // For text nodes, wrap in a span to preserve text
      if (node.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        narrative.push(span);
      } else {
        narrative.push(node);
      }
    }
  });
  flushNarrative();

  // Step 2: Replace the original element with all the block tables in sequence
  if (blocks.length === 0) return;
  let prev = element;
  blocks.forEach((block, idx) => {
    if (idx === 0) {
      prev.replaceWith(block);
    } else {
      prev.after(block);
    }
    prev = block;
  });
}
