/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Cards (cards11)'];
  const cells = [headerRow];

  // Find all containers with cards structure
  const containers = Array.from(element.querySelectorAll('.container.container-mob'));
  containers.forEach(container => {
    // Each card is an anchor
    const cardLinks = Array.from(container.querySelectorAll('.wrapHpBlocks'));
    cardLinks.forEach(card => {
      // Image: must be present
      const img = card.querySelector('img');
      // Text block
      const textBlock = card.querySelector('.text-csblock');
      let cardTitle = '', cardTitleElem = null, descElem = null, ctaElem = null;
      if (textBlock) {
        // Title
        const titleElem = textBlock.querySelector('.head-common-blocks');
        if (titleElem && titleElem.textContent.trim()) {
          cardTitleElem = document.createElement('strong');
          cardTitleElem.textContent = titleElem.textContent.trim();
        }
        // Description + CTA
        const detailsElem = textBlock.querySelector('.viewdetailsBlocks');
        if (detailsElem) {
          // Separate description and CTA
          // Usually: text then <u>Know more</u>
          let descText = '';
          detailsElem.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              descText += node.textContent.trim();
            }
          });
          if (descText) {
            descElem = document.createElement('span');
            descElem.textContent = descText;
          }
          const uTag = detailsElem.querySelector('u');
          if (uTag && card.href) {
            ctaElem = document.createElement('a');
            ctaElem.href = card.href;
            ctaElem.textContent = uTag.textContent.trim();
          }
        }
      }
      // Compose the second cell's content, preserving layout
      const secondCell = [];
      if (cardTitleElem) {
        secondCell.push(cardTitleElem);
      }
      if (descElem) {
        if (secondCell.length) secondCell.push(document.createElement('br'));
        secondCell.push(descElem);
      }
      if (ctaElem) {
        if (secondCell.length) secondCell.push(document.createElement('br'));
        secondCell.push(ctaElem);
      }
      // Always two columns in the row
      cells.push([
        img,
        secondCell
      ]);
    });
  });

  // Only replace if any cards found
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
