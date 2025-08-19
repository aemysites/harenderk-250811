/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match: 'Cards (cards84)'
  const headerRow = ['Cards (cards84)'];

  // Find card containers from the HTML structure
  // .disabilityassistance > .container > .disable-assistance-wrapper > .row > .col-md-6.disability-assist-Wrap
  const rowDiv = element.querySelector('.disable-assistance-wrapper .row');
  if (!rowDiv) return;
  const cardDivs = Array.from(rowDiv.children).filter(div => div.classList.contains('disability-assist-Wrap'));

  // For each card, create a row: [icon, text-content]
  const rows = cardDivs.map(cardDiv => {
    // Card link
    const link = cardDiv.querySelector('a');
    if (!link) return null;
    // Card content container
    const cardContent = link.querySelector('.special-assistance-container');
    if (!cardContent) return null;

    // --- First cell: Icon or image (mandatory) ---
    // Select the icon div as-is
    const iconDiv = cardContent.querySelector('.sac-icon');
    // If no icon, put null
    const iconCell = iconDiv || null;

    // --- Second cell: Text (title, description, CTA) ---
    const textElements = [];
    // Title (h4)
    const title = cardContent.querySelector('h4');
    if (title) textElements.push(title);
    // Description (p)
    const desc = cardContent.querySelector('p');
    if (desc) textElements.push(desc);
    // CTA (button in .sac-action)
    const actionDiv = cardContent.querySelector('.sac-action');
    if (actionDiv) {
      const btn = actionDiv.querySelector('button');
      if (btn && link.getAttribute('href')) {
        // Create an <a> with href and button text
        const ctaLink = document.createElement('a');
        ctaLink.href = link.getAttribute('href');
        ctaLink.textContent = btn.textContent;
        textElements.push(ctaLink);
      }
    }
    // If no text elements, ensure cell is not empty
    const textCell = textElements.length > 0 ? textElements : [''];

    return [iconCell, textCell];
  }).filter(row => !!row);

  // Compose table array
  const tableArray = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(blockTable);
}
