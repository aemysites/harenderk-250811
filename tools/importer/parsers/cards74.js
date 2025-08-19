/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards74)'];

  // Find each card (immediate .promotional-slide--carosuel--item within the carousel)
  const cardItems = Array.from(element.querySelectorAll('.promotional-slide--carosuel--item'));

  // Helper function to get the first direct image (main card tile image)
  function getMainImg(card) {
    return card.querySelector('img.promotional-slide__offer-tile__img');
  }

  // Helper function to gather text content and secondary image, expiry, etc.
  function getTextContent(card) {
    // We'll aggregate heading, description, secondary image/icon, and expiry/T&C
    const fragment = document.createElement('div');
    
    // Extract heading/description
    const headingSection = card.querySelector('.promotional-slide--heading-section');
    if (headingSection) {
      // Usually contains .ig-promotion-text with <p> inside
      const promoText = headingSection.querySelector('.ig-promotion-text');
      if (promoText) {
        // Use all its children (preserves any <b>, <span> styling)
        Array.from(promoText.childNodes).forEach(node => {
          fragment.appendChild(node);
        });
      }
    }

    // Secondary image/icon (if present)
    const iconImg = card.querySelector('.promotional-slide--img img');
    if (iconImg) {
      fragment.appendChild(document.createElement('br'));
      fragment.appendChild(iconImg);
    }

    // Expiry and T&C
    const tnc = card.querySelector('.promotional-slide--tnc');
    if (tnc) {
      fragment.appendChild(document.createElement('br'));
      Array.from(tnc.childNodes).forEach(node => {
        fragment.appendChild(node);
      });
    }

    return fragment.childNodes.length > 0 ? fragment : '';
  }

  // Build rows: one per card
  const rows = cardItems.map(card => {
    const img = getMainImg(card);
    const textContent = getTextContent(card);
    return [img, textContent];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}