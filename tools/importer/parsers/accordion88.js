/* global WebImporter */
export default function parse(element, { document }) {
  // Compose table rows
  const rows = [['Accordion (accordion88)']]; // Header exactly matching example

  // Find the main content column
  const col10 = element.querySelector('.col-12.col-lg-10');
  const mainContent = col10 || element;

  // Find all direct .textblock.section children (each is an accordion item)
  const textBlocks = Array.from(mainContent.querySelectorAll('.textblock.section'));

  textBlocks.forEach(tb => {
    // tbContent is the .textblock.section > div (may contain headings, paragraphs, images, lists, etc)
    const tbContent = tb.querySelector('div');
    if (!tbContent) return;

    // Try to find the accordion title
    // Prefer h2 > span, h2 > b, h2, then fallback to first paragraph
    let titleElem = tbContent.querySelector('h2 > span, h2 > b, h2');
    let title = '';
    if (titleElem) {
      // If h2 > span/b, get its textContent
      if (titleElem.children.length > 0 && (titleElem.children[0].tagName === 'B' || titleElem.children[0].tagName === 'SPAN')) {
        title = titleElem.children[0].textContent.trim();
      } else {
        title = titleElem.textContent.trim();
      }
    } else {
      // Fallback: first <p>
      const firstP = tbContent.querySelector('p');
      if (firstP) title = firstP.textContent.trim();
    }
    // Defensive fallback
    if (!title) title = '';

    // Gather all content except the title element
    const contentElems = [];
    Array.from(tbContent.children).forEach(child => {
      // Exclude the title element
      if (child !== titleElem) {
        contentElems.push(child);
      }
    });

    // If only the title element exists (no content), use it
    if (contentElems.length === 0 && titleElem) {
      contentElems.push(titleElem);
    }

    // If contentElems is empty and first <p> exists, use it
    if (contentElems.length === 0) {
      const firstP = tbContent.querySelector('p');
      if (firstP) contentElems.push(firstP);
    }

    // Reference all content elements as a single cell (array)
    rows.push([
      title,
      contentElems.length === 1 ? contentElems[0] : contentElems
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with block table
  element.replaceWith(block);
}
