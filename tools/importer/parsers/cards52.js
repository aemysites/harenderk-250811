/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matching the block name
  const headerRow = ['Cards (cards52)'];
  const rows = [];

  // Get all direct child card columns
  const cardCols = Array.from(element.querySelectorAll(':scope > div'));

  cardCols.forEach(cardCol => {
    const tileRoot = cardCol.querySelector('.addons-tile-root');
    if (!tileRoot) return;

    // --- IMAGE ---
    let imgEl = null;
    const picture = tileRoot.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) imgEl = img;
    }

    // --- TEXT BLOCK ---
    // Compose a block with all text and links (no markdown, only HTML)
    const textBlock = document.createElement('div');

    // Title (prefer desktop, fallback to mobile). Always output as <strong>.
    let title = '';
    const desktopTitle = tileRoot.querySelector('.ig-common-title.addons-title.d-none.d-md-block');
    const mobileTitle = tileRoot.querySelector('.ig-common-title.addons-title.d-md-none');
    if (desktopTitle && desktopTitle.childNodes.length) {
      title = desktopTitle.childNodes[0].textContent.trim();
    } else if (mobileTitle && mobileTitle.childNodes.length) {
      title = mobileTitle.childNodes[0].textContent.trim();
    }
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textBlock.appendChild(strong);
    }

    // Description + visible links (Read More only if visible)
    const descEl = tileRoot.querySelector('.ig-common-subtitle.addons-desc');
    if (descEl) {
      // Description text (from any span)
      Array.from(descEl.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'SPAN') {
            const descDiv = document.createElement('div');
            descDiv.textContent = node.textContent.trim();
            textBlock.appendChild(descDiv);
          } else if (node.tagName === 'A' && !node.classList.contains('d-none') && node.textContent.trim()) {
            textBlock.appendChild(node);
          }
        }
      });
      // If there's meaningful text directly in descEl (outside of span/a), keep it
      if (descEl.childNodes.length) {
        Array.from(descEl.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const txtDiv = document.createElement('div');
            txtDiv.textContent = node.textContent.trim();
            textBlock.appendChild(txtDiv);
          }
        });
      }
    }

    // Price block: combine all visible span texts
    const priceDiv = tileRoot.querySelector('.ig-common-price.d-flex');
    if (priceDiv) {
      const priceSpans = Array.from(priceDiv.querySelectorAll('span'));
      const priceText = priceSpans.map(span => span.textContent.trim()).filter(Boolean).join(' ');
      if (priceText) {
        const priceElem = document.createElement('div');
        priceElem.textContent = priceText;
        textBlock.appendChild(priceElem);
      }
    }

    // Only add row if image and at least one text content
    if (imgEl && textBlock.childNodes.length) {
      rows.push([imgEl, textBlock]);
    }
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
