/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW
  const headerRow = ['Search (search68)'];

  // Extract all visible text content from the source element
  // This includes placeholder and any visible text from dropdowns
  function collectRelevantText(el) {
    // Get all unique text that is visible to users (not hidden, not in <script> etc.)
    let textList = [];
    // 1. Input placeholder (search prompt)
    const input = el.querySelector('input[type="search"]');
    if (input && input.placeholder) {
      textList.push(input.placeholder.trim());
    }
    // 2. Any dropdown or label text
    Array.from(el.querySelectorAll('*')).forEach(child => {
      // Only get visible text nodes, not attribute values
      if (child.childNodes) {
        for (const node of child.childNodes) {
          if (node.nodeType === 3 && node.textContent.trim()) {
            textList.push(node.textContent.trim());
          }
        }
      }
    });
    // Remove duplicates and empty
    const seen = new Set();
    const result = textList.filter(txt => {
      if (!txt || seen.has(txt)) return false;
      seen.add(txt);
      return true;
    });
    return result.join(' | ');
  }
  const allText = collectRelevantText(element);
  let textParagraph = null;
  if (allText) {
    textParagraph = document.createElement('p');
    textParagraph.textContent = allText;
  }

  // Canonical query index link (per block definition)
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const link = document.createElement('a');
  link.href = queryIndexUrl;
  link.textContent = queryIndexUrl;

  // Compose table rows matching the example (always 1 column)
  const cells = [
    headerRow,
    textParagraph ? [[textParagraph, link]] : [link],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}