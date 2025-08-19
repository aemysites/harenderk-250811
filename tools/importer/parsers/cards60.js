/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the cards block
  const parentBlocks = element.querySelector('.parentBLocksHP');
  if (!parentBlocks) return;
  const cards = Array.from(parentBlocks.querySelectorAll(':scope > a.wrapHpBlocks'));
  if (!cards.length) return;

  const rows = [];
  // Header row as specified
  rows.push(['Cards (cards60)']);

  cards.forEach(card => {
    // Image/icon: find the first img inside the card
    const img = card.querySelector('img');
    // Text content block: .text-csblock (contains title/desc/cta)
    const textBlock = card.querySelector('.text-csblock');
    let contentCell = document.createElement('div');
    if (textBlock) {
      // Title: span.head-common-blocks
      const titleSpan = textBlock.querySelector('.head-common-blocks');
      if (titleSpan) {
        const title = document.createElement('strong');
        title.textContent = titleSpan.textContent;
        contentCell.appendChild(title);
      }
      // Description and CTA: span.viewdetailsBlocks
      const descSpan = textBlock.querySelector('.viewdetailsBlocks');
      if (descSpan) {
        // Separate out description and CTA if possible
        // Find the <u>Know more</u> inside descSpan (CTA)
        const descText = descSpan.childNodes.length > 0 ? Array.from(descSpan.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ') : '';
        if (descText) {
          const desc = document.createElement('div');
          desc.textContent = descText;
          contentCell.appendChild(desc);
        }
        const ctaU = descSpan.querySelector('u');
        if (ctaU) {
          // Try to preserve the CTA link by using the href from parent anchor
          const ctaLink = document.createElement('a');
          ctaLink.href = card.getAttribute('href') || '#';
          ctaLink.textContent = ctaU.textContent;
          contentCell.appendChild(ctaLink);
        }
      }
    }
    rows.push([
      img,
      contentCell.childNodes.length ? contentCell : null
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
