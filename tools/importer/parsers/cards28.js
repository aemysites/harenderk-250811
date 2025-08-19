/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards28)'];
  let cardRows = [];

  // Find all card elements (works for both variants)
  let cards = Array.from(element.querySelectorAll('.ig-carosuel-item-round-format'));
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll('.ig-slide-item.ig-dest.pop-tiles'));
  }
  // Ensure we don't process any non-card elements
  cards = cards.filter(card => {
    // There must be at least one image inside
    return card.querySelector('img');
  });

  cards.forEach(cardEl => {
    // Image: always present
    let imageEl = cardEl.querySelector('img');
    if (!imageEl) {
      // Try to get from <picture>
      const picture = cardEl.querySelector('picture');
      if (picture) imageEl = picture.querySelector('img');
    }

    // Text cell construction
    let textCellContent = [];
    let destInfo = cardEl.querySelector('.dest-info');
    if (!destInfo) {
      // fallback: parent of .dest-info-heading
      const heading = cardEl.querySelector('.dest-info-heading');
      if (heading && heading.parentElement) {
        destInfo = heading.parentElement;
      }
    }

    // Title as heading
    const titleEl = destInfo ? destInfo.querySelector('.dest-info-heading') : null;
    if (titleEl) {
      textCellContent.push(titleEl);
    }

    // Description: price and 'From'
    // Typically, 'From' and price are siblings within destInfo
    const fromTxt = destInfo ? destInfo.querySelector('.frm-txt') : null;
    const priceTxt = destInfo ? destInfo.querySelector('.dest-price') : null;
    if (fromTxt || priceTxt) {
      // Group 'From' and price together exactly as shown
      const para = document.createElement('p');
      if (fromTxt) {
        para.appendChild(fromTxt);
        para.appendChild(document.createTextNode(' '));
      }
      if (priceTxt) {
        para.appendChild(priceTxt);
      }
      textCellContent.push(para);
    }

    // If neither title nor price/fallback found, add any remaining text (robust fallback)
    if (textCellContent.length === 0) {
      // Get all text nodes under destInfo (if present), fallback to cardEl text
      if (destInfo && destInfo.textContent.trim()) {
        textCellContent.push(document.createTextNode(destInfo.textContent.trim()));
      } else {
        textCellContent.push(document.createTextNode(cardEl.textContent.trim()));
      }
    }

    // Add row: image in first cell, text cell in second
    cardRows.push([
      imageEl,
      textCellContent
    ]);
  });
  const tableData = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
