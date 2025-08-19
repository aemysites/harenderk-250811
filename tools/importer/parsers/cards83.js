/* global WebImporter */
export default function parse(element, { document }) {
  // Utility: get all immediate card elements
  const cardNodes = Array.from(element.querySelectorAll('.disability-assist-Wrap'));

  // Header row
  const cells = [['Cards (cards83)']];

  cardNodes.forEach(cardNode => {
    const link = cardNode.querySelector('a');
    if (!link) return;
    const card = link.querySelector('.special-assistance-container');
    if (!card) return;

    // --- First cell: Icon ---
    let iconCell = '';
    const iconDiv = card.querySelector('.sac-icon');
    if (iconDiv) iconCell = iconDiv;

    // --- Second cell: Text column ---
    const textItems = [];

    // Heading
    const heading = card.querySelector('h4');
    if (heading) textItems.push(heading);

    // Description
    const desc = card.querySelector('p');
    if (desc) textItems.push(desc);

    // CTA: Button as a link
    const action = card.querySelector('.sac-action button');
    if (action && link.getAttribute('href')) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = action.textContent;
      textItems.push(a);
    } else if (action) {
      textItems.push(action);
    }

    cells.push([iconCell, textItems]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
