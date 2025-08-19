/* global WebImporter */
export default function parse(element, { document }) {
  // Block header exactly as required
  const headerRow = ['Embed (embedVideo100)'];

  // Find the deepest direct child container for content
  let contentContainer = element;
  const container = element.querySelector('.container, .container-mob');
  if (container) contentContainer = container;

  // Gather all direct children (preserve all text & element nodes)
  const sectionContent = [];
  Array.from(contentContainer.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // For an iframe: embed plus link in order
      if (node.tagName === 'DIV' && node.querySelector('iframe')) {
        const iframe = node.querySelector('iframe');
        sectionContent.push(iframe);
        if (iframe && iframe.src) {
          const link = document.createElement('a');
          link.href = iframe.src;
          link.textContent = iframe.src;
          sectionContent.push(link);
        }
      } else {
        sectionContent.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // Non-empty text nodes
      sectionContent.push(document.createTextNode(node.textContent));
    }
  });

  // Create block table with header and content
  const cells = [headerRow, [sectionContent]];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}