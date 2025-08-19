/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards45)'];
  const cardRows = [];
  // Each director card: .boardofdirectors.section
  const cards = element.querySelectorAll('.boardofdirectors.section');
  cards.forEach(card => {
    // Image cell: find img inside .directorImgWrap (keep reference, do not clone)
    const img = card.querySelector('.directorImgWrap img');
    // Text cell: .directorTextWrap (keep reference, do not clone)
    const textWrap = card.querySelector('.directorTextWrap');
    // Edge case: allow for missing image or textWrap
    cardRows.push([
      img || '',
      textWrap || ''
    ]);
  });
  // Only create a single table with the header and one row per card
  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
