/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the block name and variant precisely
  const headerRow = ['Cards (cards57)'];

  // Find all card containers: immediate children of the .row.foodmenumargin div
  const cardContainers = element.querySelectorAll('.row.foodmenumargin > div');
  const rows = [];

  cardContainers.forEach(card => {
    // --- Image Cell ---
    // If element has <picture>, use it directly, otherwise use <img> directly
    let imageCell = null;
    const picture = card.querySelector('picture');
    if (picture) {
      imageCell = picture;
    } else {
      const img = card.querySelector('img');
      if (img) imageCell = img;
    }

    // --- Text Cell ---
    // Wrap-foodmenu contains wrapfoodcontent (foodname, price, icon)
    const contentDiv = card.querySelector('.wrapfoodcontent');
    let textCellFrag = document.createDocumentFragment();
    if (contentDiv) {
      // Title (mandatory, styled bold)
      const titleDiv = contentDiv.querySelector('.wrap-foodname');
      if (titleDiv) {
        const strong = document.createElement('strong');
        strong.textContent = titleDiv.textContent.trim();
        textCellFrag.appendChild(strong);
        textCellFrag.appendChild(document.createElement('br'));
      }
      // Description (optional, not present)
      // Only price present
      const priceDiv = contentDiv.querySelector('.wrap-foodprice');
      if (priceDiv) {
        // Reference the existing priceDiv (with icon and price)
        textCellFrag.appendChild(priceDiv);
      }
    }

    // Add to rows, always two cells per card
    rows.push([imageCell, textCellFrag]);
  });

  // Create table: header row first, then card rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
