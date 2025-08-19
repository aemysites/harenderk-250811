/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const cells = [['Cards (cards33)']];

  // The cards are in .row > .col-sm-3 (flexible query)
  const cardColumns = element.querySelectorAll('.row > div');

  cardColumns.forEach(col => {
    const tupple = col.querySelector('.award-tupple');
    if (!tupple) return;

    // Get image: reference existing img element
    const img = tupple.querySelector('img');

    // Get text content (all text except image)
    // Find <h5> (main text), and <span> (CTA)
    const textCell = document.createElement('div');
    const h5 = tupple.querySelector('h5');
    if (h5) {
      // Preserve formatting (including <br>), and reference existing h5
      textCell.appendChild(h5);
    }
    const span = tupple.querySelector('span');
    const link = tupple.querySelector('a');
    if (span && link && span.textContent.trim()) {
      // Reference <span> as CTA, create <a> using link's href but reference the text from span
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || '#';
      a.innerHTML = span.innerHTML;
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(a);
    }

    // Add the row. Reference existing img and textCell
    cells.push([
      img,
      textCell
    ]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
