/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row
  const headerRow = ['Accordion (accordion5)'];
  const rows = [headerRow];

  // Select all accordion panels
  const accordionPanels = Array.from(element.querySelectorAll('.accordionpanel.section'));

  accordionPanels.forEach(panel => {
    // Find the <li> in each panel
    const li = panel.querySelector('li.panel');
    if (!li) return;

    // Find title: the first <span> inside <a>
    let title = null;
    const a = li.querySelector('a');
    if (a) {
      title = a.querySelector('span');
    }

    // Find content: inside .panel-collapse > .textblock.section
    let content = null;
    const collapse = li.querySelector('.panel-collapse');
    if (collapse) {
      const textBlock = collapse.querySelector('.textblock.section');
      if (textBlock) {
        // Only reference direct children that are not .clearfix and not empty
        const contentParts = [];
        Array.from(textBlock.children).forEach(child => {
          if (!child.classList.contains('clearfix') && (child.textContent.trim() !== '' || child.children.length > 0)) {
            contentParts.push(child);
          }
        });
        // If no parts were found, try to get any <p> elements inside
        if (contentParts.length === 0) {
          const paragraphs = Array.from(textBlock.querySelectorAll('p'));
          paragraphs.forEach(p => {
            if (p.textContent.trim() !== '') {
              contentParts.push(p);
            }
          });
        }
        // If still empty, fallback to empty div
        if (contentParts.length > 0) {
          content = contentParts.length === 1 ? contentParts[0] : contentParts;
        } else {
          // fallback: empty
          content = document.createElement('div');
        }
      }
    }

    // Only add the row if both title and content exist
    if (title && content) {
      rows.push([title, content]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
