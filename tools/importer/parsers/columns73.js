/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Columns (columns73)'];

  // Find the columns (direct children of .row.commonAdOnsWrap)
  const row = element.querySelector('.row.commonAdOnsWrap');
  if (!row) return;
  const columns = Array.from(row.children).filter(el => el.classList.contains('commonBottomAdon'));

  // For each column, extract: image (inside <picture>), step title (h6), and step description (p)
  const contentRow = columns.map(col => {
    // Image (inside <picture>)
    const picture = col.querySelector('picture');
    // Title (h6)
    const title = col.querySelector('.ig-common-title');
    // Subtitle/Description (p)
    const subtitle = col.querySelector('.ig-common-subtitle');
    // Compose cell as an array of elements (in order)
    const cellContent = [];
    if (picture) cellContent.push(picture);
    if (title) cellContent.push(title);
    if (subtitle) cellContent.push(subtitle);
    return cellContent;
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element
  element.replaceWith(table);
}
