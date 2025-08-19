/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match exactly
  const headerRow = ['Search (search67)'];

  // Collect all visible, user-facing text content from the element
  const contentBits = [];

  // If there's an input with a placeholder, include it
  const input = element.querySelector('input[type="search"]');
  if (input && input.placeholder && input.placeholder.trim()) {
    const p = document.createElement('p');
    p.textContent = input.placeholder.trim();
    contentBits.push(p);
  }

  // Include all top-level span text under the search block (e.g. icon labels, popular)
  Array.from(element.querySelectorAll(':scope span'))
    .forEach(span => {
      const text = span.textContent.trim();
      if (text) {
        // Avoid duplicate placeholder text
        if (!contentBits.some(b => b.textContent === text)) {
          const p = document.createElement('p');
          p.textContent = text;
          contentBits.push(p);
        }
      }
    });

  // Include all dropdown city/country text
  Array.from(element.querySelectorAll('.dropdown-option .location-title'))
    .forEach(loc => {
      const text = loc.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        contentBits.push(p);
      }
    });

  // If any disclaimer exists in the embedded data, include it.
  if (element.dataset.componentData) {
    try {
      const data = JSON.parse(element.dataset.componentData.replace(/&quot;/g, '"'));
      if (data.disclaimer && data.disclaimer.trim()) {
        const p = document.createElement('p');
        p.textContent = data.disclaimer.trim();
        contentBits.push(p);
      }
    } catch(e) { /* ignore parse error */ }
  }

  // Always add the search index URL (matches the example structure)
  // This is not present in the DOM, so must be inserted here
  const searchIndexUrl = 'https://main--goindigo--hlxsites.hlx.page/query-index.json';
  const a = document.createElement('a');
  a.href = searchIndexUrl;
  a.textContent = searchIndexUrl;
  contentBits.push(a);

  // Table must match example: 1 column, 2 rows. 2nd row is all content in a single cell.
  const cells = [
    headerRow,
    [contentBits]
  ];

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
