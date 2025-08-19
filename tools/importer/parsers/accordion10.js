/* global WebImporter */
export default function parse(element, { document }) {
  // Find the FAQ container, which holds the accordion items
  const faqContainer = element.querySelector('.desti-service');
  if (!faqContainer) return;

  // Select all FAQ accordion items; each is a row in the accordion block
  const faqBlocks = faqContainer.querySelectorAll('[itemprop="mainEntity"][itemscope]');
  if (!faqBlocks.length) return;

  // Header must match example markdown exactly
  const rows = [['Accordion (accordion10)']];

  faqBlocks.forEach(block => {
    // Title cell: Get the visible text for the question/title
    let h6 = block.querySelector('h6');
    let titleContent;
    if (h6) {
      // Use the <strong> if present for formatting, else <p>, else the h6 directly
      if (h6.querySelector('strong')) {
        titleContent = h6.querySelector('strong');
      } else if (h6.querySelector('p')) {
        titleContent = h6.querySelector('p');
      } else {
        titleContent = h6;
      }
    } else {
      // fallback to empty string if no title found
      titleContent = '';
    }

    // Content cell: Get full answer content including all markup
    let answerElem = block.querySelector('[itemprop="acceptedAnswer"] [itemprop="text"]');
    let contentCell;
    if (answerElem) {
      // If answerElem contains multiple child nodes, preserve them all
      if (answerElem.childNodes.length > 1) {
        contentCell = Array.from(answerElem.childNodes);
      } else if (answerElem.childNodes.length === 1) {
        // Use the element itself to preserve any formatting (like links)
        contentCell = answerElem.childNodes[0].nodeType === 1 ? answerElem.childNodes[0] : answerElem;
      } else {
        contentCell = answerElem.textContent.trim();
      }
    } else {
      contentCell = '';
    }

    // Add row only if there is a title or answer
    if ((titleContent && (typeof titleContent === 'string' ? titleContent.trim() : true)) || (contentCell && (typeof contentCell === 'string' ? contentCell.trim() : true))) {
      rows.push([titleContent, contentCell]);
    }
  });

  // Create the accordion table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with the new block
  element.replaceWith(table);
}
