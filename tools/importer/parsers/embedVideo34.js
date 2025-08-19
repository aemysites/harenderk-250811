/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match example exactly
  const headerRow = ['Embed (embedVideo34)'];

  // Compose all block content to ensure text and video link are both present
  let contents = [];

  // Include all text nodes and element nodes from immediate children
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const txt = node.textContent.trim();
      if (txt) contents.push(txt);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      contents.push(node);
    }
  });

  // Find any iframe (video embed) src to add as a link (required for semantic meaning)
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    // Ensure link is only added if not already present
    let alreadyLinked = false;
    contents.forEach(item => {
      if (item instanceof HTMLAnchorElement && item.href === iframe.src) {
        alreadyLinked = true;
      }
    });
    if (!alreadyLinked) {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      contents.push(link);
    }
  }

  // Guarantee at least one cell entry
  if (contents.length === 0) contents = [''];

  const cells = [
    headerRow,
    [contents]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
