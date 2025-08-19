/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row (EXACT match)
  const headerRow = ['Hero (hero4)'];

  // 2. Get the main image for row 2
  let imgEl = null;
  const picture = element.querySelector('picture');
  if (picture) {
    imgEl = picture.querySelector('img');
  }
  // imgEl can be null if no image, cell must still exist
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Get the text content for row 3
  // Use all direct children of .eateryInnerWrap, preserving order and existing elements
  const textContent = [];
  const innerWrap = element.querySelector('.eateryInnerWrap');
  if (innerWrap) {
    // Only include element nodes that are span, h3, p, etc. in order
    Array.from(innerWrap.childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        textContent.push(node);
      }
    });
  }
  // Ensure at least an empty string if nothing collected
  const textRow = [textContent.length > 0 ? textContent : ''];

  // 4. Compose the table: 1 column, 3 rows
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  // 5. Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
