/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header as per example
  const headerRow = ['Accordion (accordion42)'];

  // Find the accordion container
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Find all accordion items (rows)
  const items = accordion.querySelectorAll(':scope > .row.commonAnswers');
  const rows = Array.from(items).map(item => {
    // Title cell: .faq-question-wrap > .question-head
    let titleCell = null;
    const questionWrap = item.querySelector('.faq-question-wrap');
    if (questionWrap) {
      const questionHead = questionWrap.querySelector('.question-head');
      if (questionHead) {
        titleCell = questionHead;
      } else {
        // Use full .faq-question-wrap if no .question-head
        titleCell = questionWrap;
      }
    } else {
      titleCell = document.createTextNode('');
    }

    // Content cell: .cards .question-ans and any tables, paragraphs, lists, etc.
    let contentCell = null;
    const cards = item.querySelector('.cards');
    if (cards) {
      // Gather all paragraphs, tables, lists, headings from .cards .question-ans
      const ans = cards.querySelector('.question-ans');
      let answerNodes = [];
      if (ans) {
        answerNodes = Array.from(ans.childNodes).filter(node => {
          // Only include non-empty text nodes and elements
          return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
        });
      }
      // Gather all tables (e.g. fare tables) inside .cards (even if outside .question-ans)
      const tables = Array.from(cards.querySelectorAll('table'));
      // Compose the cell: all answer nodes and all tables from .cards
      const allContent = [...answerNodes, ...tables];
      // If nothing found, fallback to cards
      if (allContent.length === 0) {
        contentCell = cards;
      } else {
        contentCell = allContent;
      }
    } else {
      contentCell = document.createTextNode('');
    }

    return [titleCell, contentCell];
  });

  // Compose the table: header + rows
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
