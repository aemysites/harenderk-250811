/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns37)'];

  // Get all top-level columns (each .col-12 is a column)
  const columns = Array.from(element.querySelectorAll(':scope > div.col-12'));

  // Prepare the array for the second row (columns)
  const cellsRow = columns.map(col => {
    // Find the heading button
    const btn = col.querySelector('button');
    // Find the ul list
    const ul = col.querySelector('ul');
    // Compose cell content
    const fragment = document.createDocumentFragment();
    if (btn) {
      const h = document.createElement('h3');
      h.textContent = btn.textContent.trim();
      fragment.appendChild(h);
    }
    if (ul) {
      // We'll build a new ul referencing the existing anchors (except 'View all')
      const listItems = Array.from(ul.querySelectorAll('li.faq-tc-item'));
      const ulOut = document.createElement('ul');
      let hasRealItem = false;
      listItems.forEach(li => {
        const a = li.querySelector('a');
        if (a && !a.classList.contains('faq-view-all')) {
          // Reference the existing anchor if possible, as a child of a new li
          const liOut = document.createElement('li');
          liOut.appendChild(a);
          ulOut.appendChild(liOut);
          hasRealItem = true;
        }
      });
      if (hasRealItem) {
        fragment.appendChild(ulOut);
      }
      // If there is a 'View all' link, add it after the ul
      const viewAllA = ul.querySelector('a.faq-view-all');
      if (viewAllA) {
        // Reference the existing anchor if possible
        fragment.appendChild(viewAllA);
      }
    }
    return fragment;
  });

  // Compose the block table
  const cells = [headerRow, cellsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
