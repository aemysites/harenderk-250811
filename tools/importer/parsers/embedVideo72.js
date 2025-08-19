/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Embed (embedVideo72)'];

  // Collect all relevant direct children (divs, etc) to preserve layout and content
  // Reference the full container holding the iframe and any text
  const contentDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Sometimes source might wrap everything in one div, so fallback to original element if nothing found
  let blockContent;
  if (contentDivs.length > 0) {
    // Create a fragment with all children (preserves references)
    blockContent = document.createDocumentFragment();
    contentDivs.forEach(div => blockContent.appendChild(div));
  } else {
    blockContent = element;
  }

  // Find iframe in the block
  const iframe = blockContent.querySelector('iframe[src]');
  
  // Gather text content outside the iframe (if any)
  let textContent = '';
  blockContent.childNodes.forEach(node => {
    if (node.nodeType === 3 && node.textContent.trim()) {
      textContent += node.textContent.trim() + ' ';
    }
    if (node.nodeType === 1 && node.tagName !== 'IFRAME') {
      // Find text nodes inside child elements
      textContent += Array.from(node.childNodes)
        .filter(n => n.nodeType === 3 && n.textContent.trim())
        .map(n => n.textContent.trim())
        .join(' ');
    }
  });
  textContent = textContent.trim();

  // Compose cell content
  const cellContent = [];
  // Add any text content as paragraph
  if (textContent) {
    const p = document.createElement('p');
    p.textContent = textContent;
    cellContent.push(p);
  }
  // Add the video link
  if (iframe && iframe.src) {
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.src;
    cellContent.push(link);
  }

  // If neither, reference the blockContent (to preserve any HTML structure)
  if (cellContent.length === 0) {
    cellContent.push(blockContent);
  }

  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent]
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
